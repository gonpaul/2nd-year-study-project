import db from "../config/database.js";

const MatrixElementsModel = {
    addElement: ({ matrix_id, row_index, column_index, value }) => {
        const stmt = db.prepare(`
            INSERT INTO matrixElements (matrix_id, row_index, column_index, value)
            VALUES (?, ?, ?, ?)
        `);
        const result = stmt.run(matrix_id, row_index, column_index, value);
        return result.lastInsertRowid;
    },

    getElement: (matrixId, rowIndex, columnIndex) => {
        const stmt = db.prepare(`
            SELECT * FROM matrixElements WHERE matrix_id = ? AND row_index = ? AND column_index = ?
        `);
        const result = stmt.get(matrixId, rowIndex, columnIndex);
        return result;
    }

};

export default MatrixElementsModel;