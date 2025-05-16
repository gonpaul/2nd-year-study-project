const db = require("../config/database.js");
const MatrixElementsModel = require("./matrixElementModel.js");

const MatricesModel = {
    /**
     * Create a new matrix with its elements
     * @param {number} user_id - The ID of the user who owns the matrix
     * @param {Array<Array<number>>} matrix - 2D array with matrix values
     * @param {number} rows - Number of rows
     * @param {number} columns - Number of columns
     * @returns {Promise<number>} - A promise that resolves to the ID of the newly created matrix
     */
    createMatrix: async (user_id, matrix, rows, columns) => {
        try {
            console.log('Method: createMatrix in matricesModel');
            
            // Use a transaction to ensure all operations succeed or fail together
            const matrixId = await db.transaction(async trx => {
                // Insert the matrix metadata
                await trx('matrices').insert({
                    user_id, 
                    rows, 
                    columns
                });
                const newId = (await trx('matrices')).at('-1').id;
                // Insert each element
                for (let r = 0; r < rows; r++) {
                    for (let c = 0; c < columns; c++) {
                        await trx('matrixElements').insert({
                            matrix_id: newId,
                            row_index: r,
                            column_index: c,
                            value: matrix[r][c]
                        });
                    }
                }
                
                return newId;
            });
            
            console.log('Result: ', matrixId); // returns the ID of the newly created matrix
            return matrixId;
        } catch (error) {
            console.error('Error creating matrix in matricesModel:', error);
            throw error; // Rethrow the error for handling elsewhere
        }
    },

    /**
     * Get matrix metadata by ID
     * @param {number} matrix_id - The ID of the matrix to retrieve
     * @returns {Promise<Object|undefined>} - A promise that resolves to the matrix metadata or undefined if not found
     */
    getMatrixById: async (matrix_id) => {
        try {
            console.log('Method: getMatrixById in matricesModel');
            const matrix = await db('matrices').where('id', matrix_id).first();
            console.log('Result: ', matrix);
            return matrix;
        } catch (error) {
            console.error('Error getting matrix by ID in matricesModel:', error);
            throw error; // Rethrow the error for handling elsewhere
        }
    },

    /**
     * Get full matrix data (metadata and elements) by ID
     * @param {number} matrix_id - The ID of the matrix to retrieve
     * @returns {Promise<Array<Array<number>>>} - A promise that resolves to the 2D array representing the matrix
     */
    getFullMatrixById: async (matrix_id) => {
        try {
            console.log('Method: getFullMatrixById in matricesModel');
            
            // Get matrix metadata
            const matrixMetadata = await MatricesModel.getMatrixById(matrix_id);
            if (!matrixMetadata) {
                throw new Error(`Matrix with ID ${matrix_id} not found`);
            }
            
            const rows = matrixMetadata.rows;
            const columns = matrixMetadata.columns;
            
            // Initialize result matrix with zeros
            const resultMatrix = Array(rows).fill().map(() => Array(columns).fill(0));
            
            // Get all elements for this matrix
            const elements = await db('matrixElements')
                .where('matrix_id', matrix_id)
                .orderBy(['row_index', 'column_index']);
            
            // Fill the result matrix with values
            for (const element of elements) {
                resultMatrix[element.row_index][element.column_index] = element.value;
            }
            
            console.log('Result: matrix retrieved successfully');
            return resultMatrix;
        } catch (error) {
            console.error('Error getting full matrix by ID in matricesModel:', error);
            throw error; // Rethrow the error for handling elsewhere
        }
    },

    /**
     * Delete a matrix and its elements
     * @param {number} matrix_id - The ID of the matrix to delete
     * @returns {Promise<number>} - A promise that resolves to the number of rows affected
     */
    deleteMatrix: async (matrix_id) => {
        try {
            console.log('Method: deleteMatrix in matricesModel');
            
            // Use a transaction to ensure both operations succeed or fail together
            const result = await db.transaction(async trx => {
                // Delete all matrix elements first (foreign key constraint)
                await trx('matrixElements').where('matrix_id', matrix_id).delete();
                
                // Then delete the matrix itself
                const deleted = await trx('matrices').where('id', matrix_id).delete();
                return deleted;
            });
            
            console.log('Result: ', result);
            return result;
        } catch (error) {
            console.error('Error deleting matrix in matricesModel:', error);
            throw error; // Rethrow the error for handling elsewhere
        }
    },
};

module.exports = MatricesModel;