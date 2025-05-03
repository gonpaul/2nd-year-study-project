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

function addOperations() {
    db.prepare('DELETE FROM operations').run();
    // db.prepare("DELETE FROM sqlite_sequence WHERE name='operations'").run();
    for (const type in operations) {
        for (const op of operations[type]) {
            const isBinaryInt = (type === 'unary') ? 1 : 0;
            db.prepare(`INSERT INTO operations (operation_name, description, is_binary) VALUES (?, ?, ?)`)
            .run(op.name, op.description, isBinaryInt);
        }
    }

    console.log('Операции успешно добавлены')
}

addOperations();


// // Создаем таблицу и заполняем
// function fillOperations() {
//   // Создаем таблицу, если еще не существует
//   db.prepare(`
//     CREATE TABLE IF NOT EXISTS operations (
//       operation_id INTEGER PRIMARY KEY AUTOINCREMENT,
//       name TEXT NOT NULL,
//       description TEXT
//     )
//   `).run();

//   // Вставляем унарные операции
//   for (const op of operations.unary) {
//     db.prepare(`INSERT INTO operations (name, description) VALUES (?, ?)`)
//       .run(op.name, op.description);
//   }

//   // Вставляем бинарные операции
//   for (const op of operations.binary) {
//     db.prepare(`INSERT INTO operations (name, description) VALUES (?, ?)`)
//       .run(op.name, op.description);
//   }

//   console.log('Операции успешно добавлены');
// }

// // Запуск функции
// fillOperations();

export default addOperations;