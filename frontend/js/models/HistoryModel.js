const { addCalculationToHistory, getCaclHistoryByUser,
   deleteCaclHistoryForUser, getMatrixContentById
 } = require("../../reference/clientServerCommunication");
const { OperationsToId, getOperationById, OperationToId }= require("../../reference/operations.js");

class HistoryModel {
    // use userId=1 for a test, but create it beforehand
  constructor(userId = 1) {
      this.userId = userId;
      this.history = [];

      // if (userId) {
      //   this.update();
      // }
  }

  async update() {
    const response = await getCaclHistoryByUser(this.userId);
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
    for (historyObj of historyList) {
      // format each element to be an object with the following props
        //  { 
              // operation: String. name for an operation,
              // matrices: Array<Array<Number>,n>, 2>,
              // result: Array<Array<Number>,n>,
              // scalarValue: Number (for scalar multiplication) | null for everything else
        // }
        // here should be a call to a server to obtain both matrices
        const matrixA = getMatrixContentById(historyObj.matrix_a_id);
        const matrixB = getMatrixContentById(historyObj.matrix_b_id);
        const resultMatrix = getMatrixContentById(historyObj.result_matrix_id);

        const entry = {
          operation: getOperationById(historyObj.operation_id).name ?? historyObj.operation_name,
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
    return this.history;
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
      await addCalculationToHistory(this.userId, operationId, matrices[0], matrices[1], scalarValue, result);
      console.log(operation, matrices, result);
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