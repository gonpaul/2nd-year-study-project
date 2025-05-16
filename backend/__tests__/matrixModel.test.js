const MatricesModel = require('../models/matricesModel.js'); // ваш модуль
const db = require('../config/database.js'); // подключение к базе данных

describe('createMatrix', () => {
  const testUserId = 1;
  const rows = 2;
  const columns = 3;
  const testMatrix = [
    [1, 2, 3],
    [4, 5, 6]
  ];

  beforeAll(async () => {
    // Очистка таблиц перед запуском тестов
    await db.prepare('DELETE FROM matrixElements').run();
    await db.prepare('DELETE FROM matrices').run();
    // Можно вставить тестового пользователя, если его еще нет
    // или убедиться, что пользователь с testUserId есть
  });

  test('создает матрицу и возвращает ее id', () => {
    const matrixId = MatricesModel.createMatrix({ user_id: testUserId, matrix: testMatrix, rows, columns });
    expect(typeof matrixId).toBe('number');

    // Проверка, что запись есть в таблице matrices
    const row = db.prepare('SELECT * FROM matrices WHERE matrix_id = ?').get(matrixId);
    expect(row).toBeDefined();
    expect(row.user_id).toBe(testUserId);
    expect(row.rows).toBe(rows);
    expect(row.columns).toBe(columns);
  });

  test('заполняет таблицу matrixElements правильными значениями', () => {
    // Создаем матрицу
    MatricesModel.createMatrix({ user_id: testUserId, matrix: testMatrix, rows, columns });
    // Проверяем, что элементы добавлены
    const elements = db.prepare('SELECT * FROM matrixElements WHERE matrix_id = (SELECT MAX(matrix_id) FROM matrices)').all();
    expect(elements.length).toBe(rows * columns);

    // Проверяем, что все элементы соответствуют матрице
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        const el = elements.find(e => e.row_index === r && e.column_index === c);
        expect(el).toBeDefined();
        expect(el.value).toBe(testMatrix[r][c]);
      }
    }
  });
});