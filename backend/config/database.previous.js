import Database from 'better-sqlite3';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import operations from './operations.js';

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
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (operation_id) REFERENCES operations(operation_id),
    FOREIGN KEY (result_matrix_id) REFERENCES matrices(matrix_id),
    FOREIGN KEY (matrix_a_id) REFERENCES matrices(matrix_id),
    FOREIGN KEY (matrix_b_id) REFERENCES matrices(matrix_id)
  );
`);

// Функция для добавления новых операций, которых еще нет в таблице
function updateOperations() {
  // NOTE: Uncomment to rewrite data
  // db.prepare('DELETE FROM operations').run();
  // db.prepare("DELETE FROM sqlite_sequence WHERE name='operations'").run();
  // Проверяем, сколько записей уже есть
  const existingCount = db.prepare('SELECT COUNT(*) as cnt FROM operations').get().cnt;

  // Создаем таблицу, если еще не существует
  db.prepare(`
    CREATE TABLE IF NOT EXISTS operations (
      operation_id INTEGER PRIMARY KEY AUTOINCREMENT,
      operation_name TEXT NOT NULL UNIQUE,
      description TEXT,
      is_binary INTEGER NOT NULL
    )
  `).run();

  // Если таблица пуста, добавляем все операции
  if (existingCount === 0) {
    for (const type in operations) {
      for (const op of operations[type]) {
        const isBinary = (type === 'binary') ? 1 : 0;
        db.prepare(`INSERT OR IGNORE INTO operations (operation_name, description, is_binary) VALUES (?, ?, ?)`)
          .run(op.name, op.description, isBinary);
      }
    }
    console.log('Operations table has been filled with initial data.');
  } else {
    // Таблица уже содержит записи, добавляем только отсутствующие
    for (const type in operations) {
      for (const op of operations[type]) {
        const isBinary = (type === 'binary') ? 1 : 0;
        // Вставляем только если операции еще нет (по operation_name)
        db.prepare(`INSERT OR IGNORE INTO operations (operation_name, description, is_binary) VALUES (?, ?, ?)`)
          .run(op.name, op.description, isBinary);
      }
    }
    console.log('Operations table has been updated with missing entries.');
  // Log all operations in the table after update
  }
  const allOperations = db.prepare('SELECT * FROM operations').all();
  console.log('Current operations in database:');
  console.table(allOperations);
}

updateOperations();

export default db;