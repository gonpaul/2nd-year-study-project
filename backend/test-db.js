const Database = require('better-sqlite3');
const path = require('path');

// Путь к файлу БД (в текущей папке)
const dbPath = path.join(__dirname, 'matrix_calculator.db');
const db = new Database(dbPath);

// Создание таблиц (ваши SQL-запросы)
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS matrices (
    matrix_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    matrix_name TEXT NOT NULL,
    rows INTEGER NOT NULL,
    columns INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
`);

// Тестовые данные (ваши примеры)
function insertTestData() {
  try {
    // Проверяем, есть ли уже данные
    const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get().count;
    if (userCount > 0) return;

    // Вставка данных
    db.exec(`
      INSERT INTO users (username, email, password_hash)
      VALUES ('test_user', 'test@example.com', 'hashed_password_123');

      INSERT INTO matrices (user_id, matrix_name, rows, columns)
      VALUES (1, 'Test Matrix', 3, 3);

      INSERT INTO matrixElements (matrix_id, row_index, column_index, value)
      VALUES 
        (1, 0, 0, 1.5),
        (1, 0, 1, 2.0),
        (1, 1, 0, 3.0);
    `);

    console.log('Тестовые данные добавлены!');
  } catch (error) {
    console.error('Ошибка при добавлении тестовых данных:', error);
  }
}

// Проверка работы
function testDatabase() {
  console.log('Проверка базы данных:');
  
  // Чтение данных
  const users = db.prepare("SELECT * FROM users").all();
  const matrices = db.prepare("SELECT * FROM matrices").all();
  const elements = db.prepare("SELECT * FROM matrixElements").all();

  console.log('Пользователи:', users);
  console.log('Матрицы:', matrices);
  console.log('Элементы матриц:', elements);
}

// Инициализация
insertTestData();
testDatabase();

// Закрытие соединения (опционально)
db.close();
