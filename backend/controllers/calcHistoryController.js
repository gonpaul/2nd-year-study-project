import CalcHistoryModel from "../models/calcHistoryModel.js";
import OperationModel from "../models/operationModel.js";

export const addUnaryCalculation = (userId, operationId, matrixAId, resultMatrixId, scalarValue = null) => {
    try {
        // Add the calculation to history
        const historyId = CalcHistoryModel.addCalculation({
            user_id: userId,
            operation_id: operationId,
            result_matrix_id: resultMatrixId,
            matrix_a_id: matrixAId,
            matrix_b_id: null,
            scalar_value: scalarValue
        });
        
        return { success: true, historyId };
    } catch (error) {
        console.error('Error adding unary calculation:', error);
        return { success: false, error: error.message };
    }
};

export const addBinaryCalculation = (userId, operationId, matrixAId, matrixBId, resultMatrixId) => {
    try {
        // Add the calculation to history
        const historyId = CalcHistoryModel.addCalculation({
            user_id: userId,
            operation_id: operationId,
            result_matrix_id: resultMatrixId,
            matrix_a_id: matrixAId,
            matrix_b_id: matrixBId,
            scalar_value: null
        });
        
        return { success: true, historyId };
    } catch (error) {
        console.error('Error adding binary calculation:', error);
        return { success: false, error: error.message };
    }
};

export const addCalculation = (userId, operationId, matrixAId, matrixBId, resultMatrixId, scalarValue) => {
    try {
        // Check if the operation is binary
        const operation = OperationModel.getOperationById(operationId);
        
        if (!operation) {
            throw new Error(`Operation with ID ${operationId} not found`);
        }
        
        if (operation.is_binary) {
            // For binary operations (operations between two matrices)
            if (!matrixBId) {
                throw new Error('Matrix B ID is required for binary operations');
            }
            
            return addBinaryCalculation(userId, operationId, matrixAId, matrixBId, resultMatrixId);
        } else {
            // For unary operations (operations on a single matrix, possibly with a scalar)
            return addUnaryCalculation(userId, operationId, matrixAId, resultMatrixId, scalarValue);
        }
    } catch (error) {
        console.error('Error adding calculation:', error);
        return { success: false, error: error.message };
    }
};

export const getHistoryByUserId = (userId, limit = 50) => {
    try {
        const history = CalcHistoryModel.getHistoryByUserId(userId, limit);
        return { success: true, history };
    } catch (error) {
        console.error('Error getting history:', error);
        return { success: false, error: error.message };
    }
};

export const getHistoryById = (historyId) => {
    try {
        const history = CalcHistoryModel.getHistoryById(historyId);
        
        if (!history) {
            return { success: false, error: 'History record not found' };
        }
        
        return { success: true, history };
    } catch (error) {
        console.error('Error getting history by ID:', error);
        return { success: false, error: error.message };
    }
};

export const deleteHistory = (historyId) => {
    try {
        const success = CalcHistoryModel.deleteHistory(historyId);
        
        if (!success) {
            return { success: false, error: 'Failed to delete history or record not found' };
        }
        
        return { success: true };
    } catch (error) {
        console.error('Error deleting history:', error);
        return { success: false, error: error.message };
    }
};

export const clearUserHistory = (userId) => {
    try {
        const success = CalcHistoryModel.clearUserHistory(userId);
        
        if (!success) {
            return { success: false, error: 'Failed to clear history or no records found' };
        }
        
        return { success: true };
    } catch (error) {
        console.error('Error clearing user history:', error);
        return { success: false, error: error.message };
    }
};

export default {
    addUnaryCalculation,
    addBinaryCalculation,
    addCalculation,
    getHistoryByUserId,
    getHistoryById,
    deleteHistory,
    clearUserHistory
};