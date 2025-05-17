const { addCalculationToHistory, getCaclHistoryByUser,
   deleteCaclHistoryForUser, getMatrixContentById
 } = require("../../reference/clientServerCommunication");
const { getOperationById, OperationToId }= require("../../reference/operations.js");

function prettyPrintAddCalculation(userId, operationId, matrixA, matrixB, scalarValue, result) {
    console.log("Adding Calculation to History:");
    console.log(`User ID: ${userId}`);
    console.log(`Operation ID: ${operationId}`);
    console.log("Matrix A:", JSON.stringify(matrixA, null, 2)); // Pretty print matrix A
    console.log("Matrix B:", JSON.stringify(matrixB, null, 2)); // Pretty print matrix B
    console.log(`Scalar Value: ${scalarValue}`);
    console.log("Result:", JSON.stringify(result, null, 2)); // Pretty print result
}

class HistoryModel {
    // use userId=1 for a test, but create it beforehand
  constructor(userId) {
      this.userId = userId;
      this.history = [];

      // if (userId) {
      //   this.update();
      // }
  }

  async update() {
    const response = await getCaclHistoryByUser(this.userId);
    if (!response) {
      console.error("Failed to fetch the history for userId = ", this.userId);
      return false;
    }
    const historyList = response.history;
    const newHistory = [];
  //   {
  //     "history": [
  //         {
  //             "history_id": 1,
  //             "user_id": 1,
  //             "operation_id": 7,
  //             "result_matrix_id": 3,
  //             "matrix_a_id": 1,
  //             "matrix_b_id": 2,
  //             "scalar_value": null,
  //             "timestamp": "2025-05-11 11:33:51",
  //             "operation_name": "Add",
  //             "description": "Add two matrices",
  //             "is_binary": 1
  //         }
  //     ]
  // }
    for (const historyObj of historyList) {
      // format each element to be an object with the following props
        //  { 
              // operation: String. name for an operation,
              // matrices: Array<Array<Number>,n>, 2>,
              // result: Array<Array<Number>,n>,
              // scalarValue: Number (for scalar multiplication) | null for everything else
        // }
        // here should be a call to a server to obtain both matrices
        const matrixAResponse = await getMatrixContentById(historyObj.matrix_a_id);
        let matrixA;
        if (matrixAResponse) {
          matrixA = matrixAResponse.matrix;
        }
        const matrixBResponse = (historyObj.matrix_b_id === null) ? null : await getMatrixContentById(historyObj.matrix_b_id);
        let matrixB = null;
        if (matrixBResponse) {
          matrixB = matrixBResponse.matrix;
        }
        const resultMatrixResponse = await getMatrixContentById(historyObj.result_matrix_id);
        const resultMatrix = resultMatrixResponse.matrix;


        const entry = {
          operation: getOperationById(historyObj.operation_id).name,
          matrices: [matrixA, matrixB],
          result: resultMatrix,
          scalarValue: historyObj.scalar_value,
          timestamp: historyObj.timestamp
        };

        // historyList has reversed order by timestamp, meaning the last calculated operation
        // is the first in the array
        newHistory.push(entry);
    }

    this.history = newHistory;
    return true;
  }

  async addEntry({ operation, matrices, result, scalarValue = null }) {
//   async addEntry({ operationId, matrixA, matrixB = null, scalarValue = null, resultMatrix }) {
      this.history.unshift({ operation, matrices, 
          result, scalarValue, timestamp: new Date().toISOString});

    // example usage:
    // this.historyModel.addEntry({
    //     operation: operationType,
    //     matrices: clonedMatrices,
    //     result: clonedResult,
    // });
      const operationId = OperationToId[operation];

      // if it misses it should be null, otherwise
      // matrixB should be filled up with zeroes if only one value is in matrix
      // or left unchaged
      // const matrixB = (!matrices[1] || !Array.isArray(matrices[1]) || 
      //   (Array.isArray(matrices[1]) && matrices.length !== matrices[0].length )) ? null : matrices[1];
      const matrixB = !matrices[1] ? null : matrices[1];
 
      console.log("Input data:")
      console.log(operation, matrices, result, scalarValue);
      prettyPrintAddCalculation(this.userId, operationId, matrices[0], matrixB, scalarValue, result);
      await addCalculationToHistory(this.userId, operationId, matrices[0], matrixB, scalarValue, result);
  }

  getHistory() {
      return this.history;
  }

  async clearHistory() {
      this.history = [];
      await deleteCaclHistoryForUser(this.userId);
  }
}

module.exports = HistoryModel;