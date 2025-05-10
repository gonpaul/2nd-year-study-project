import db from "../config/database.js";

const CalcHistoryModel = {
    /**
     * Add a calculation to history
     * @param {Object} params - Calculation parameters
     * @returns {number} - The ID of the newly added calculation history record
     */
    addCalculation: ({ 
        user_id, 
        operation_id, 
        result_matrix_id, 
        matrix_a_id, 
        matrix_b_id = null, 
        scalar_value = null 
    }) => {
        const stmt = db.prepare(`
            INSERT INTO calculationHistory 
            (user_id, operation_id, result_matrix_id, matrix_a_id, matrix_b_id, scalar_value)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        
        const result = stmt.run(
            user_id, 
            operation_id, 
            result_matrix_id, 
            matrix_a_id, 
            matrix_b_id, 
            scalar_value
        );
        
        return result.lastInsertRowid;
    },

    /**
     * Get calculation history for a user
     * @param {number} userId - User ID to get history for
     * @param {number} limit - Maximum number of records to return (default: 50)
     * @returns {Array} - Array of calculation history records
     */
    getHistoryByUserId: (userId, limit = 50) => {
        const stmt = db.prepare(`
            SELECT ch.*, 
                   o.operation_name, 
                   o.description,
                   o.is_binary
            FROM calculationHistory ch
            JOIN operations o ON ch.operation_id = o.operation_id
            WHERE ch.user_id = ?
            ORDER BY ch.timestamp DESC
            LIMIT ?
        `);
        
        return stmt.all(userId, limit);
    },

    /**
     * Get a specific calculation history record
     * @param {number} historyId - ID of the history record to retrieve
     * @returns {Object|null} - The history record or null if not found
     */
    getHistoryById: (historyId) => {
        const stmt = db.prepare(`
            SELECT ch.*, 
                   o.operation_name, 
                   o.description,
                   o.is_binary
            FROM calculationHistory ch
            JOIN operations o ON ch.operation_id = o.operation_id
            WHERE ch.history_id = ?
        `);
        
        return stmt.get(historyId);
    },

    /**
     * Delete a calculation history record
     * @param {number} historyId - ID of the history record to delete
     * @returns {boolean} - True if successful, false otherwise
     */
    deleteHistory: (historyId) => {
        const stmt = db.prepare(`
            DELETE FROM calculationHistory
            WHERE history_id = ?
        `);
        
        const result = stmt.run(historyId);
        return result.changes > 0;
    },

    /**
     * Clear all calculation history for a user
     * @param {number} userId - User ID to clear history for
     * @returns {boolean} - True if successful, false otherwise
     */
    clearUserHistory: (userId) => {
        const stmt = db.prepare(`
            DELETE FROM calculationHistory
            WHERE user_id = ?
        `);
        
        const result = stmt.run(userId);
        return result.changes > 0;
    }
};

export default CalcHistoryModel; 