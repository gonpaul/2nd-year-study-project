class MatrixModel {
    constructor(size = 3) {
        this.currentSize = size;
        this.matrixA = this.createEmptyMatrix(size);
        this.matrixB = this.createEmptyMatrix(size);
    }

    setMatrixA(matrix) {
        this.matrixA = matrix;
    }

    setMatrixB(matrix) {
        this.matrixB = matrix;
    }

    getMatrixA() {
        return this.matrixA;
    }

    getMatrixB() {
        return this.matrixB;
    }

    createEmptyMatrix(size) {
        return Array.from({ length: size }, () =>
            new Array(size).fill(0)
        );
    }

    resizeMatrix(newSize) {
        this.currentSize = newSize;
        this.matrixA = this._resizeMatrix(this.matrixA, newSize);
        this.matrixB = this._resizeMatrix(this.matrixB, newSize);
    }

    _resizeMatrix(matrix, newSize) {
        return Array.from({ length: newSize }, (_, row) =>
            Array.from({ length: newSize }, (_, col) =>
                (row < matrix.length && col < matrix[row]?.length)
                    ? matrix[row][col]
                    : 0
            )
        );
    }
    add(matrixA, matrixB) {
        return matrixA.map((row, i) =>
            row.map((val, j) => val + matrixB[i][j])
        );
    }

    subtract(matrixA, matrixB) {
        return matrixA.map((row, i) =>
            row.map((val, j) => val - matrixB[i][j])
        );
    }

    multiply(matrixA, matrixB) {
        return matrixA.map((rowA, i) =>
            rowA.map((_, j) =>
                rowA.reduce((sum, valA, k) =>
                    sum + valA * matrixB[k][j],
                    0)
            )
        );
    }

    swapMatrices() {
        [this.matrixA, this.matrixB] = [this.matrixB, this.matrixA];
    }

    clearMatrix(matrixId) {
        if (matrixId === 'A') {
            this.matrixA = this.createEmptyMatrix(this.currentSize);
        } else {
            this.matrixB = this.createEmptyMatrix(this.currentSize);
        }
    }
}
module.exports = MatrixModel;