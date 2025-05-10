import MatricesModel from '../models/matricesModel.js';

/**
 * Convert matrix data from request to database entries
 * @param {Object} options - Options object
 * @param {number} options.userId - User ID
 * @param {Array} options.matrixA - Matrix A data
 * @param {Array} options.matrixB - Matrix B data (optional)
 * @param {Array} options.resultMatrix - Result matrix data
 * @returns {Object} - Object containing matrix IDs
 */
export const convertMatricesToIds = ({ userId, matrixA, matrixB, resultMatrix }) => {
    try {
        // Convert matrices to database entries and get their IDs
        const matrixAId = matrixA ? 
            MatricesModel.createMatrix({ 
                user_id: userId, 
                matrix: matrixA, 
                rows: matrixA.length, 
                columns: matrixA[0].length 
            }) : null;
        
        const matrixBId = matrixB ? 
            MatricesModel.createMatrix({ 
                user_id: userId, 
                matrix: matrixB, 
                rows: matrixB.length, 
                columns: matrixB[0].length 
            }) : null;
            
        const resultMatrixId = resultMatrix ? 
            MatricesModel.createMatrix({ 
                user_id: userId, 
                matrix: resultMatrix, 
                rows: resultMatrix.length, 
                columns: resultMatrix[0].length 
            }) : null;

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

export default {
    convertMatricesToIds
}; 