class MatrixModel {
    constructor() {
        this.currentSize = 3;
        this.matrixA = this.createEmptyMatrix(3);
        this.matrixB = this.createEmptyMatrix(3);
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
}

module.exports = MatrixModel;