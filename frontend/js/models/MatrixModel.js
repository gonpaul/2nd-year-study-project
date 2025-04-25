export class MatrixModel {
    constructor() {
        this.matrixA = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];
        this.matrixB = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];
        this.history = [];
        this.onMatrixChanged = null;
        this.onHistoryChanged = null;
    }

    // Bind callbacks
    bindMatrixChanged(callback) {
        this.onMatrixChanged = callback;
    }

    bindHistoryChanged(callback) {
        this.onHistoryChanged = callback;
    }

    // Update matrices
    updateMatrix(matrixName, row, col, value) {
        const numValue = Number(value) || 0;
        
        if (matrixName === 'A') {
            this.matrixA[row][col] = numValue;
        } else if (matrixName === 'B') {
            this.matrixB[row][col] = numValue;
        }
        
        this.notifyMatrixChanged();
    }

    // Matrix operations
    clearMatrix(matrixName) {
        const matrix = matrixName === 'A' ? this.matrixA : this.matrixB;
        
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                matrix[i][j] = 0;
            }
        }
        
        this.addToHistory(`Cleared matrix ${matrixName}`);
        this.notifyMatrixChanged();
    }

    transpose(matrixName) {
        const sourceMatrix = matrixName === 'A' ? this.matrixA : this.matrixB;
        const resultMatrix = [];
        
        for (let i = 0; i < sourceMatrix[0].length; i++) {
            resultMatrix[i] = [];
            for (let j = 0; j < sourceMatrix.length; j++) {
                resultMatrix[i][j] = sourceMatrix[j][i];
            }
        }
        
        if (matrixName === 'A') {
            this.matrixA = resultMatrix;
        } else {
            this.matrixB = resultMatrix;
        }
        
        this.addToHistory(`Transposed matrix ${matrixName}`);
        this.notifyMatrixChanged();
    }

    multiplyByScalar(matrixName, scalar) {
        const matrix = matrixName === 'A' ? this.matrixA : this.matrixB;
        
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                matrix[i][j] *= scalar;
            }
        }
        
        this.addToHistory(`Multiplied matrix ${matrixName} by ${scalar}`);
        this.notifyMatrixChanged();
    }

    determinant(matrix) {
        if (matrix.length !== matrix[0].length) {
            return "Not a square matrix";
        }
        
        if (matrix.length === 1) {
            return matrix[0][0];
        }
        
        if (matrix.length === 2) {
            return (matrix[0][0] * matrix[1][1]) - (matrix[0][1] * matrix[1][0]);
        }
        
        let result = 0;
        for (let j = 0; j < matrix[0].length; j++) {
            const cofactor = this.getCofactor(matrix, 0, j);
            result += matrix[0][j] * this.determinant(cofactor) * Math.pow(-1, j);
        }
        
        return result;
    }

    getCofactor(matrix, row, col) {
        const cofactor = [];
        for (let i = 0; i < matrix.length; i++) {
            if (i !== row) {
                const cofactorRow = [];
                for (let j = 0; j < matrix[i].length; j++) {
                    if (j !== col) {
                        cofactorRow.push(matrix[i][j]);
                    }
                }
                cofactor.push(cofactorRow);
            }
        }
        return cofactor;
    }

    calculateDeterminant(matrixName) {
        const matrix = matrixName === 'A' ? this.matrixA : this.matrixB;
        const det = this.determinant(matrix);
        
        this.addToHistory(`Det(${matrixName}) = ${det}`);
        return det;
    }

    raiseTopower(matrixName, power) {
        if (power < 1) {
            return;
        }
        
        const matrix = matrixName === 'A' ? this.matrixA : this.matrixB;
        
        // Check if it's a square matrix
        if (matrix.length !== matrix[0].length) {
            this.addToHistory(`Cannot raise non-square matrix ${matrixName} to power`);
            return;
        }
        
        // Save original matrix
        const originalMatrix = JSON.parse(JSON.stringify(matrix));
        let resultMatrix = JSON.parse(JSON.stringify(matrix));
        
        // Multiply matrix by itself (power-1) times
        for (let p = 1; p < power; p++) {
            resultMatrix = this.multiplyMatrices(resultMatrix, originalMatrix);
        }
        
        if (matrixName === 'A') {
            this.matrixA = resultMatrix;
        } else {
            this.matrixB = resultMatrix;
        }
        
        this.addToHistory(`Raised matrix ${matrixName} to power ${power}`);
        this.notifyMatrixChanged();
    }

    multiplyMatrices(matrixA, matrixB) {
        // Check if matrices can be multiplied
        if (matrixA[0].length !== matrixB.length) {
            return null;
        }
        
        const result = [];
        
        for (let i = 0; i < matrixA.length; i++) {
            result[i] = [];
            for (let j = 0; j < matrixB[0].length; j++) {
                result[i][j] = 0;
                for (let k = 0; k < matrixB.length; k++) {
                    result[i][j] += matrixA[i][k] * matrixB[k][j];
                }
            }
        }
        
        return result;
    }

    calculateRank(matrixName) {
        const matrix = matrixName === 'A' ? this.matrixA : this.matrixB;
        
        // Copy the matrix to avoid modifying the original
        const rref = this.getRREF(JSON.parse(JSON.stringify(matrix)));
        
        // Count non-zero rows
        let rank = 0;
        for (let i = 0; i < rref.length; i++) {
            let rowHasNonZero = false;
            for (let j = 0; j < rref[i].length; j++) {
                if (Math.abs(rref[i][j]) > 1e-10) { // Small threshold to handle floating point errors
                    rowHasNonZero = true;
                    break;
                }
            }
            if (rowHasNonZero) {
                rank++;
            }
        }
        
        this.addToHistory(`Rank(${matrixName}) = ${rank}`);
        return rank;
    }

    getRREF(matrix) {
        const rows = matrix.length;
        const cols = matrix[0].length;
        let lead = 0;
        
        for (let r = 0; r < rows; r++) {
            if (lead >= cols) {
                break;
            }
            
            let i = r;
            while (matrix[i][lead] === 0) {
                i++;
                if (i === rows) {
                    i = r;
                    lead++;
                    if (lead === cols) {
                        break;
                    }
                }
            }
            
            // Swap rows i and r
            if (i !== r) {
                [matrix[i], matrix[r]] = [matrix[r], matrix[i]];
            }
            
            // Scale the row so that the leading element is 1
            if (matrix[r][lead] !== 0) {
                const div = matrix[r][lead];
                for (let j = 0; j < cols; j++) {
                    matrix[r][j] /= div;
                }
            }
            
            // Subtract from other rows
            for (let i = 0; i < rows; i++) {
                if (i !== r) {
                    const factor = matrix[i][lead];
                    for (let j = 0; j < cols; j++) {
                        matrix[i][j] -= factor * matrix[r][j];
                    }
                }
            }
            
            lead++;
        }
        
        return matrix;
    }

    inverseMatrix(matrixName) {
        const matrix = matrixName === 'A' ? this.matrixA : this.matrixB;
        
        // Check if it's a square matrix
        if (matrix.length !== matrix[0].length) {
            this.addToHistory(`Cannot invert non-square matrix ${matrixName}`);
            return;
        }
        
        // Calculate determinant to check if matrix is invertible
        const det = this.determinant(matrix);
        if (Math.abs(det) < 1e-10) {
            this.addToHistory(`Matrix ${matrixName} is not invertible (det = 0)`);
            return;
        }
        
        const n = matrix.length;
        
        // Create the augmented matrix [matrix | I]
        const augmented = [];
        for (let i = 0; i < n; i++) {
            augmented[i] = new Array(2 * n).fill(0);
            for (let j = 0; j < n; j++) {
                augmented[i][j] = matrix[i][j];
            }
            augmented[i][i + n] = 1;
        }
        
        // Gauss-Jordan elimination
        for (let i = 0; i < n; i++) {
            // Find the pivot
            let maxRow = i;
            for (let j = i + 1; j < n; j++) {
                if (Math.abs(augmented[j][i]) > Math.abs(augmented[maxRow][i])) {
                    maxRow = j;
                }
            }
            
            // Swap rows
            if (maxRow !== i) {
                [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
            }
            
            // Scale the pivot row
            const pivot = augmented[i][i];
            if (Math.abs(pivot) < 1e-10) {
                this.addToHistory(`Matrix ${matrixName} is not invertible`);
                return;
            }
            
            for (let j = 0; j < 2 * n; j++) {
                augmented[i][j] /= pivot;
            }
            
            // Eliminate other rows
            for (let j = 0; j < n; j++) {
                if (j !== i) {
                    const factor = augmented[j][i];
                    for (let k = 0; k < 2 * n; k++) {
                        augmented[j][k] -= factor * augmented[i][k];
                    }
                }
            }
        }
        
        // Extract the inverse matrix
        const inverse = [];
        for (let i = 0; i < n; i++) {
            inverse[i] = [];
            for (let j = 0; j < n; j++) {
                inverse[i][j] = augmented[i][j + n];
            }
        }
        
        if (matrixName === 'A') {
            this.matrixA = inverse;
        } else {
            this.matrixB = inverse;
        }
        
        this.addToHistory(`Calculated inverse of matrix ${matrixName}`);
        this.notifyMatrixChanged();
    }

    // Matrix operations with two matrices
    swapMatrices() {
        [this.matrixA, this.matrixB] = [this.matrixB, this.matrixA];
        
        this.addToHistory('Swapped matrix A and B');
        this.notifyMatrixChanged();
    }

    addMatrices() {
        // Check if matrices have the same dimensions
        if (this.matrixA.length !== this.matrixB.length || 
            this.matrixA[0].length !== this.matrixB[0].length) {
            this.addToHistory('Cannot add matrices of different dimensions');
            return;
        }
        
        const result = [];
        for (let i = 0; i < this.matrixA.length; i++) {
            result[i] = [];
            for (let j = 0; j < this.matrixA[i].length; j++) {
                result[i][j] = this.matrixA[i][j] + this.matrixB[i][j];
            }
        }
        
        // Store the result in matrix A
        this.matrixA = result;
        
        this.addToHistory('Added matrix B to matrix A (A + B)');
        this.notifyMatrixChanged();
    }

    subtractMatrices() {
        // Check if matrices have the same dimensions
        if (this.matrixA.length !== this.matrixB.length || 
            this.matrixA[0].length !== this.matrixB[0].length) {
            this.addToHistory('Cannot subtract matrices of different dimensions');
            return;
        }
        
        const result = [];
        for (let i = 0; i < this.matrixA.length; i++) {
            result[i] = [];
            for (let j = 0; j < this.matrixA[i].length; j++) {
                result[i][j] = this.matrixA[i][j] - this.matrixB[i][j];
            }
        }
        
        // Store the result in matrix A
        this.matrixA = result;
        
        this.addToHistory('Subtracted matrix B from matrix A (A - B)');
        this.notifyMatrixChanged();
    }

    multiplyMatricesAB() {
        // Check if matrices can be multiplied
        if (this.matrixA[0].length !== this.matrixB.length) {
            this.addToHistory('Cannot multiply matrices: incompatible dimensions');
            return;
        }
        
        const result = this.multiplyMatrices(this.matrixA, this.matrixB);
        
        // Store the result in matrix A
        this.matrixA = result;
        
        this.addToHistory('Multiplied matrix A by matrix B (A * B)');
        this.notifyMatrixChanged();
    }

    // Helper methods
    addToHistory(message) {
        this.history.unshift(message);
        
        // Limit history to 10 items for simplicity
        if (this.history.length > 10) {
            this.history.pop();
        }
        
        this.notifyHistoryChanged();
    }

    notifyMatrixChanged() {
        if (this.onMatrixChanged) {
            this.onMatrixChanged(this.matrixA, this.matrixB);
        }
    }

    notifyHistoryChanged() {
        if (this.onHistoryChanged) {
            this.onHistoryChanged(this.history);
        }
    }
} 