import Database from 'better-sqlite3';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the SQLite database file
const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new Database(dbPath);

const isTest = process.env.NODE_ENV === 'test';

// Create tables if they do not exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
  );

  CREATE TABLE IF NOT EXISTS matrices (
    matrix_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    matrix_name TEXT NOT NULL,
    rows INTEGER NOT NULL,
    columns INTEGER NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
  );

  CREATE TABLE IF NOT EXISTS matrixElements (
    element_id INTEGER PRIMARY KEY AUTOINCREMENT,
    matrix_id INTEGER NOT NULL,
    row_index INTEGER NOT NULL,
    column_index INTEGER NOT NULL,
    value REAL NOT NULL,
    FOREIGN KEY (matrix_id) REFERENCES matrices(matrix_id),
    UNIQUE (matrix_id, row_index, column_index)
  );

  CREATE TABLE IF NOT EXISTS operations (
    operation_id INTEGER PRIMARY KEY AUTOINCREMENT,
    operation_name TEXT NOT NULL UNIQUE,
    description TEXT,
    is_binary INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS calculationHistory (
    history_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    operation_id INTEGER NOT NULL,
    result_matrix_id INTEGER,
    matrix_a_id INTEGER,
    matrix_b_id INTEGER,
    scalar_value REAL,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    parameters TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (operation_id) REFERENCES operations(operation_id),
    FOREIGN KEY (result_matrix_id) REFERENCES matrices(matrix_id),
    FOREIGN KEY (matrix_a_id) REFERENCES matrices(matrix_id),
    FOREIGN KEY (matrix_b_id) REFERENCES matrices(matrix_id)
  );
`);

export default db;