const MatrixModel = require('../models/MatrixModel');
const MatrixView = require('../views/MatrixView');
const HistoryModel = require('../models/HistoryModel');
const { OperationEnums } = require("../../reference/operations.js")

class MatrixController {
    constructor() {
        this.matrixModel = new MatrixModel();
        this.view = new MatrixView();
        this.historyModel = new HistoryModel(localStorage.userId ?? 1);
        this.bindEvents();
        this.initializeMatrices();
    }

    initializeMatrices() {
        this.view.updateMatrixDisplay('A', 3, this.matrixModel.matrixA);
        this.view.updateMatrixDisplay('B', 3, this.matrixModel.matrixB);
    }

    _addHistory(operationType, matrices, result) {
        const clonedMatrices = matrices.map(m =>
            JSON.parse(JSON.stringify(m))
        );
        const clonedResult = JSON.parse(JSON.stringify(result));

        this.historyModel.addEntry({
            operation: operationType,
            matrices: clonedMatrices,
            result: clonedResult,
        });

        this.view.updateHistory(this.historyModel.getHistory());
    }

    _clearHistory() {
        this.historyModel.clearHistory();
        this.view.updateHistory(this.historyModel.getHistory());
    }

    bindEvents() {
        // Очистка матриц
        document.getElementById('clear-a').addEventListener('click', () => {
            this.handleClear('A');
        });

        document.getElementById('clear-b').addEventListener('click', () => {
            this.handleClear('B');
        });

        // Размер матриц
        document.getElementById('resize-matrices').addEventListener('change', (e) => {
            this.handleResize(e.target.value);
        });

        // Обновление данных при вводе
        [this.view.matrixAContainer, this.view.matrixBContainer].forEach(container => {
            container.addEventListener('input', (e) => {
                if (e.target.classList.contains('matrix-cell')) {
                    this.handleMatrixInput(
                        container.id.split('-')[1],
                        e.target.dataset.row,
                        e.target.dataset.col,
                        e.target.value
                    );
                }
            });
        });

        // Очистка истории

        document.getElementById('clear-history').addEventListener('click', (e) =>{
            this._clearHistory();
        });

        // Бинарные операции
        document.getElementById('add-matrices').addEventListener('click', () => {
            this.handleAddition();
        });

        document.getElementById('subtract-matrices').addEventListener('click', () => {
            this.handleSubtraction();
        });

        document.getElementById('multiply-matrices').addEventListener('click', () => {
            this.handleMultiplication();
        });

        document.getElementById('swap-matrices').addEventListener('click', () => {
            this.handleSwap();
        });

        // Унарные операции
        ['a', 'b'].forEach(id => {
            // Транспонирование
            document.getElementById(`transpose-${id}`).addEventListener('click', () => {
                this.handleTranspose(id.toUpperCase());
            });

            // Умножение на скаляр
            document.getElementById(`multiply-${id}`).addEventListener('click', () => {
                const scalar = parseFloat(document.getElementById(`scalar-${id}`).value);
                this.handleScalarMultiply(id.toUpperCase(), scalar);
            });

            // Определитель
            document.getElementById(`determinant-${id}`).addEventListener('click', () => {
                this.handleDeterminant(id.toUpperCase());
            });

            // Обратная матрица
            document.getElementById(`inverse-${id}`).addEventListener('click', () => {
                this.handleInverse(id.toUpperCase());
            });

            // Ранг матрицы
            document.getElementById(`rank-${id}`).addEventListener('click', () => {
                this.handleRank(id.toUpperCase());
            });

            // Возведение в степень
            document.getElementById(`power-${id}`).addEventListener('click', () => {
                const power = parseInt(document.getElementById(`power-value-${id}`).value);
                this.handlePower(id.toUpperCase(), power);
            });
        });
    }

    // Обработчики операций
    handleResize(sizeString) {
        if (!sizeString) return;

        try {
            const newSize = parseInt(sizeString.split('x')[0]);
            this.matrixModel.resizeMatrix(newSize);
            this.view.updateMatrixDisplay('A', newSize, this.matrixModel.matrixA);
            this.view.updateMatrixDisplay('B', newSize, this.matrixModel.matrixB);
        } catch (error) {
            this.view.showError(error.message);
        }
    }

    handleMatrixInput(matrixId, row, col, value) {
        const matrix = matrixId === 'a'
            ? this.matrixModel.matrixA
            : this.matrixModel.matrixB;
        matrix[row][col] = value === '' ? 0 : parseFloat(value);
    }
    handleAddition() {
        try {
            const matrixA = this.matrixModel.getMatrixACopy();
            const matrixB = this.matrixModel.getMatrixBCopy();
            const result = this.matrixModel.add(matrixA, matrixB);
            this._addHistory(OperationEnums.ADD, [matrixA, matrixB], result);
        } catch (error) {
            this.view.showError(error.message);
        }
    }

