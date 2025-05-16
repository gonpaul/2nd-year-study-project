const db = require("../config/database.js");

const OperationModel = {
    /**
     * Get an operation by its ID
     * @param {number} operationId - The ID of the operation to retrieve
     * @returns {Promise<Object|undefined>} - A promise that resolves to the operation object or undefined if not found
     */
    getOperationById: async (operationId) => {
        try {
            console.log('Method: getOperationById in operationModel');
            const operation = await db('operations').where('id', operationId).first();
            console.log('Result: ', operation); // returns an object with operation data
            return operation;
        } catch (error) {
            console.error('Error getting operation by ID in operationModel:', error);
            throw error; // Rethrow the error for handling elsewhere
        }
    },

    /**
     * Get an operation by its name
     * @param {string} operationName - The name of the operation to retrieve
     * @returns {Promise<Object|undefined>} - A promise that resolves to the operation object or undefined if not found
     */
    getOperationByName: async (operationName) => {
        try {
            console.log('Method: getOperationByName in operationModel');
            const operation = await db('operations').where('name', operationName).first();
            console.log('Result: ', operation); // returns an object with operation data
            return operation;
        } catch (error) {
            console.error('Error getting operation by name in operationModel:', error);
            throw error; // Rethrow the error for handling elsewhere
        }
    },

    /**
     * Get all available operations
     * @returns {Promise<Array>} - A promise that resolves to an array of operation objects
     */
    getAllOperations: async () => {
        try {
            console.log('Method: getAllOperations in operationModel');
            const operations = await db('operations').orderBy('name');
            console.log('Result: ', operations); // returns an array of objects with operation data
            return operations;
        } catch (error) {
            console.error('Error getting all operations in operationModel:', error);
            throw error; // Rethrow the error for handling elsewhere
        }
    },

    /**
     * Check if operation exists by name
     * @param {string} name - Operation name to check
     * @returns {Promise<boolean>} - A promise that resolves to true if operation exists, false otherwise
     */
    operationExists: async (name) => {
        try {
            console.log('Method: operationExists in operationModel');
            const operation = await db('operations').where('name', name).first();
            console.log('Result: ', operation); // returns an object with operation data
            return operation !== undefined;
        } catch (error) {
            console.error('Error checking if operation exists in operationModel:', error);
            throw error; // Rethrow the error for handling elsewhere
        }
    }
};

module.exports = OperationModel;