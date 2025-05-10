const { addCalculationToHistory, getCaclHistoryByUser, deleteCaclHistoryForUser } = require("../../reference/clientServerCommunication");
const OperationsTable = require("../../reference/operations");

class HistoryModel {
    // use userId=1 for a test, but create it beforehand
  constructor(userId = null) {
      this.userId = userId;
      this.history = [];

      if (userId) {
        this.update();
      }
  }

  async update() {
    const newHistory = await getCaclHistoryByUser(this.userId);
    this.history = newHistory;
    return this.history;
  }

  async addEntry({ operation, matrices, result, scalarValue = null }) {
//   async addEntry({ operationId, matrixA, matrixB = null, scalarValue = null, resultMatrix }) {
      this.history.unshift({ operation, matrices, result, scalarValue});

    // this.historyModel.addEntry({
    //     operation: operationType,
    //     matrices: clonedMatrices,
    //     result: clonedResult,
    //     timestamp: new Date().toISOString()
    // });
      const operationId = OperationsTable[operation];
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