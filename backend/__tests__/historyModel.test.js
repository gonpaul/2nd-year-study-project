import UserModel from '../models/userModel.js';
import CalcHistoryModel from '../models/calcHistoryModel.js';
import OperationModel from '../models/operationModel.js';
import MatricesModel from '../models/matricesModel.js';
// import db from "../config/database.js";

const operations = {
    clear: { name: 'Clear', description: 'Clear the matrix' },
    transpose: { name: 'Transpose', description: 'Transpose the matrix' },
    findRank: { name: 'Find Rank', description: 'Find the rank of the matrix' },

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

    // unary
    const clearOperation = OperationModel.getOperationByName(operations.clear.name);
    const transposeOperation = OperationModel.getOperationByName(operations.transpose.name);
    const findRankOperation = OperationModel.getOperationByName(operations.findRank.name);
    const clearOperationId = clearOperation.operation_id;
    const transposeOperationId = transposeOperation.operation_id;
    const findRankOperationId = findRankOperation.operation_id;

    // binary
    const multiplyOperation = OperationModel.getOperationByName(operations.multiply.name);
    const multiplyOperationId = multiplyOperation.operation_id;

  beforeAll(async () => {
    // Set up test data
    // Add a test user if it doesn't exist yet
    const existingUser = UserModel.getUserByEmail('test@example.com');
    
    if (!existingUser) {
      userId = UserModel.register({
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'password123' // UserModel should handle hashing
      });
    } else {
      userId = existingUser.user_id;
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
    
    matrixAId = MatricesModel.createMatrix({
      user_id: userId,
      matrix: matrixA,
      rows: 2,
      columns: 2
    });
    
    matrixBId = MatricesModel.createMatrix({
      user_id: userId,
      matrix: matrixB,
      rows: 2,
      columns: 2
    });
    
    resultMatrixId = MatricesModel.createMatrix({
      user_id: userId,
      matrix: resultMatrix,
      rows: 2,
      columns: 2
    });
  });
  
  afterAll(() => {
    // Clean up test data
    if (historyId) {
      CalcHistoryModel.deleteHistory(historyId);
    }
    
    // Clear all calculation history for our test user
    CalcHistoryModel.clearUserHistory(userId);
  });
  
  // Example test for adding calculation to history
  describe('binary calculations', () => {
    test('should multiply matrices', () => {
      // Add a binary calculation
      console.log("Calling addCalculation method with the following parameters:\n");
      console.log("user_id:", userId);
      console.log("operation_id", multiplyOperationId);
      console.log("result_matrix_id", resultMatrixId);
      console.log("matrix_a", matrixA);
      console.log("matrix_b", matrixB);

      historyId = CalcHistoryModel.addCalculation({
        user_id: userId,
        operation_id: multiplyOperationId,
        result_matrix_id: resultMatrixId,
        matrix_a_id: matrixAId,
        matrix_b_id: matrixBId
      });
      
      // Check ID was returned
      expect(historyId).toBeDefined();
      expect(typeof historyId).toBe('number');
      
      // Verify record exists
      const record = CalcHistoryModel.getHistoryById(historyId);
      expect(record).toBeDefined();
      expect(record.user_id).toBe(userId);
      expect(record.operation_id).toBe(multiplyOperationId);
    });
  });
  
  // Add more test cases here...
  describe('unary calculations', () => {
    test('should add unary transpose operation entry', () => {
      console.log("Calling unary addCalculation method with the following parameters:\n");
      console.log("user_id:", userId);
      console.log("operation_id", transposeOperationId);
      console.log("result_matrix_id", resultMatrixId);
      console.log("matrix_a", matrixA);
      console.log("scalar_value", null);

      historyId = CalcHistoryModel.addCalculation({
        user_id: userId,
        operation_id: transposeOperationId,
        matrix_a_id: matrixAId,
        // scalar_value can is null
        scalar_value: null,
        result_matrix_id: resultMatrixId
      });
      
      // Check ID was returned
      expect(historyId).toBeDefined();
      expect(typeof historyId).toBe('number');
      
      // Verify record exists
      const record = CalcHistoryModel.getHistoryById(historyId);
      expect(record).toBeDefined();
      expect(record.user_id).toBe(userId);
      expect(record.operation_id).toBe(transposeOperationId);
    })
  })
});


