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

        // Сложение матриц 
        document.getElementById('add-matrices').addEventListener('click', () => {
            this.handleAddition();
        });

        // Вычитание матриц
        document.getElementById('subtract-matrices').addEventListener('click', () => {
            this.handleSubtraction();
        });

        // Умножение матриц
        document.getElementById('multiply-matrices').addEventListener('click', () => {
            this.handleMultiplication();
        });

        // Обмен матрицами
        document.getElementById('swap-matrices').addEventListener('click', () => {
            this.handleSwap();
        });
    }

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
        const result = this.model.add(this.model.matrixA, this.model.matrixB);
        console.log(result);
    }

    handleSubtraction() {
        const result = this.model.subtract(this.model.matrixA, this.model.matrixB);
        console.log(result);
    }

    handleMultiplication() {
        const result = this.model.multiply(this.model.matrixA, this.model.matrixB);
        console.log(result);
    }

    handleSwap() {
        this.model.swapMatrices();
        this.view.updateMatrixDisplay('A', this.model.currentSize, this.model.matrixA);
        this.view.updateMatrixDisplay('B', this.model.currentSize, this.model.matrixB);
    }

    handleClear(matrixId) {
        this.model.clearMatrix(matrixId);
        this.view.updateMatrixDisplay(
            matrixId.toUpperCase(),
            this.model.currentSize,
            matrixId === 'A' ? this.model.matrixA : this.model.matrixB
        );
    }

}

module.exports = MatrixController;