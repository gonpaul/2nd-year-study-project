const MatrixModel = require('../js/models/MatrixModel.js');
const { OperationsTable } = require('../reference/operations.js');

describe('Calculation history', () => {
    let matrixModel;
    let matrixA;
    let matrixB;
    let scalar;

    beforeEach(() => {
        matrixModel = new MatrixModel();
        matrixA = [[1, 2, 3],
                   [4, 5, 6],
                   [7, 8, 9]];
        matrixA = [[1, 2, 3],
                   [1, 4, 1],
                   [1, 6, 1]];
        scalar = 5;
    });

    // Required fields (Rf) = userId, operationId, matrixA, resultMatrix
    // Required for unary calculation: Rf + (scalarValue or nothing, i.e transpose)
    // Required for binary: Rf + matrixB
    const calculations = [
        {
            operationId: OperationsTable.unary.transpose, // id is 1
            matrixA: matrixA,
            matrixB: null,
            scalarValue: null,
            resultMatrix: MatrixModel.transpose(matrixA)
        },
        {
            operationId: OperationsTable.unary.multiplyByScalar, // id is 2
            matrixA: matrixA,
            matrixB: null,
            scalarValue: scalar,
            resultMatrix: MatrixModel.multiplyByScalar(matrixA, scalar)
        },
        {
            operationId: OperationsTable.binary.multiply, // id is 9
            matrixA: matrixA,
            matrixB: matrixB,
            scalarValue: null,
            resultMatrix: MatrixModel.multiply(matrixA, matrixB)
        },
    ]


    it('historyModel should exist, be accessible and functionable inside matrixModel', () => {
        expect(matrixModel.getCalcHistoryModel).toBeDefined();
        expect(typeof matrixModel.getCalcHistoryModel).toBe('function');
        const historyModel = matrixModel.getCalcHistoryModel();
        expect(matrixModel.calcHistoryModel).toBeDefined();
        expect(historyModel).toBeDefined();

        // functionality check
        expect(historyModel.getHistory).toBeDefined();
        expect(typeof historyModel.getHistory).toBe('function');
        expect(historyModel.getHistory()).toBeInstanceOf(Array);

    })

    it('#1 should add new entries to the history', () => {
        const historyModel = matrixModel.getCalcHistoryModel();
        // Check if the method exists on the matrixModel instance
        expect(matrixModel.addHistoryEntry).toBeDefined();
        expect(typeof matrixModel.addHistoryEntry).toBe('function');

        // Required fields (Rf) = userId, operationId, matrixA, resultMatrix
        // Required for unary calculation: Rf + (scalarValue or nothing, i.e transpose)
        // Required for binary: Rf + matrixB
        for (const calculation of calculations) {
            const insertedSuccess = matrixModel.addHistoryEntry(
                // userId should be processesed inside the function
                calculation.operationId,
                calculation.matrixA,
                calculation.matrixB,
                calculation.scalarValue,
                calculation.resultMatrix
            )

            expect(insertedSuccess).toBe(true);
            expect(historyModel.getLastEntry).toBeDefined();
            expect(typeof historyModel.getLastEntry).toBe('function');
            const lastEntry = historyModel.getLastEntry();
            
            // toEqual checks deep equality of object properties, not reference equality
            // This will work as long as the objects have the same structure and values
            expect(lastEntry).toEqual(calculation);
            
            // If we wanted to check reference equality, we would use toBe instead:
            // expect(lastEntry).toBe(calculation); // This would likely fail
        }
    });

    it('#2 should display only last 5 operations, if the history is greater than 5', () => {
        const historyModel = matrixModel.getCalcHistoryModel();
        
        // Add more than 5 entries to the history
        const testEntries = [];
        for (let i = 0; i < 10; i++) {
            const entry = {
                operationId: 7, // binary addition
                matrixA: [[i, i], [i, i]],
                matrixB: [[i, i], [i, i]],
                resultMatrix: [[i*2, i*2], [i*2, i*2]]
            };
            testEntries.push(entry);
            matrixModel.addHistoryEntry(
                entry.operationId,
                entry.matrixA,
                entry.matrixB,
                null,
                entry.resultMatrix
            );
        }
        
        // Get the history and check its length
        const offset = 0;
        const history = historyModel.getLast5(offset); // could be improved to be getLast(offset = 0, quantity = 5)
        offset += 5;
        expect(history.length).toBe(5);
        
        // Check that only the last 5 entries are in the history
        for (let i = 0; i < 5; i++) {
            expect(history[i]).toEqual(testEntries[i + 5]);
        }

        // Check that the history can expand correctly, applying offset
        history.push(...historyModel.getlast5());

        for (let i = 5; i < 10; i++) {
            expect(history[i]).toEqual(testEntries[i + 5]);
        }
    }) 
});