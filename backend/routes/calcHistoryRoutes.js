import express from 'express';
import calcHistoryController from '../controllers/calcHistoryController';

const router = express.Router();

// Import your calculation history controller here
// const calcHistoryController = require('../controllers/calcHistoryController');

// Add calculation to history
router.post('/add', (req, res) => {
  const { userId, operationId, matrixA, matrixB, resultMatrix, scalarValue } = req.body;

  if (!userId || !operationId || !resultMatrixId || !matrixAId || 
    (matrixBId === null && scalarValue === null)) {
    return res.status(400).json({ 
      error: 'User ID, operation ID, result matrix ID, and matrix A ID are required. Either matrix B ID or scalar value must be provided.' 
    });
  }

  res.status(201).json({
    message: 'Calculation added to history successfully',
    // historyId: result.lastInsertRowid
  });
  // add matrixA, matrixB and result matrix, then addCalculation to history
  let resultMatrixId;
  let matrixAId;
  let matrixBId;

  const result = calcHistoryController.addCalculation(userId, operationId, matrixAId, matrixBId, resultMatrixId, scalarValue);
  if (result) {
    res.status(201).json({ 
      message: 'Calculation added to history successfully',
      historyId: result.lastInsertRowid
    });
  } else {
    res.status(400).json({ error: 'Failed to add calculation to history' });
  }
});

// Get calculation history for a user
router.get('/:userId', (req, res) => {
  const { userId } = req.params;

  // Here you would call calcHistoryController.getHistory(req, res)
  res.json({
    history: []
  });
});

export default router;