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

    generateMatrixHTML(size, data) {
        return Array.from({ length: size }, (_, row) => `
            <div class="matrix-row">
                ${Array.from({ length: size }, (_, col) => `
                    <input type="number" 
                           class="matrix-cell" 
                           value="${data[row][col] || 0}"
                           data-row="${row}"
                           data-col="${col}">
                `).join('')}
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

    _formatHistoryEntry({ operation, matrices, result }) {
        const operators = {
            add: '+',
            subtract: '-',
            multiply: '*',
            transpose: 'trans',
            scalar: 'mulBy',
            determinant: 'det',
            inverse: 'inv',
            rank: 'rank',
            power: '^',
        };

        return `
            <div class="history-entry-row">
                ${this._formatOperands(matrices, operation, operators)}
                <span class="history-equals">=</span>
                ${this._matrixToString(result)}
            </div>
        `;
    }

    _formatOperands(matrices, operation, operators) {
        const operator = operators[operation];

        // Обработка специальных случаев
        switch (operation) {
            case 'scalar':
                return `
                    ${this._matrixToString(matrices[0])}
                    <span class="history-operator">${operator} ${matrices[1][0][0]}</span>
                `;

            case 'power':
                return `
                    ${this._matrixToString(matrices[0])}
                    <span class="history-operator">${operator}${matrices[1][0][0]}</span>
                `;

            case 'determinant':
            case 'rank':
            case 'inverse':
            case 'transpose':
                return `
                    <span class="history-operator">${operator}</span>
                    ${this._matrixToString(matrices[0])}
                `;

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
    
    return `
        <div class="history-matrix">
            ${matrix.map(row => `
                [ ${row.map(num => Number(num.toFixed(2))).join('  ')} ]
            `).join('<br>')}
        </div>
    `;
}
}

module.exports = MatrixView;