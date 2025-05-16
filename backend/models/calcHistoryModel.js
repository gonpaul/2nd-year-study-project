const db = require("../config/database.js");

const CalcHistoryModel = {
    /**
     * Add a calculation to history
     * @param {number} user_id - User ID who performed the calculation
     * @param {number} operation_id - ID of the operation performed
     * @param {number} result_matrix_id - ID of the resulting matrix
     * @param {number} matrix_a_id - ID of the first matrix used
     * @param {number|null} matrix_b_id - ID of the second matrix (for binary operations)
     * @param {number|null} scalar_value - Value used for scalar operations
     * @returns {Promise<number>} - A promise that resolves to the ID of the newly added calculation history record
     */
    addCalculation: async ( 
        user_id, 
        operation_id, 
        result_matrix_id, 
        matrix_a_id, 
        matrix_b_id = null, 
        scalar_value = null 
    ) => {
        try {
            console.log('Method: addCalculation in calcHistoryModel');
            await db('calculationHistory').insert({
                user_id,
                operation_id,
                result_matrix_id,
                matrix_a_id,
                matrix_b_id,
                scalar_value
            });
            const historyId = (await db('calculationHistory')).at('-1').id;
            console.log('Result: ', historyId);
            return historyId;
        } catch (error) {
            console.error('Error adding calculation history in calcHistoryModel:', error);
            throw error; // Rethrow the error for handling elsewhere
        }
    },

    /**
     * Get calculation history for a user
     * @param {number} userId - User ID to get history for
     * @param {number} limit - Maximum number of records to return (default: 50)
     * @returns {Promise<Array>} - A promise that resolves to an array of calculation history records
     */
    getHistoryByUserId: async (userId, limit = 50) => {
        try {
            console.log('Method: getHistoryByUserId in calcHistoryModel');
            const history = await db('calculationHistory as ch')
                .join('operations as o', 'ch.operation_id', 'o.id')
                .select(
                    'ch.*',
                    'o.name',
                    'o.description',
                    'o.is_binary'
                )
                .where('ch.user_id', userId)
                .orderBy('ch.timestamp', 'desc')
                .limit(limit);
            console.log('Result: ', history); // returns an array of objects with calculation history data
            return history;
        } catch (error) {
            console.error('Error getting history by user ID in calcHistoryModel:', error);
            throw error; // Rethrow the error for handling elsewhere
        }
    },

    /**
     * Get a specific calculation history record
     * @param {number} historyId - ID of the history record to retrieve
     * @returns {Promise<Object|undefined>} - A promise that resolves to the history record or undefined if not found
     */
    getHistoryById: async (historyId) => {
        try {
            console.log('Method: getHistoryById in calcHistoryModel');
            const history = await db('calculationHistory as ch')
                .join('operations as o', 'ch.operation_id', 'o.id')
                .select(
                    'ch.*',
                    'o.name',
                    'o.description',
                    'o.is_binary'
                )
                .where('ch.id', historyId)
                .first(); // returns an object with calculation history data
            console.log('Result: ', history);
            return history;
        } catch (error) {
            console.error('Error getting history by ID in calcHistoryModel:', error);
            throw error; // Rethrow the error for handling elsewhere
        }
    },

    /**
     * Delete a calculation history record
     * @param {number} historyId - ID of the history record to delete
     * @returns {Promise<boolean>} - A promise that resolves to true if successful, false otherwise
     */
    deleteHistory: async (historyId) => {
        try {
            console.log('Method: deleteHistory in calcHistoryModel');
            const deleted = await db('calculationHistory')
                .where('id', historyId)
                .delete();
            console.log('Result: ', deleted); // returns a boolean
            return deleted;
        } catch (error) {
            console.error('Error deleting history in calcHistoryModel:', error);
            throw error; // Rethrow the error for handling elsewhere
        }
    },

    /**
     * Clear all calculation history for a user
     * @param {number} userId - User ID to clear history for
     * @returns {Promise<boolean>} - A promise that resolves to true if successful, false otherwise
     */
    clearUserHistory: async (userId) => {
        try {
            console.log('Method: clearUserHistory in calcHistoryModel');
            const deleted = await db('calculationHistory')
                .where('user_id', userId)
                .delete();
            console.log('Result: ', deleted); // returns a boolean
            return deleted;
        } catch (error) {
            console.error('Error clearing user history in calcHistoryModel:', error);
            throw error; // Rethrow the error for handling elsewhere
        }
    }
};

module.exports = CalcHistoryModel; 