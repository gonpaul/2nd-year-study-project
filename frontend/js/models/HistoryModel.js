class HistoryModel {
  constructor() {
      this.history = [];
  }

  addEntry(operationData) {
      this.history.unshift(operationData);
  }

  getHistory() {
      return this.history;
  }

  clearHistory() {
      this.history = [];
  }
}

module.exports = HistoryModel;