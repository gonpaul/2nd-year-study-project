import db from "../config/database.js";
import MatrixElementsModel from "./matrixElementModel.js";

const MatricesModel = {
    createMatrix: ({ user_id, matrix, rows, columns }) => {
        const runTransaction = db.transaction((user_id, matrix, rows, columns) => {
            // создаем константу с помощью которой берем данные из БД 
            const stmt = db.prepare(` 
                INSERT INTO matrices (user_id, rows, columns)
                VALUES (?, ?, ?)    
            `);
            // в результате выполняем SQL-запрос
            const result = stmt.run(user_id, rows, columns);
            const matrixId = result.lastInsertRowid; // выводим id новой матрицы

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < columns; c++) {
                    MatrixElementsModel.addElement({ matrix_id: matrixId, row_index: r, column_index: c, value: matrix[r][c] }); // addElement принимает переменныеmatrix_id, row_index, column_index, value которые не были объявлены раньше
                }
            } 
            return matrixId;
        });

        const matrixId = runTransaction(user_id, matrix, rows, columns);
        return matrixId;
    },

    // получаем матрицу по ID
    getMatrixById: (matrix_id) => {
        // также тащим id матрицы из БД
        const stmt = db.prepare(`
            SELECT * FROM matrices WHERE matrix_id = ?
        `);
        return stmt.get(matrix_id); // выполняем SQL-запрос в котором возращаем одну строку резулультата (объект с данными матрицы: matrix_id, user_id, rows, columns), иначе undefined
    },

    getFullMatrixById: (matrix_id) => {
        // create a transaction that gradually builds up a matrix
        const transactionFn = db.transaction((matrix_id) => {
            const matrixMetadata = MatricesModel.getMatrixById(matrix_id);
            const matrixId = matrixMetadata.matrix_id;
            const rows = matrixMetadata.rows;
            const columns = matrixMetadata.columns;
            const resultMatrix = new Array(rows).fill().map(() => new Array(columns).fill(0));

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < columns; c++) {
                    const element = MatrixElementsModel.getElement(matrixId, r, c);
                    resultMatrix[r][c] = element.value;
                }
            } 

            return resultMatrix;
        })

        return transactionFn(matrix_id);
    },

    // удаление мтарицы (и связанных элементов)
    deleteMatrix: ({ matrix_id }) => {
        // удаление элементов (???)
        // const deleteElementsStmt = db.prepare(`
        //     DELETE FROM matrixElements WHERE matrix_id = ?
        // `);
        // удаляем саму матрицу
        const deleteMatrixStmt = db.prepare(`
             DELETE FROM matrices WHERE matrix_id = ? 
        `);
        const result = deleteMatrixStmt.run(matrix_id);
        return {
          changes: result.changes,
          success: result.changes > 0
        };
    },
};

export default MatricesModel;