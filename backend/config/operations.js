import db from '../config/database.js';

// Объект с операциями
const operations = {
    unary: [
      { name: 'Clear', description: 'Clear the matrix' },
      { name: 'Transpose', description: 'Transpose the matrix' },
      { name: 'Find Rank', description: 'Find the rank of the matrix' },
      { name: 'Find Determinant', description: 'Calculate the determinant' },
      { name: 'Invert', description: 'Invert the matrix' },
      { name: 'Triangular Form', description: 'Transform to triangular form' },
      { name: 'Diagonal Form', description: 'Transform to diagonal form' },
      { name: 'Raise to Power', description: 'Raise the matrix to a power' }
    ],
    binary: [
      { name: 'Swap Matrices', description: 'Swap two matrices' },
      { name: 'Multiply', description: 'Multiply two matrices' },
      { name: 'Add', description: 'Add two matrices' },
      { name: 'Subtract', description: 'Subtract two matrices' },
      { name: 'Add Another Matrix', description: 'Add a third matrix (optional)' }
    ]
  };
  
// Функция для добавления новых операций, которых еще нет в таблице
function updateOperations() {
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
  }
}

// Вызов функции при запуске
// updateOperations();

// Экспорт, если нужно
export default updateOperations;