import MatrixModel from "../models/matricesModel.js"


const matrixController = {
    // damn it! here should be a transaction that assembles the whole matrix, element by element
    getMatrixById: (matrixId) => {
        try {
            const matrixEntry = MatrixModel.getMatrixById(matrixId);
            console.log(matrixEntry);
            return matrixEntry;


        } catch (error) {
            console.error(`Error getting a matrix with id = ${matrixId}`, error)
            return false;
        }
    },

    getMatrixContentById: (matrixId) => {
        try {
            const matrixContent = MatrixModel.getFullMatrixById(matrixId);
            console.log(matrixContent);
            return matrixContent;


        } catch (error) {
            console.error(`Error getting a matrix with id = ${matrixId}`, error)
            return false;
        }
    }

};

export default matrixController;