/**
 * This file stores matrix operations in the same format as they are stored in the database.
 * It provides a consistent reference for operation IDs and names, making it easier to work
 * with network requests and ensure data consistency between frontend and backend.
 * 
 * Operations are categorized as either unary (operating on a single matrix) or binary
 * (operating on two matrices), and each has a unique ID that corresponds to its database entry.
 * 
 * The OperationsTable object provides a convenient way to reference operation IDs by name,
 * which simplifies the process of creating and handling API requests.
 */


const operations = [
    { id: 1, name: 'transpose', isBinary: false },
    { id: 2, name: 'multiplyByScalar', isBinary: false },
    { id: 3, name: 'calculateDeterminant', isBinary: false },
    { id: 4, name: 'raiseToPower', isBinary: false },
    { id: 5, name: 'calculateRank', isBinary: false },
    { id: 6, name: 'calculateInverse', isBinary: false },
    { id: 7, name: 'add', isBinary: true },
    { id: 8, name: 'subtract', isBinary: true },
    { id: 9, name: 'multiply', isBinary: true }
];

const operationsObject = {
    unary: {
        transpose: 1,
        multiplyByScalar: 2,
        calculateDeterminant: 3,
        raiseToPower: 4,
        calculateRank: 5,
        calculateInverse: 6
    },
    binary: {
        add: 7,
        subtract: 8,
        multiply: 9
    },
}

const OperationEnums = Object.freeze({
    ADD: 'add',
    SUBTRACT: 'subtract',
    MULTIPLY: 'multiply',
    TRANSPOSE: 'transpose',
    MULTIPLYBYSCALAR: 'multiplyByScalar',
    CALCULATEDETERMINANT: 'calculateDeterminant',
    RAISETOPOWER: 'raiseToPower',
    CALCULATERANK: 'calculateRank',
    CALCULATEINVERSE: 'calculateInverse'
});

const OperationToId= {
    transpose: 1,
    multiplyByScalar: 2,
    calculateDeterminant: 3,
    raiseToPower: 4,
    calculateRank: 5,
    calculateInverse: 6,
    add: 7,
    subtract: 8,
    multiply: 9
}

function getOperationById(id) {
    return operations.find(operation => operation.id === id);
}

module.exports = {
    getOperationById,
    operations,
    OperationEnums,
    OperationToId
}