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
}

module.exports = MatrixView;