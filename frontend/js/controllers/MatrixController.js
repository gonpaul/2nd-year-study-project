const MatrixModel = require('../models/MatrixModel');
const MatrixView = require('../views/MatrixView');

class MatrixController {
    constructor() {
        this.model = new MatrixModel();
        this.view = new MatrixView();
        this.bindEvents();
        this.initializeMatrices();
    }

    initializeMatrices() {
        this.view.updateMatrixDisplay('A', 3, this.model.matrixA);
        this.view.updateMatrixDisplay('B', 3, this.model.matrixB);
    }

    _addHistory(operationType, matrices, result) {
        this.view.displayHistoryEntry({
            operation: operationType,
            matrices: matrices,
            result: result
        });
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
            this.model.resizeMatrix(newSize);
            this.view.updateMatrixDisplay('A', newSize, this.model.matrixA);
            this.view.updateMatrixDisplay('B', newSize, this.model.matrixB);
        } catch (error) {
            this.view.showError(error.message);
        }
    }

    handleMatrixInput(matrixId, row, col, value) {
        const matrix = matrixId === 'a'
            ? this.model.matrixA
            : this.model.matrixB;
        matrix[row][col] = parseFloat(value) || 0;
    }

    handleAddition() {
        try {
            const result = this.model.add(this.model.matrixA, this.model.matrixB);
            this._addHistory('add', [this.model.matrixA, this.model.matrixB], result);
        } catch (error) {
            this.view.showError(error.message);
        }
    }

    handleSubtraction() {
        try {
            const result = this.model.subtract(this.model.matrixA, this.model.matrixB);
            this._addHistory('subtract', [this.model.matrixA, this.model.matrixB], result);
        } catch (error) {
            this.view.showError(error.message);
        }
    }

    handleMultiplication() {
        try {
            const result = this.model.multiply(this.model.matrixA, this.model.matrixB);
            this._addHistory('multiply', [this.model.matrixA, this.model.matrixB], result);
        } catch (error) {
            this.view.showError(error.message);
        }
    }

    handleSwap() {
        try {
            this.model.swapMatrices();
            this.view.updateMatrixDisplay('A', this.model.currentSize, this.model.matrixA);
            this.view.updateMatrixDisplay('B', this.model.currentSize, this.model.matrixB);
        } catch (error) {
            this.view.showError(error.message);
        }
    }

    handleClear(matrixId) {
        try {
            this.model.clearMatrix(matrixId);
            const matrix = matrixId === 'A' ? this.model.matrixA : this.model.matrixB;
            this.view.updateMatrixDisplay(matrixId, this.model.currentSize, matrix);
        } catch (error) {
            this.view.showError(error.message);
        }
    }

    handleTranspose(matrixId) {
        try {
            const matrix = matrixId === 'A' ? this.model.matrixA : this.model.matrixB;
            const result = this.model.transpose(matrix);
            this._updateMatrix(matrixId, result);
            this._addHistory('transpose', [matrix], result);
        } catch (error) {
            this.view.showError(error.message);
        }
    }

    handleScalarMultiply(matrixId, scalar) {
        try {
            const matrix = matrixId === 'A' ? this.model.matrixA : this.model.matrixB;
            const result = this.model.scalarMultiply(matrix, scalar);
            this._updateMatrix(matrixId, result);
            this._addHistory('scalar', [matrix, [[scalar]]], result);
        } catch (error) {
            this.view.showError(error.message);
        }
    }

    handleDeterminant(matrixId) {
        try {
            const matrix = matrixId === 'A' ? this.model.matrixA : this.model.matrixB;
            const result = this.model.determinant(matrix);
            this._addHistory('determinant', [matrix], [[result]]);
        } catch (error) {
            this.view.showError(error.message);
        }
    }

    handleInverse(matrixId) {
        try {
            const matrix = matrixId === 'A' ? this.model.matrixA : this.model.matrixB;
            const result = this.model.inverse(matrix);
            this._updateMatrix(matrixId, result);
            this._addHistory('inverse', [matrix], result);
        } catch (error) {
            this.view.showError(error.message);
        }
    }

    handleRank(matrixId) {
        try {
            const matrix = matrixId === 'A' ? this.model.matrixA : this.model.matrixB;
            const result = this.model.rank(matrix);
            this._addHistory('rank', [matrix], [[result]]);
        } catch (error) {
            this.view.showError(error.message);
        }
    }

    handlePower(matrixId, power) {
        try {
            let matrix = matrixId === 'A' ? this.model.matrixA : this.model.matrixB;
            let result = matrix;
            for (let i = 1; i < power; i++) {
                result = this.model.multiply(result, matrix);
            }
            this._updateMatrix(matrixId, result);
            this._addHistory('power', [matrix, [[power]]], result);
        } catch (error) {
            this.view.showError(error.message);
        }
    }

    _updateMatrix(matrixId, result) {
        if (matrixId === 'A') {
            this.model.matrixA = result;
            this.view.updateMatrixDisplay('A', this.model.currentSize, result);
        } else {
            this.model.matrixB = result;
            this.view.updateMatrixDisplay('B', this.model.currentSize, result);
        }
    }
}

module.exports = MatrixController;