    handleSubtraction() {
        try {
            const matrixA = this.matrixModel.getMatrixACopy();
            const matrixB = this.matrixModel.getMatrixBCopy();
            const result = this.matrixModel.subtract(matrixA, matrixB);
            this._addHistory(OperationEnums.SUBTRACT, [matrixA, matrixB], result);
        } catch (error) {
            this.view.showError(error.message);
        }
    }

    handleMultiplication() {
        try {
            const matrixA = this.matrixModel.getMatrixACopy();
            const matrixB = this.matrixModel.getMatrixBCopy();
            const result = this.matrixModel.multiply(matrixA, matrixB);
            this._addHistory(OperationEnums.MULTIPLY, [matrixA, matrixB], result);
        } catch (error) {
            this.view.showError(error.message);
        }
    }

    handleSwap() {
        try {
            const originalA = this.matrixModel.getMatrixACopy();
            const originalB = this.matrixModel.getMatrixBCopy();
            this.matrixModel.swapMatrices();
            this.view.updateMatrixDisplay('A', this.matrixModel.currentSize, this.matrixModel.matrixA);
            this.view.updateMatrixDisplay('B', this.matrixModel.currentSize, this.matrixModel.matrixB);
            // this._addHistory('swap', [originalA, originalB], [this.matrixModel.getMatrixACopy(), this.matrixModel.getMatrixBCopy()]);
        } catch (error) {
            this.view.showError(error.message);
        }
    }

    handleTranspose(matrixId) {
        try {
            const original = matrixId === 'A'
                ? this.matrixModel.getMatrixACopy()
                : this.matrixModel.getMatrixBCopy();
            const result = this.matrixModel.transpose(original);
            this._updateMatrix(matrixId, result);
            this._addHistory(OperationEnums.TRANSPOSE, [original], result);
        } catch (error) {
            this.view.showError(error.message);
        }
    }

    handleScalarMultiply(matrixId, scalar) {
        try {
            const original = matrixId === 'A'
                ? this.matrixModel.getMatrixACopy()
                : this.matrixModel.getMatrixBCopy();
            const result = this.matrixModel.scalarMultiply(original, scalar);
            this._updateMatrix(matrixId, result);
            this._addHistory(OperationEnums.MULTIPLYBYSCALAR, [original, [[scalar]]], result);
        } catch (error) {
            this.view.showError(error.message);
        }
    }

    handleDeterminant(matrixId) {
        try {
            const original = matrixId === 'A'
                ? this.matrixModel.getMatrixACopy()
                : this.matrixModel.getMatrixBCopy();
            const result = this.matrixModel.determinant(original);
            this._addHistory(OperationEnums.CALCULATEDETERMINANT, [original], [[result]]);
        } catch (error) {
            this.view.showError(error.message);
        }
    }

    handleInverse(matrixId) {
        try {
            const original = matrixId === 'A'
                ? this.matrixModel.getMatrixACopy()
                : this.matrixModel.getMatrixBCopy();
            const result = this.matrixModel.inverse(original);
            this._updateMatrix(matrixId, result);
            this._addHistory(OperationEnums.CALCULATEINVERSE, [original], result);
        } catch (error) {
            this.view.showError(error.message);
        }
    }

    handleRank(matrixId) {
        try {
            const original = matrixId === 'A'
                ? this.matrixModel.getMatrixACopy()
                : this.matrixModel.getMatrixBCopy();
            const result = this.matrixModel.rank(original);
            this._addHistory(OperationEnums.CALCULATERANK, [original], [[result]]);
        } catch (error) {
            this.view.showError(error.message);
        }
    }

    handlePower(matrixId, power) {
        try {
            const original = matrixId === 'A'
                ? this.matrixModel.getMatrixACopy()
                : this.matrixModel.getMatrixBCopy();
            let result = original;
            for (let i = 1; i < power; i++) {
                result = this.matrixModel.multiply(result, original);
            }
            this._updateMatrix(matrixId, result);
            this._addHistory(OperationEnums.RAISETOPOWER, [original, [[power]]], result);
        } catch (error) {
            this.view.showError(error.message);
        }
    }

    handleClear(matrixId) {
        try {
            this.matrixModel.clearMatrix(matrixId);
            const matrix = matrixId === 'A' ? this.matrixModel.matrixA : this.matrixModel.matrixB;
            this.view.updateMatrixDisplay(matrixId, this.matrixModel.currentSize, matrix);
        } catch (error) {
            this.view.showError(error.message);
        }
    }

    _updateMatrix(matrixId, result) {
        if (matrixId === 'A') {
            this.matrixModel.setMatrixA(result);
            this.view.updateMatrixDisplay('A', this.matrixModel.currentSize, result);
        } else {
            this.matrixModel.setMatrixB(result);
            this.view.updateMatrixDisplay('B', this.matrixModel.currentSize, result);
        }
    }
}

module.exports = MatrixController;