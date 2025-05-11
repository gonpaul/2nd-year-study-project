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

    getMatrixACopy() {
        return JSON.parse(JSON.stringify(this.matrixA));
    }

    getMatrixB() {
        return this.matrixB;
    }

    getMatrixBCopy() {
        return JSON.parse(JSON.stringify(this.matrixB));
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

    transpose(matrix) {
        return matrix[0].map((_, col) =>
            matrix.map(row => row[col])
        );
    }

    scalarMultiply(matrix, scalar) {
        return matrix.map(row =>
            row.map(val => val * scalar)
        );
    }

    determinant(matrix) {
        const size = matrix.length;

        // Базовые случаи
        if (size === 1) return matrix[0][0];
        if (size === 2) {
            return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
        }

        // Рекурсивное разложение по первой строке
        return matrix[0].reduce(
            (sum, val, col) => sum + (-1) ** col * val * this.determinant(
                matrix.slice(1)
                    .map(row => row.filter((_, j) => j !== col))
            ), 0
        );
    }


    // Две функции ниже нужны для invers
    // Алгебраические дополнения
    cofactor(matrix) {
        return matrix.map((row, i) =>
            row.map((_, j) =>
                ((-1) ** (i + j)) * this.minor(matrix, i, j)
            ));
    }

    // Минор элемента
    minor(matrix, row, col) {
        return this.determinant(
            matrix.map(r => r.filter((_, j) => j !== col))
                .filter((_, i) => i !== row)
        );
    }

    inverse(matrix) {
        const det = this.determinant(matrix);
        if (Math.abs(det) < 1e-10) throw new Error('Matrix is singular');

        return this.scalarMultiply(
            this.transpose(this.cofactor(matrix)),
            1 / det
        );
    }

    rank(matrix) {
        let rank = 0;
        const m = matrix.map(row => [...row]);

        for (let col = 0; col < m[0].length; col++) {
            let pivot = -1;
            for (let row = rank; row < m.length; row++) {
                if (Math.abs(m[row][col]) > 1e-10) {
                    pivot = row;
                    break;
                }
            }

            if (pivot === -1) continue;

            [m[rank], m[pivot]] = [m[pivot], m[rank]];

            for (let row = 0; row < m.length; row++) {
                if (row !== rank && Math.abs(m[row][col]) > 1e-10) {
                    const factor = m[row][col] / m[rank][col];
                    for (let c = col; c < m[0].length; c++) {
                        m[row][c] -= factor * m[rank][c];
                    }
                }
            }
            rank++;
        }
        return rank;
    }
}
module.exports = MatrixModel;