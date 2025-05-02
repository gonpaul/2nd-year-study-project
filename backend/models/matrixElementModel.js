import db from "../config/database.js";

const MatrixElementsModel = {
    addElement: ({ matrix_id, row_index, column_index, value }) => {
        const stmt = db.prepare(`
            INSERT INTO matrixElements (matrix_id, row_index, column_index, value)
            VALUES (?, ?, ?, ?)
        `);
        const result = stmt.run(matrix_id, row_index, column_index, value);
        return result.lastInsertRowid;
    }
};

export default MatrixElementsModel;