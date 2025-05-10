import db from '../config/database.js';

// Перед тестом запустите добавление операций

// Тест, который выводит все операции из базы данных

  // const rows = db.prepare('SELECT * FROM operations').all();
  // console.log('All transactions are in the database:', rows);


import updateOperations from '../config/operations.js'; // укажите правильный путь

beforeEach(() => {
  // Очистка таблицы перед тестом
  db.prepare('DELETE FROM operations').run();
  db.prepare("DELETE FROM sqlite_sequence WHERE name='operations'").run();

  // Вставляем одну операцию, чтобы проверить дополнение
  db.prepare(`INSERT INTO operations (operation_name, description, is_binary) VALUES (?, ?, ?)`)
    .run('Clear', 'Clear the matrix', 0);

  const beforeRows = db.prepare('SELECT operation_name FROM operations').all();
  console.log('Before update:', beforeRows);
  
  // Запускаем функцию, которая должна дополнить таблицу
  updateOperations();

  const afterRows = db.prepare('SELECT operation_name FROM operations').all();
  console.log('After update:', afterRows);
});

test('таблица дополняется новыми операциями, если есть недостающие', () => {
  const rows = db.prepare('SELECT operation_name, description, is_binary FROM operations').all();

  // Проверяем, что в таблице есть все операции из объекта
  const expectedNames = [
    'Clear', 'Transpose', 'Find Rank', 'Find Determinant', 'Invert', 'Triangular Form', 'Diagonal Form', 'Raise to Power',
    'Swap Matrices', 'Multiply', 'Add', 'Subtract', 'Add Another Matrix'
  ];

  const actualNames = rows.map(r => r.operation_name);

  // Проверяем, что все ожидаемые операции есть
  expectedNames.forEach(name => {
    expect(actualNames).toContain(name);
  });

  // Проверяем, что операция 'Clear' не дублируется
  const countClear = actualNames.filter(n => n === 'Clear').length;
  expect(countClear).toBe(1);
});
