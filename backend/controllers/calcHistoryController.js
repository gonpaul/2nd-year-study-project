const CalcHistoryModel = require("../models/calcHistoryModel.js");
const OperationModel = require("../models/operationModel.js");

const addUnaryCalculation = async (userId, operationId, matrixAId, resultMatrixId, scalarValue = null) => {
    try {
        // Add the calculation to history
        const historyId = await CalcHistoryModel.addCalculation(
            userId,
            operationId,
            resultMatrixId,
            matrixAId,
            null,
            scalarValue
        );
        
        return { success: true, historyId };
    } catch (error) {
        console.error('Error adding unary calculation:', error);
        return { success: false, error: error.message };
    }
};

const addBinaryCalculation = async (userId, operationId, matrixAId, matrixBId, resultMatrixId) => {
    try {
        // Add the calculation to history
        const historyId = await CalcHistoryModel.addCalculation(
            userId,
            operationId,
            resultMatrixId,
            matrixAId,
            matrixBId,
            null
        );
        
        return { success: true, historyId };
    } catch (error) {
        console.error('Error adding binary calculation:', error);
        return { success: false, error: error.message };
    }
};

const addCalculation = async (userId, operationId, matrixAId, matrixBId, resultMatrixId, scalarValue) => {
    try {
        // Check if the operation is binary
        const operation = await OperationModel.getOperationById(operationId);
        
        if (!operation) {
            throw new Error(`Operation with ID ${operationId} not found`);
        }
        
        if (operation.is_binary) {
            // For binary operations (operations between two matrices)
            if (!matrixBId) {
                throw new Error('Matrix B ID is required for binary operations');
            }
            
            return await addBinaryCalculation(userId, operationId, matrixAId, matrixBId, resultMatrixId);
        } else {
            // For unary operations (operations on a single matrix, possibly with a scalar)
            return await addUnaryCalculation(userId, operationId, matrixAId, resultMatrixId, scalarValue);
        }
    } catch (error) {
        console.error('Error adding calculation:', error);
        return { success: false, error: error.message };
    }
};

const getHistoryByUserId = async (userId, limit = 50) => {
    try {
        const history = await CalcHistoryModel.getHistoryByUserId(userId, limit);
        return { success: true, history };
    } catch (error) {
        console.error('Error getting history:', error);
        return { success: false, error: error.message };
    }
};

const getHistoryById = async (historyId) => {
    try {
        const history = await CalcHistoryModel.getHistoryById(historyId);
        
        if (!history) {
            return { success: false, error: 'History record not found' };
        }
        
        return { success: true, history };
    } catch (error) {
        console.error('Error getting history by ID:', error);
        return { success: false, error: error.message };
    }
};

const deleteHistory = async (historyId) => {
    try {
        const success = await CalcHistoryModel.deleteHistory(historyId);
        
        if (!success) {
            return { success: false, error: 'Failed to delete history or record not found' };
        }
        
        return { success: true };
    } catch (error) {
        console.error('Error deleting history:', error);
        return { success: false, error: error.message };
    }
};

const clearUserHistory = async (userId) => {
    try {
        const success = await CalcHistoryModel.clearUserHistory(userId);
        
        if (!success) {
            return { success: false, error: 'Failed to clear history or no records found' };
        }
        
        return { success: true };
    } catch (error) {
        console.error('Error clearing user history:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    addUnaryCalculation,
    addBinaryCalculation,
    addCalculation,
    getHistoryByUserId,
    getHistoryById,
    deleteHistory,
    clearUserHistory
};