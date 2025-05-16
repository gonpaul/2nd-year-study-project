const MatricesModel = require('../models/matricesModel.js');

/**
 * Convert matrix data from request to database entries
 * @param {number} userId - User ID
 * @param {Array} matrixA - Matrix A data
 * @param {Array} matrixB - Matrix B data (optional)
 * @param {Array} resultMatrix - Result matrix data
 * @returns {Promise<Object>} - Object containing matrix IDs
 */
const convertMatricesToIds = async (userId, matrixA, matrixB, resultMatrix) => {
    try {
        // Convert matrices to database entries and get their IDs
        const matrixAId = matrixA ? 
            await MatricesModel.createMatrix(
                userId, 
                matrixA, 
                matrixA.length, 
                matrixA[0].length 
            ) : null;
        
        const matrixBId = matrixB ? 
            await MatricesModel.createMatrix(
                userId, 
                matrixB, 
                matrixB.length, 
                matrixB[0].length 
            ) : null;
            
        const resultMatrixId = resultMatrix ? 
            await MatricesModel.createMatrix(
                userId, 
                resultMatrix, 
                resultMatrix.length, 
                resultMatrix[0].length 
            ) : null;

        return {
            matrixAId,
            matrixBId,
            resultMatrixId
        };
    } catch (error) {
        console.error('Error converting matrices to IDs:', error);
        throw error;
    }
};

module.exports = {
    convertMatricesToIds
}; 