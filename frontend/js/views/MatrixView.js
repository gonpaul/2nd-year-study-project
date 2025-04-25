export class MatrixView {
    constructor() {
        // Matrix input elements
        this.matrixAElement = document.getElementById('matrix-a');
        this.matrixBElement = document.getElementById('matrix-b');
        
        // Clear buttons
        this.clearAButton = document.getElementById('clear-a');
        this.clearBButton = document.getElementById('clear-b');
        
        // Matrix operation buttons - A
        this.transposeAButton = document.getElementById('transpose-a');
        this.multiplyAButton = document.getElementById('multiply-a');
        this.scalarAInput = document.getElementById('scalar-a');
        this.determinantAButton = document.getElementById('determinant-a');
        this.powerAButton = document.getElementById('power-a');
        this.powerValueAInput = document.getElementById('power-value-a');
        this.rankAButton = document.getElementById('rank-a');
        this.inverseAButton = document.getElementById('inverse-a');
        
        // Matrix operation buttons - B
        this.transposeBButton = document.getElementById('transpose-b');
        this.multiplyBButton = document.getElementById('multiply-b');
        this.scalarBInput = document.getElementById('scalar-b');
        this.determinantBButton = document.getElementById('determinant-b');
        this.powerBButton = document.getElementById('power-b');
        this.powerValueBInput = document.getElementById('power-value-b');
        this.rankBButton = document.getElementById('rank-b');
        this.inverseBButton = document.getElementById('inverse-b');
        
        // Binary operation buttons
        this.swapMatricesButton = document.getElementById('swap-matrices');
        this.addMatricesButton = document.getElementById('add-matrices');
        this.subtractMatricesButton = document.getElementById('subtract-matrices');
        this.multiplyMatricesButton = document.getElementById('multiply-matrices');
        
        // History element
        this.historyContainer = document.getElementById('history-container');
    }

    // Initialize UI elements
    initializeMatrixInputs() {
        // Setup event listeners for matrix cell inputs
        this._setupMatrixInputListeners(this.matrixAElement, 'A');
        this._setupMatrixInputListeners(this.matrixBElement, 'B');
    }

    _setupMatrixInputListeners(matrixElement, matrixName) {
        const inputs = matrixElement.querySelectorAll('input.matrix-cell');
        
        let rowIndex = 0;
        let colIndex = 0;
        
        inputs.forEach(input => {
            input.dataset.row = rowIndex;
            input.dataset.col = colIndex;
            
            colIndex++;
            if (colIndex === 3) {
                colIndex = 0;
                rowIndex++;
            }
            
            // Add change event listener
            input.addEventListener('input', () => {
                const row = parseInt(input.dataset.row);
                const col = parseInt(input.dataset.col);
                
                if (this.onMatrixInputChanged) {
                    this.onMatrixInputChanged(matrixName, row, col, input.value);
                }
            });
        });
    }

    // Display matrices
    displayMatrices(matrixA, matrixB) {
        this._displayMatrix(this.matrixAElement, matrixA);
        this._displayMatrix(this.matrixBElement, matrixB);
    }

    _displayMatrix(matrixElement, matrix) {
        const inputs = matrixElement.querySelectorAll('input.matrix-cell');
        
        let index = 0;
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                if (index < inputs.length) {
                    inputs[index].value = matrix[i][j];
                    index++;
                }
            }
        }
    }

    // Display history
    displayHistory(history) {
        this.historyContainer.innerHTML = '';
        
        history.forEach(entry => {
            const historyEntry = document.createElement('div');
            historyEntry.textContent = entry;
            historyEntry.classList.add('history-entry');
            this.historyContainer.appendChild(historyEntry);
        });
    }

    // Event binding methods
    bindMatrixInputChanged(handler) {
        this.onMatrixInputChanged = handler;
    }

    bindClearMatrix(handler) {
        this.clearAButton.addEventListener('click', () => {
            handler('A');
        });
        
        this.clearBButton.addEventListener('click', () => {
            handler('B');
        });
    }

    bindTransposeMatrix(handler) {
        this.transposeAButton.addEventListener('click', () => {
            handler('A');
        });
        
        this.transposeBButton.addEventListener('click', () => {
            handler('B');
        });
    }

    bindMultiplyByScalar(handler) {
        this.multiplyAButton.addEventListener('click', () => {
            const scalar = parseFloat(this.scalarAInput.value) || 0;
            handler('A', scalar);
        });
        
        this.multiplyBButton.addEventListener('click', () => {
            const scalar = parseFloat(this.scalarBInput.value) || 0;
            handler('B', scalar);
        });
    }

    bindCalculateDeterminant(handler) {
        this.determinantAButton.addEventListener('click', () => {
            handler('A');
        });
        
        this.determinantBButton.addEventListener('click', () => {
            handler('B');
        });
    }

    bindRaiseToPower(handler) {
        this.powerAButton.addEventListener('click', () => {
            const power = parseInt(this.powerValueAInput.value) || 1;
            handler('A', power);
        });
        
        this.powerBButton.addEventListener('click', () => {
            const power = parseInt(this.powerValueBInput.value) || 1;
            handler('B', power);
        });
    }

    bindCalculateRank(handler) {
        this.rankAButton.addEventListener('click', () => {
            handler('A');
        });
        
        this.rankBButton.addEventListener('click', () => {
            handler('B');
        });
    }

    bindCalculateInverse(handler) {
        this.inverseAButton.addEventListener('click', () => {
            handler('A');
        });
        
        this.inverseBButton.addEventListener('click', () => {
            handler('B');
        });
    }

    bindSwapMatrices(handler) {
        this.swapMatricesButton.addEventListener('click', handler);
    }

    bindAddMatrices(handler) {
        this.addMatricesButton.addEventListener('click', handler);
    }

    bindSubtractMatrices(handler) {
        this.subtractMatricesButton.addEventListener('click', handler);
    }

    bindMultiplyMatrices(handler) {
        this.multiplyMatricesButton.addEventListener('click', handler);
    }
} 