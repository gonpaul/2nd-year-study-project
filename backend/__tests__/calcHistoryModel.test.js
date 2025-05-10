import UserModel from '../models/userModel.js';
import CalcHistoryModel from '../models/calcHistoryModel.js';
import OperationModel from '../models/operationModel.js';
import MatricesModel from '../models/matricesModel.js';

describe('CalcHistoryModel', () => {
  // Test data variables
  let userId;
  let operationId;
  let matrixAId;
  let matrixBId;
  let resultMatrixId;
  let historyId;

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
    
    // Create an operation for testing if it doesn't exist
    if (!OperationModel.operationExists('Test Operation')) {
      operationId = OperationModel.addOperation({
        operation_name: 'Test Operation',
        description: 'Operation for testing',
        is_binary: true
      });
    } else {
      const operation = OperationModel.getOperationByName('Test Operation');
      operationId = operation.operation_id;
    }
    
    // Create test matrices
    const matrixA = [
      [1, 2],
      [3, 4]
    ];
    
    const matrixB = [
      [5, 6],
      [7, 8]
    ];
    
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
    // But keep users, operations, and matrices since they might be used by other tests
    if (historyId) {
      CalcHistoryModel.deleteHistory(historyId);
    }
    
    // Clear all calculation history for our test user with test operation
    CalcHistoryModel.clearUserHistory(userId);
  });
  
  describe('addCalculation', () => {
    test('should add a binary calculation and return ID', () => {
      // Add a binary calculation
      historyId = CalcHistoryModel.addCalculation({
        user_id: userId,
        operation_id: operationId,
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
      expect(record.operation_id).toBe(operationId);
      expect(record.result_matrix_id).toBe(resultMatrixId);
      expect(record.matrix_a_id).toBe(matrixAId);
      expect(record.matrix_b_id).toBe(matrixBId);
      expect(record.scalar_value).toBeNull();
    });
    
    test('should add a unary calculation with scalar value', () => {
      // Add a unary calculation
      const scalarValue = 2.5;
      const unaryHistoryId = CalcHistoryModel.addCalculation({
        user_id: userId,
        operation_id: operationId,
        result_matrix_id: resultMatrixId,
        matrix_a_id: matrixAId,
        scalar_value: scalarValue
      });
      
      // Verify record exists
      const record = CalcHistoryModel.getHistoryById(unaryHistoryId);
      expect(record).toBeDefined();
      expect(record.scalar_value).toBe(scalarValue);
      expect(record.matrix_b_id).toBeNull();
      
      // Clean up this record
      CalcHistoryModel.deleteHistory(unaryHistoryId);
    });
  });
  
  describe('getHistoryByUserId', () => {
    test('should retrieve calculation history for a user', () => {
      // Get history for the test user
      const history = CalcHistoryModel.getHistoryByUserId(userId);
      
      // Verify we got records back
      expect(Array.isArray(history)).toBe(true);
      expect(history.length).toBeGreaterThan(0);
      
      // Find our test record
      const testRecord = history.find(record => record.history_id === historyId);
      expect(testRecord).toBeDefined();
      expect(testRecord.operation_name).toBe('Test Operation');
    });
    
    test('should limit the number of records returned', () => {
      // Add a second test record
      const secondHistoryId = CalcHistoryModel.addCalculation({
        user_id: userId,
        operation_id: operationId,
        result_matrix_id: resultMatrixId,
        matrix_a_id: matrixAId,
        matrix_b_id: matrixBId
      });
      
      // Get just 1 record (should be the most recent)
      const limitedHistory = CalcHistoryModel.getHistoryByUserId(userId, 1);
      
      // Verify we only got 1 back
      expect(limitedHistory.length).toBe(1);
      
      // Clean up second record
      CalcHistoryModel.deleteHistory(secondHistoryId);
    });
    
    test('should return empty array for non-existent user', () => {
      // Get history for a user that doesn't exist
      const history = CalcHistoryModel.getHistoryByUserId(9999);
      
      // Verify we got an empty array
      expect(Array.isArray(history)).toBe(true);
      expect(history.length).toBe(0);
    });
  });
  
  describe('getHistoryById', () => {
    test('should retrieve a specific calculation record', () => {
      // Get the specific record
      const record = CalcHistoryModel.getHistoryById(historyId);
      
      // Verify the record data
      expect(record).toBeDefined();
      expect(record.history_id).toBe(historyId);
      expect(record.user_id).toBe(userId);
      expect(record.operation_id).toBe(operationId);
      expect(record.matrix_a_id).toBe(matrixAId);
      expect(record.matrix_b_id).toBe(matrixBId);
      expect(record.result_matrix_id).toBe(resultMatrixId);
    });
    
    test('should return undefined for non-existent record', () => {
      // Get a record that doesn't exist
      const record = CalcHistoryModel.getHistoryById(99999);
      
      // Verify it's undefined
      expect(record).toBeUndefined();
    });
  });
  
  describe('deleteHistory', () => {
    test('should delete a calculation history record', () => {
      // Add a record to delete
      const deleteTestId = CalcHistoryModel.addCalculation({
        user_id: userId,
        operation_id: operationId,
        result_matrix_id: resultMatrixId,
        matrix_a_id: matrixAId,
        matrix_b_id: matrixBId
      });
      
      // Verify it exists
      expect(CalcHistoryModel.getHistoryById(deleteTestId)).toBeDefined();
      
      // Delete it
      const result = CalcHistoryModel.deleteHistory(deleteTestId);
      
      // Verify delete was successful
      expect(result).toBe(true);
      
      // Verify it no longer exists
      expect(CalcHistoryModel.getHistoryById(deleteTestId)).toBeUndefined();
    });
    
    test('should return false when trying to delete non-existent record', () => {
      // Try to delete a record that doesn't exist
      const result = CalcHistoryModel.deleteHistory(99999);
      
      // Verify it returned false
      expect(result).toBe(false);
    });
  });
  
    describe('clearUserHistory', () => {
        test('should clear all calculation history for a user', () => {

            const testUser = UserModel.getUserByEmail("clear@example.com");
            let testUserId;

            if (!testUserId) {
                // Create a test user
                testUserId = UserModel.register({
                    username: 'clearuser',
                    email: 'clear@example.com',
                    password_hash: 'password123'
                });
            } else {
                testUserId = testUser.user_id;
            }

            // Add several records for this user
            for (let i = 0; i < 3; i++) {
                CalcHistoryModel.addCalculation({
                    user_id: testUserId,
                    operation_id: operationId,
                    result_matrix_id: resultMatrixId,
                    matrix_a_id: matrixAId,
                    scalar_value: i
                });
            }

            // Verify records exist
            const beforeCount = CalcHistoryModel.getHistoryByUserId(testUserId).length;
            expect(beforeCount).toBeGreaterThan(0);

            // Clear the history
            const result = CalcHistoryModel.clearUserHistory(testUserId);

            // Verify operation was successful
            expect(result).toBe(true);

            // Verify no records remain
            const afterCount = CalcHistoryModel.getHistoryByUserId(testUserId).length;
            expect(afterCount).toBe(0);

            // Clean up test user (assuming UserModel has a deleteUser method)
            UserModel.deleteUser(testUserId);
        });

        test('should return false when user has no history to clear', () => {
            // Create another test user
            const emptyUser = UserModel.getUserByEmail('empty@example.com');
            let emptyUserId;
            
            if (!emptyUser) {
                // Create a test user
                emptyUserId = UserModel.register({
                    username: 'emptyuser',
                    email: 'empty@example.com',
                    password_hash: 'password123'
                });
            } else {
                emptyUserId = emptyUser.user_id;
            }

            // This user has no history, so clearing should return false
            const result = CalcHistoryModel.clearUserHistory(emptyUserId);

            // Verify it returned false
            expect(result).toBe(false);

            // Clean up test user
            UserModel.deleteUser(emptyUserId);
        });
    });
});
