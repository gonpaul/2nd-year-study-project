// const db = require("../config/database.js");

let db;

(async () => {
  db = await require("../config/database.js");
})();

const MatrixElementsModel = {
    /**
     * Add a new element to a matrix
     * @param {number} matrix_id - ID of the matrix
     * @param {number} row_index - Row index
     * @param {number} column_index - Column index
     * @param {number} value - Element value
     * @returns {Promise<number>} - A promise that resolves to the ID of the newly added element
     */
    addElement: async ( matrix_id, row_index, column_index, value ) => {
        try {
            console.log('Method: addElement in matrixElementModel');
            await db('matrixElements').insert({
                matrix_id,
                row_index,
                column_index,
                value
            });
            const newId = (await db('matrixElements')).at('-1').id;
            console.log('Result: ', newId);
            return newId;
        } catch (error) {
            console.error('Error adding matrix element in matrixElementModel:', error);
            throw error; // Rethrow the error for handling elsewhere
        }
    },

    /**
     * Get a specific element from a matrix
     * @param {number} matrixId - ID of the matrix
     * @param {number} rowIndex - Row index
     * @param {number} columnIndex - Column index
     * @returns {Promise<Object|undefined>} - A promise that resolves to the element object or undefined if not found
     */
    getElement: async (matrixId, rowIndex, columnIndex) => {
        try {
            console.log('Method: getElement in matrixElementModel');
            const element = await db('matrixElements')
                .where({
                    matrix_id: matrixId,
                    row_index: rowIndex,
                    column_index: columnIndex
                })
                .first();
            console.log('Result: ', element);
            return element;
        } catch (error) {
            console.error('Error getting matrix element in matrixElementModel:', error);
            throw error; // Rethrow the error for handling elsewhere
        }
    }
};

module.exports = MatrixElementsModel;