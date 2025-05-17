const MatricesModel = require('../models/matricesModel.js');
const UserModel = require('../models/userModel.js');

describe('createMatrix', () => {
  let testUserId;
  const rows = 2;
  const columns = 3;
  const testMatrix = [
    [1, 2, 3],
    [4, 5, 6]
  ];
  let db;

  beforeAll(async () => {
    // Get the database connection - this awaits initialization
    db = await require('../config/database.js');
    
    // Set up test user
    try {
      const existingUser = await UserModel.getUserByEmail('testMatrix@example.com');
      
      if (!existingUser) {
        testUserId = await UserModel.register(
          'testuser',
          'testMatrix@example.com',
          'password123'
        );
      } else {
        testUserId = existingUser.id;
      }
      
      if (!testUserId) {
        throw new Error('Failed to get or create test user');
      }
    } catch (error) {
      throw error;
    }
    
    // Очистка таблиц перед запуском тестов
    await db.raw('DELETE FROM matrixElements');
    await db.raw('DELETE FROM matrices');
  });
  
  afterAll(async () => {
    // Close database connection
    if (db) {
      await db.destroy();
    }
    // Add a small delay to ensure connections are closed
    await new Promise(resolve => setTimeout(resolve, 500));
  });

  test('создает матрицу и возвращает ее id', async () => {
    const matrixId = await MatricesModel.createMatrix( testUserId, testMatrix, rows, columns );
    expect(typeof matrixId).toBe('number');

    // Проверка, что запись есть в таблице matrices
    const row = await db('matrices').where('id', matrixId).first();
    expect(row).toBeDefined();
    expect(row.user_id).toBe(testUserId);
    expect(row.rows).toBe(rows);
    expect(row.columns).toBe(columns);
  });

  test('заполняет таблицу matrixElements правильными значениями', async () => {
    // Создаем матрицу
    const matrixId = await MatricesModel.createMatrix( testUserId, testMatrix, rows, columns );
    // Проверяем, что элементы добавлены
    const elements = await db('matrixElements').where('matrix_id', matrixId).select('*');
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