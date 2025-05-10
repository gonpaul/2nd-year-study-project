import Database from 'better-sqlite3';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
import operations from './operations.js';
import dotenv from "dotenv";
dotenv.config({ override: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(process.env.NODE_ENV);
const config = {
  development: {
    type: 'sqlite',
    database: path.join(__dirname, '..', 'database.sqlite'),
    verbose: console.log
  },
  production: {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'matrix_calculator',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD
  }
};

class DatabaseConnection extends Database {
  constructor() {
    super()
    this.connection = null;
    this.environment = process.env.NODE_ENV || 'development';
    this.config = config[this.environment];
  }

  connect() {
    if (this.connection) {
      return this.connection;
    }
    // Ensure config exists
    if (!this.config) {
      throw new Error(`No configuration found for environment: ${this.environment}`);
    }

    if (this.config.type === 'sqlite') {
      this.connection = new Database(this.config.database, this.config);
      console.log('Connected to SQLite database');
    } else {
      const pool = new pg.Pool(this.config);
      this.connection = pool;
      console.log('Connected to PostgreSQL database');
    }

    return this.connection;
  }

  async query(sql, params = []) {
    const db = this.connect();
    
    if (this.config.type === 'sqlite') {
      if (sql.trim().toLowerCase().startsWith('select')) {
        return db.prepare(sql).all(params);
      }
      return db.prepare(sql).run(params);
    } else {
      const client = await db.connect();
      try {
        const result = await client.query(sql, params);
        return result.rows;
      } finally {
        client.release();
      }
    }
  }

  close() {
    if (this.connection) {
      if (this.config.type === 'sqlite') {
        this.connection.close();
      } else {
        this.connection.end();
      }
      this.connection = null;
    }
  }

  async updateOperations() {
    try {
      // Get existing operations count
      const result = await this.query('SELECT COUNT(*) as cnt FROM operations');
      const existingCount = this.config.type === 'sqlite' 
        ? result[0].cnt 
        : parseInt(result[0].cnt);

      // Create operations table if it doesn't exist
      await this.query(`
        CREATE TABLE IF NOT EXISTS operations (
          operation_id ${this.config.type === 'sqlite' ? 'INTEGER PRIMARY KEY AUTOINCREMENT' : 'SERIAL PRIMARY KEY'},
          operation_name TEXT NOT NULL UNIQUE,
          description TEXT,
          is_binary INTEGER NOT NULL
        )
      `);

      // Insert operations based on whether the table is empty or not
      if (existingCount === 0) {
        for (const type in operations) {
          for (const op of operations[type]) {
            const isBinary = (type === 'binary') ? 1 : 0;
            await this.query(
              `INSERT INTO operations (operation_name, description, is_binary) 
               VALUES (?, ?, ?)
               ON CONFLICT (operation_name) DO NOTHING`,
              [op.name, op.description, isBinary]
            );
          }
        }
        console.log('Operations table has been filled with initial data.');
      } else {
        // Table already has entries, add only missing ones
        for (const type in operations) {
          for (const op of operations[type]) {
            const isBinary = (type === 'binary') ? 1 : 0;
            await this.query(
              `INSERT INTO operations (operation_name, description, is_binary) 
               VALUES (?, ?, ?)
               ON CONFLICT (operation_name) DO NOTHING`,
              [op.name, op.description, isBinary]
            );
          }
        }
        console.log('Operations table has been updated with missing entries.');
      }

      // Log all operations in the table after update
      const allOperations = await this.query('SELECT * FROM operations ORDER BY operation_id');
      console.log('Current operations in database:');
      console.table(allOperations);

    } catch (error) {
      console.error('Error updating operations:', error);
      throw error;
    }
  }

  async initDatabase() {
    try {
      // Create tables with PostgreSQL/SQLite compatible syntax
      await this.query(`
        CREATE TABLE IF NOT EXISTS users (
          user_id ${this.config.type === 'sqlite' ? 'INTEGER PRIMARY KEY AUTOINCREMENT' : 'SERIAL PRIMARY KEY'},
          username TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          created_at ${this.config.type === 'sqlite' ? 'DATETIME' : 'TIMESTAMP'} NOT NULL DEFAULT CURRENT_TIMESTAMP,
          last_login ${this.config.type === 'sqlite' ? 'DATETIME' : 'TIMESTAMP'}
        )
      `);

      await this.query(`
        CREATE TABLE IF NOT EXISTS matrices (
          matrix_id ${this.config.type === 'sqlite' ? 'INTEGER PRIMARY KEY AUTOINCREMENT' : 'SERIAL PRIMARY KEY'},
          user_id INTEGER NOT NULL,
          rows INTEGER NOT NULL,
          columns INTEGER NOT NULL,
          created_at ${this.config.type === 'sqlite' ? 'DATETIME' : 'TIMESTAMP'} NOT NULL DEFAULT CURRENT_TIMESTAMP,
          last_modified ${this.config.type === 'sqlite' ? 'DATETIME' : 'TIMESTAMP'} NOT NULL DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(user_id)
        )
      `);

      await this.query(`
        CREATE TABLE IF NOT EXISTS matrixElements (
          element_id ${this.config.type === 'sqlite' ? 'INTEGER PRIMARY KEY AUTOINCREMENT' : 'SERIAL PRIMARY KEY'},
          matrix_id INTEGER NOT NULL,
          row_index INTEGER NOT NULL,
          column_index INTEGER NOT NULL,
          value REAL NOT NULL,
          FOREIGN KEY (matrix_id) REFERENCES matrices(matrix_id),
          UNIQUE (matrix_id, row_index, column_index)
        )
      `);

      await this.query(`
        CREATE TABLE IF NOT EXISTS operations (
          operation_id ${this.config.type === 'sqlite' ? 'INTEGER PRIMARY KEY AUTOINCREMENT' : 'SERIAL PRIMARY KEY'},
          operation_name TEXT NOT NULL UNIQUE,
          description TEXT,
          is_binary INTEGER NOT NULL
        )
      `);

      await this.query(`
        CREATE TABLE IF NOT EXISTS calculationHistory (
          history_id ${this.config.type === 'sqlite' ? 'INTEGER PRIMARY KEY AUTOINCREMENT' : 'SERIAL PRIMARY KEY'},
          user_id INTEGER NOT NULL,
          operation_id INTEGER NOT NULL,
          result_matrix_id INTEGER,
          matrix_a_id INTEGER,
          matrix_b_id INTEGER,
          scalar_value REAL,
          timestamp ${this.config.type === 'sqlite' ? 'DATETIME' : 'TIMESTAMP'} NOT NULL DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(user_id),
          FOREIGN KEY (operation_id) REFERENCES operations(operation_id),
          FOREIGN KEY (result_matrix_id) REFERENCES matrices(matrix_id),
          FOREIGN KEY (matrix_a_id) REFERENCES matrices(matrix_id),
          FOREIGN KEY (matrix_b_id) REFERENCES matrices(matrix_id)
        )
      `);

      // Update operations
      await this.updateOperations();

      console.log('Database tables and operations initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  async checkDatabase() {
    try {
      const tables = await this.query(`
        SELECT name FROM ${this.config.type === 'sqlite' 
          ? 'sqlite_master' 
          : 'information_schema.tables'} 
        WHERE type = 'table' AND name NOT LIKE 'sqlite_%'
      `);
      
      const requiredTables = ['users', 'matrices', 'matrixElements', 'operations', 'calculationHistory'];
      const existingTables = tables.map(t => t.name);
      
      const missingTables = requiredTables.filter(table => !existingTables.includes(table));
      
      if (missingTables.length > 0) {
        console.log('Missing tables:', missingTables);
        return false;
      }
      
      console.log("Database is complete")
      return true;
    } catch (error) {
      console.error('Error checking database:', error);
      return false;
    }
  }
}

// Create and export the database instance
const db = new DatabaseConnection();
db.connect();
await db.initDatabase();

export default db;