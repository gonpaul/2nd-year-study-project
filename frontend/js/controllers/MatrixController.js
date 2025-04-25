export class MatrixController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        
        // Binding model events
        this.model.bindMatrixChanged(this.onMatrixChanged.bind(this));
        this.model.bindHistoryChanged(this.onHistoryChanged.bind(this));
        
        // Binding view events
        this.view.bindMatrixInputChanged(this.handleMatrixInputChanged.bind(this));
        this.view.bindClearMatrix(this.handleClearMatrix.bind(this));
        this.view.bindTransposeMatrix(this.handleTransposeMatrix.bind(this));
        this.view.bindMultiplyByScalar(this.handleMultiplyByScalar.bind(this));
        this.view.bindCalculateDeterminant(this.handleCalculateDeterminant.bind(this));
        this.view.bindRaiseToPower(this.handleRaiseToPower.bind(this));
        this.view.bindCalculateRank(this.handleCalculateRank.bind(this));
        this.view.bindCalculateInverse(this.handleCalculateInverse.bind(this));
        this.view.bindSwapMatrices(this.handleSwapMatrices.bind(this));
        this.view.bindAddMatrices(this.handleAddMatrices.bind(this));
        this.view.bindSubtractMatrices(this.handleSubtractMatrices.bind(this));
        this.view.bindMultiplyMatrices(this.handleMultiplyMatrices.bind(this));
        
        // Initialize view
        this.view.initializeMatrixInputs();
        this.view.displayMatrices(this.model.matrixA, this.model.matrixB);
    }
    
    // Model event handlers
    onMatrixChanged(matrixA, matrixB) {
        this.view.displayMatrices(matrixA, matrixB);
    }
    
    onHistoryChanged(history) {
        this.view.displayHistory(history);
    }
    
    // View event handlers
    handleMatrixInputChanged(matrixName, row, col, value) {
        this.model.updateMatrix(matrixName, row, col, value);
    }
    
    handleClearMatrix(matrixName) {
        this.model.clearMatrix(matrixName);
    }
    
    handleTransposeMatrix(matrixName) {
        this.model.transpose(matrixName);
    }
    
    handleMultiplyByScalar(matrixName, scalar) {
        this.model.multiplyByScalar(matrixName, scalar);
    }
    
    handleCalculateDeterminant(matrixName) {
        this.model.calculateDeterminant(matrixName);
    }
    
    handleRaiseToPower(matrixName, power) {
        this.model.raiseTopower(matrixName, power);
    }
    
    handleCalculateRank(matrixName) {
        this.model.calculateRank(matrixName);
    }
    
    handleCalculateInverse(matrixName) {
        this.model.inverseMatrix(matrixName);
    }
    
    handleSwapMatrices() {
        this.model.swapMatrices();
    }
    
    handleAddMatrices() {
        this.model.addMatrices();
    }
    
    handleSubtractMatrices() {
        this.model.subtractMatrices();
    }
    
    handleMultiplyMatrices() {
        this.model.multiplyMatricesAB();
    }
} 