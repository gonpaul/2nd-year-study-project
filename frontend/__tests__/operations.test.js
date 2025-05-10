const MatrixModel = require('../js/models/MatrixModel');

describe('MatrixModel 2 x 2 size', () => {
    let matrixModel;

    beforeEach(() => {
        matrixModel = new MatrixModel(2);
    });

    it('should create an empty matrix', () => {
        const matrix = matrixModel.createEmptyMatrix(2);
        expect(matrix).toEqual([[0, 0], [0, 0]]);
    });

    describe('Binary operations', () => {
        it('should add two matrices', () => {
            const matrixA = [[1, 2], [3, 4]];
            const matrixB = [[5, 6], [7, 8]];
            const result = matrixModel.add(matrixA, matrixB);
            expect(result).toEqual([[6, 8], [10, 12]]);
        });

        it('should subtract two matrices', () => {
            const matrixA = [[1, 2], [3, 4]];
            const matrixB = [[5, 6], [7, 8]];
            const result = matrixModel.subtract(matrixA, matrixB);
            expect(result).toEqual([[-4, -4], [-4, -4]]);
        });

        it('should multiply two matrices', () => {
            const matrixA = [[1, 2],
            [3, 4]];
            const matrixB = [[5, 6],
            [7, 8]];
            const result = matrixModel.multiply(matrixA, matrixB);
            expect(result).toEqual([[19, 22], [43, 50]]);
        });

    });

    describe('Unary operations', () => {
        // Transpose
        // Multiply by scalar
        // Calculate determinant
        // Raise to power
        // Calculate rank
        // Calculate inverse
        
        let matrixA;
        
        beforeEach(() => {
            matrixA = [[1, 2],
                       [3, 4]];
        });

        it('should transpose a matrix', () => {
            matrixModel.setMatrixA(matrixA);
            const result = matrixModel.transpose(matrixA);
            expect(result).toEqual([[1, 3],
                                    [2, 4]]);
        });

        it('should multiply by scalar', () => {
            const result = matrixModel.multiplyByScalar(matrixA, 5);
            expect(result).toEqual([[5, 10],
                                     15, 20]);
        });

        it('should calculate determinant', () => {
            const result = matrixModel.calculateDeterminant(matrixA);
            // For a 2x2 matrix [[a, b], [c, d]], determinant is (a*d - b*c)
            // So for [[1, 2], [3, 4]], it's (1*4 - 2*3) = 4 - 6 = -2
            expect(result).toBe(-2);
        });

        it('should raise to power', () => {
            const result = matrixModel.raiseToPower(matrixA, 2);
            // Matrix A^2 = A * A
            // For [[1, 2], [3, 4]]^2 = [[1, 2], [3, 4]] * [[1, 2], [3, 4]]
            // = [[1*1 + 2*3, 1*2 + 2*4], [3*1 + 4*3, 3*2 + 4*4]]
            // = [[7, 10], [15, 22]]
            expect(result).toEqual([[7, 10], [15, 22]]);
            const squared = matrixModel.multiply(matrixA, matrixA);
            expect(result).toEqual(squared);

            // Test with power 3
            const resultPower3 = matrixModel.raiseToPower(matrixA, 3);
            // Matrix A^3 = A^2 * A
            // = [[7, 10], [15, 22]] * [[1, 2], [3, 4]]
            // = [[7*1 + 10*3, 7*2 + 10*4], [15*1 + 22*3, 15*2 + 22*4]]
            // = [[37, 54], [81, 118]]
            expect(resultPower3).toEqual([[37, 54], [81, 118]]);
            const cubed = matrixModel.multiply(squared, matrixA);
            expect(resultPower3).toEqual(cubed);
        });

        it('should calculate rank', () => {
            const result = matrixModel.calculateRank(matrixA);
            // For a 2x2 matrix with determinant != 0, the rank is 2
            // Since det([[1, 2], [3, 4]]) = -2 != 0, rank is 2
            expect(result).toBe(2);
            
            // Test a matrix with linearly dependent rows (rank 1)
            const singularMatrix = [[1, 2],
                                    [2, 4]]; // Second row is 2x first row
            const singularResult = matrixModel.calculateRank(singularMatrix);
            expect(singularResult).toBe(1);
        });

        it('should calculate inverse', () => {
            const result = matrixModel.calculateInverse(matrixA);
            // For a 2x2 matrix [[a, b], [c, d]], inverse is 1/(ad-bc) * [[d, -b], [-c, a]]
            // For [[1, 2], [3, 4]], it's 1/(-2) * [[4, -2], [-3, 1]] = [[-2, 1], [1.5, -0.5]]
            expect(result).toEqual([[-2, 1], [1.5, -0.5]]);
            
            // Verify that A * A^-1 = I (identity matrix)
            const identityMatrix = matrixModel.multiply(matrixA, result);
            // Due to floating point precision, we'll check if values are close enough
            expect(Math.abs(identityMatrix[0][0] - 1)).toBeLessThan(0.0001);
            expect(Math.abs(identityMatrix[0][1])).toBeLessThan(0.0001);
            expect(Math.abs(identityMatrix[1][0])).toBeLessThan(0.0001);
            expect(Math.abs(identityMatrix[1][1] - 1)).toBeLessThan(0.0001);
        });
    });

    /*
     * The following tests focus on matrix configuration operations rather than
     * mathematical calculations. These operations handle how matrices are managed
     * and manipulated in the application (swapping, resizing, etc.) and are
     * separated into their own test group to distinguish them from the calculation
     * operations tested above. Changes happen in-place.
     */
    describe('Matrix manipulation', () => {
        // Clear
        // Swap
        // Resize
        // Add one more matrix (optional)

        it('should clear matrix A', () => {
            const matrixA = [[1, 2], [3, 4]];
            matrixModel.setMatrixA(matrixA);
            expect(matrixModel.getMatrixA()).toEqual(matrixA);
            matrixModel.clearMatrix('A');
            expect(matrixModel.getMatrixA()).toEqual(matrixModel.createEmptyMatrix(2));
        });

        it('should clear matrix B', () => {
            const matrixB = [[5, 6], [7, 8]];
            matrixModel.setMatrixB(matrixB);
            expect(matrixModel.getMatrixB()).toEqual(matrixB);
            matrixModel.clearMatrix('B');
            expect(matrixModel.getMatrixB()).toEqual(matrixModel.createEmptyMatrix(2));
        });

        it('should swap two matrices', () => {
            const matrixA = [[1, 2], [3, 4]];
            const matrixB = [[5, 6], [7, 8]];
            matrixModel.setMatrixA(matrixA);
            matrixModel.setMatrixB(matrixB);
            matrixModel.swapMatrices();
            expect(matrixModel.getMatrixA()).toEqual(matrixB);
            expect(matrixModel.getMatrixB()).toEqual(matrixA);
        });

        it('should resize a matrix', () => {
            const matrixA = [[1, 2], [3, 4]];
            matrixModel.setMatrixA(matrixA);
            matrixModel.resizeMatrix(3);
            const resultingMatrix = [[1, 2, 0], [3, 4, 0], [0, 0, 0]];
            expect(matrixModel.getMatrixA()).toEqual(resultingMatrix);
        });
    });
});