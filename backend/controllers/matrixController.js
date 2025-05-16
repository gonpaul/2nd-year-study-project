const MatrixModel = require("../models/matricesModel.js")


const matrixController = {
    // damn it! here should be a transaction that assembles the whole matrix, element by element
    getMatrixById: async (matrixId) => {
        try {
            const matrixEntry = await MatrixModel.getMatrixById(matrixId);
            console.log(matrixEntry);
            return matrixEntry;


        } catch (error) {
            console.error(`Error getting a matrix with id = ${matrixId}`, error)
            return false;
        }
    },

    getMatrixContentById: async (matrixId) => {
        try {
            const matrixContent = await MatrixModel.getFullMatrixById(matrixId);
            console.log(matrixContent);
            return matrixContent;


        } catch (error) {
            console.error(`Error getting a matrix with id = ${matrixId}`, error)
            return false;
        }
    }

};

module.exports = matrixController;