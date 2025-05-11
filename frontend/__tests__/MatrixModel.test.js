const MatrixModel = require('../js/models/MatrixModel.js');
const fixtures = require('./matrixFixtures');

describe('MatrixModel Full Tests (2x2 to 5x5)', () => {
    const model = new MatrixModel();
    
    // Тестирование базовых операций
    describe('Basic Operations', () => {
        fixtures.sizes.forEach(size => {
            test(`Addition ${size}x${size}`, () => {
                const {A, B, result} = fixtures.addition[size];
                expect(model.add(A, B)).toEqual(result);
            });

            test(`Subtraction ${size}x${size}`, () => {
                const {A, B, result} = fixtures.subtraction[size];
                expect(model.subtract(A, B)).toEqual(result);
            });

            if (fixtures.multiplication[size]) {
                test(`Multiplication ${size}x${size}`, () => {
                    const {A, B, result} = fixtures.multiplication[size];
                    expect(model.multiply(A, B)).toEqual(result);
                });
            }
        });
    });

    // Тестирование расширенных операций
    describe('Advanced Operations', () => {
        fixtures.sizes.forEach(size => {
            test(`Transpose ${size}x${size}`, () => {
                const {matrix, result} = fixtures.transpose[size];
                expect(model.transpose(matrix)).toEqual(result);
            });

            test(`Scalar Multiply ${size}x${size}`, () => {
                const {matrix, scalar, result} = fixtures.scalarMultiply[size];
                expect(model.scalarMultiply(matrix, scalar)).toEqual(result);
            });

            if (fixtures.determinant[size]) {
                test(`Determinant ${size}x${size}`, () => {
                    const {matrix, result} = fixtures.determinant[size];
                    expect(model.determinant(matrix)).toBe(result);
                });
            }

            if (fixtures.rank[size]) {
                test(`Rank ${size}x${size}`, () => {
                    const {matrix, result} = fixtures.rank[size];
                    expect(model.rank(matrix)).toBe(result);
                });
            }
        });

        // Специальные тесты для обратной матрицы
        [2, 3, 4].forEach(size => {
            if (fixtures.inverse[size]) {
                test(`Inverse ${size}x${size}`, () => {
                    const {matrix, result} = fixtures.inverse[size];
                    const calculated = model.inverse(matrix);
                    calculated.forEach((row, i) => {
                        row.forEach((val, j) => {
                            expect(val).toBeCloseTo(result[i][j]);
                        });
                    });
                });
            }
        });

        test('Inverse throws error for singular matrix', () => {
            const singularMatrix = [
                [1, 2, 3, 4],
                [2, 4, 6, 8],
                [3, 6, 9, 12],
                [4, 8, 12, 16]
            ];
            expect(() => model.inverse(singularMatrix)).toThrow('Matrix is singular');
        });
    });

    // Тестирование управления матрицами
    describe('Matrix Management', () => {
        fixtures.sizes.forEach(size => {
            test(`Resize to ${size}x${size}`, () => {
                model.resizeMatrix(size);
                expect(model.getMatrixA().length).toBe(size);
                expect(model.getMatrixB().length).toBe(size);
            });
        });

        test('Swap Matrices', () => {
            const initialA = model.getMatrixACopy();
            const initialB = model.getMatrixBCopy();
            model.swapMatrices();
            expect(model.getMatrixA()).toEqual(initialB);
            expect(model.getMatrixB()).toEqual(initialA);
        });
    });
});