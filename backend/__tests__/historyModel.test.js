const UserModel = require('../models/userModel.js');
const CalcHistoryModel = require('../models/calcHistoryModel.js');
const OperationModel = require('../models/operationModel.js');
const MatricesModel = require('../models/matricesModel.js');
// import db from "../config/database.js";

const operations = {
    transpose: { name: 'Transpose', description: 'Transpose the matrix' },
    calculateRank: { name: 'Calculate Rank', description: 'Find the rank of the matrix' },
    multiply: { name: 'Multiply', description: 'Multiply two matrices' }
}

describe('CalcHistoryModel Tests', () => {
    // Test data variables
    let userId;
    //   let clearOperationId;
    //   let transposeOperationId;
    //   let findRankOperationId;
    //   let multiplyOperationId;

    let matrixA;
    let matrixB;
    let scalar_value;
    let matrixAId;
    let matrixBId;
    let resultMatrixId;
    let historyId;
    let db;

    // unary
    let transposeOperation;
    let calculateRank;
    let transposeOperationId;
    let calculateRankOperationId;

    // binary
    let multiplyOperation;
    let multiplyOperationId;

  beforeAll(async () => {
    // Get the database connection - this awaits initialization
    db = await require('../config/database.js');

    await db.migrate.latest();
    
    // Now that db is initialized, get operations
    transposeOperation = await OperationModel.getOperationByName(operations.transpose.name);
    calculateRank = await OperationModel.getOperationByName(operations.calculateRank.name);
    transposeOperationId = transposeOperation.id;
    calculateRankOperationId = calculateRank.id;

    // binary
    multiplyOperation = await OperationModel.getOperationByName(operations.multiply.name);
    multiplyOperationId = multiplyOperation.id;

    // Set up test data
    // Add a test user if it doesn't exist yet
    try {
      const existingUser = await UserModel.getUserByEmail('testHistory@example.com');
      
      if (!existingUser) {
        userId = await UserModel.register(
          'testuser',
          'testHistory@example.com',
          'password123'
        );
      } else {
        userId = existingUser.id;
      }
      
      if (!userId) {
        throw new Error('Failed to get or create test user');
      }
    } catch (error) {
      throw error;
    }
    
    // Create test matrices
    matrixA = [
      [1, 2],
      [3, 4]
    ];
    
    matrixB = [
      [5, 6],
      [7, 8]
    ];

    scalar_value = 3;
    
    const resultMatrix = [
      [6, 8],
      [10, 12]
    ];
    
    matrixAId = await MatricesModel.createMatrix( userId, matrixA, 2, 2 );
    
    matrixBId = await MatricesModel.createMatrix( userId, matrixB, 2, 2 );
    
    resultMatrixId = await MatricesModel.createMatrix( userId, resultMatrix, 2, 2 );
  });
  
  afterAll(async () => {
    // Clean up test data
    if (historyId) {
      await CalcHistoryModel.deleteHistory(historyId);
    }
    
    // Clear all calculation history for our test user
    await CalcHistoryModel.clearUserHistory(userId);
    
    // Close database connection
    if (db) {
      await db.destroy();
    }
    // Add a small delay to ensure connections are closed
    await new Promise(resolve => setTimeout(resolve, 500));
  });
  
  // Example test for adding calculation to history
  describe('binary calculations', () => {
    test('should multiply matrices', async () => {
      // Add a binary calculation
      historyId = await CalcHistoryModel.addCalculation(
        userId,
        multiplyOperationId,
        resultMatrixId,
        matrixAId,
        matrixBId
      );
      
      // Check ID was returned
      expect(historyId).toBeDefined();
      expect(typeof historyId).toBe('number');
      
      // Verify record exists
      const record = await CalcHistoryModel.getHistoryById(historyId);
      expect(record).toBeDefined();
      expect(record.user_id).toBe(userId);
      expect(record.operation_id).toBe(multiplyOperationId);
    });
  });
  
  // Add more test cases here...
  describe('unary calculations', () => {
    test('should add unary transpose operation entry', async () => {
      historyId = await CalcHistoryModel.addCalculation(
        userId,
        transposeOperationId,
        resultMatrixId,
        matrixAId,
      );
      
      // Check ID was returned
      expect(historyId).toBeDefined();
      expect(typeof historyId).toBe('number');
      
      // Verify record exists
      const record = await CalcHistoryModel.getHistoryById(historyId);
      expect(record).toBeDefined();
      expect(record.user_id).toBe(userId);
      expect(record.operation_id).toBe(transposeOperationId);
    })
  })
});


