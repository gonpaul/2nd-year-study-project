const { OperationEnums } = require("../../reference/operations.js")

class MatrixView {
    constructor() {
        this.matrixAContainer = document.getElementById('matrix-a');
        this.matrixBContainer = document.getElementById('matrix-b');
    }

    updateMatrixDisplay(matrixId, size, data) {
        const container = matrixId === 'A'
            ? this.matrixAContainer
            : this.matrixBContainer;

        container.innerHTML = this.generateMatrixHTML(size, data);
    }

    updateHistory(historyData) {
        const historyContainer = document.getElementById('history-container');
        historyContainer.innerHTML = historyData
            .map(entry => this._formatHistoryEntry(entry))
            .join('');
    }

    generateMatrixHTML(size, data) {
        return Array.from({ length: size }, (_, row) => `
            <div class="matrix-row">
                ${Array.from({ length: size }, (_, col) => {
            const value = data[row][col];
            return `
                        <input type="number" 
                               class="matrix-cell"
                               ${value !== 0 ? `value="${value}"` : ''}
                               placeholder="0"
                               onfocus = "this.placeholder = ''"
                               onblur="this.placeholder='0'"
                               data-row="${row}"
                               data-col="${col}">
                    `;
        }).join('')}
            </div>
        `).join('');
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        document.body.prepend(errorDiv);
        setTimeout(() => errorDiv.remove(), 3000);
    }

    displayHistoryEntry(entryData) {
        const historyContainer = document.getElementById('history-container');
        const entryElement = document.createElement('div');
        entryElement.className = 'history-entry';
        entryElement.innerHTML = this._formatHistoryEntry(entryData);
        historyContainer.prepend(entryElement);
    }

    _formatHistoryEntry(entry) {
        const { operation, matrices, result, scalarValue } = entry;
        const operators = {
            [OperationEnums.ADD]: '+',
            [OperationEnums.SUBTRACT]: '-',
            [OperationEnums.MULTIPLY]: '*',
            [OperationEnums.TRANSPOSE]: 'trans',
            [OperationEnums.MULTIPLYBYSCALAR]: 'mulBy',
            [OperationEnums.CALCULATEDETERMINANT]: 'det',
            [OperationEnums.CALCULATEINVERSE]: 'inv',
            [OperationEnums.CALCULATERANK]: 'rank',
            [OperationEnums.RAISETOPOWER]: '^',
        };

        return `
            <div class="history-entry-row">
                ${this._formatOperands(matrices, operation, operators, scalarValue)}
                <span class="history-equals">=</span>
                ${this._matrixToString(result)}
            </div>
        `;
    }

    _formatOperands(matrices, operation, operators, scalar = null) {
        const operator = operators[operation];

        // Обработка специальных случаев
        switch (operation) {
            // case 'scalar':
            case OperationEnums.MULTIPLYBYSCALAR:
                return `
                    ${this._matrixToString(matrices[0])}
                    <span class="history-operator">${operator} ${scalar}</span>
                `;

            // case 'power':
            case OperationEnums.RAISETOPOWER:
                return `
                    ${this._matrixToString(matrices[0])}
                    <span class="history-operator">${operator}${scalar}</span>
                `;

            // case 'determinant':
            case OperationEnums.CALCULATEDETERMINANT:
            // case 'rank':
            case OperationEnums.CALCULATERANK:
            // case 'inverse':
            case OperationEnums.CALCULATEINVERSE:
            // case 'transpose':
            case OperationEnums.TRANSPOSE:
                return `
                    <span class="history-operator">${operator}</span>
                    ${this._matrixToString(matrices[0])}
                `;

            // binary opps
            default:
                return matrices.map((m, i) => `
                    ${i > 0 ? `<span class="history-operator">${operator}</span>` : ''}
                    ${this._matrixToString(m)}
                `).join('');
        }
    }

    _matrixToString(matrix) {
        if (!matrix || matrix.length === 0) return '';
        if (matrix[0].length === 1) return matrix[0][0].toFixed(2);

        return `<div class="history-matrix">${matrix.map(row => `[ ${row.map(num => Number(num.toFixed(2))).join('  ')} ]`).join('<br>')}</div>`;
    }
}

module.exports = MatrixView;