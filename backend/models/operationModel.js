import db from "../config/database.js";

const OperationModel = {
    /**
     * Get an operation by its ID
     * @param {number} operationId - The ID of the operation to retrieve
     * @returns {Object|null} - The operation object or null if not found
     */
    getOperationById: (operationId) => {
        const stmt = db.prepare(`
            SELECT * FROM operations 
            WHERE operation_id = ?
        `);
        return stmt.get(operationId);
    },

    /**
     * Get an operation by its name
     * @param {string} operationName - The name of the operation to retrieve
     * @returns {Object|undefined} - The operation object or undefined if not found
     */
    getOperationByName: (operationName) => {
        const stmt = db.prepare(`
            SELECT * FROM operations 
            WHERE operation_name = ?
        `);
        return stmt.get(operationName);
    },

    /**
     * Get all available operations
     * @returns {Array} - Array of operation objects
     */
    getAllOperations: () => {
        const stmt = db.prepare(`
            SELECT * FROM operations
            ORDER BY operation_name
        `);
        return stmt.all();
    },

    /**
     * Add a new operation
     * @param {Object} operation - Object containing operation details
     * @returns {number} - The ID of the newly added operation
     */
    addOperation: ({ operation_name, description, is_binary }) => {
        const stmt = db.prepare(`
            INSERT INTO operations (operation_name, description, is_binary)
            VALUES (?, ?, ?)
        `);
        const result = stmt.run(operation_name, description, is_binary ? 1 : 0);
        return result.lastInsertRowid;
    },

    /**
     * Check if operation exists by name
     * @param {string} name - Operation name to check
     * @returns {boolean} - True if operation exists, false otherwise
     */
    operationExists: (name) => {
        const stmt = db.prepare(`
            SELECT 1 FROM operations 
            WHERE operation_name = ? 
            LIMIT 1
        `);
        return stmt.get(name) !== undefined;
    }
};

export default OperationModel; 