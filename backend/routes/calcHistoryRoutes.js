import express from 'express';
const router = express.Router();

// Import your calculation history controller here
// const calcHistoryController = require('../controllers/calcHistoryController');

// Add calculation to history
router.post('/', (req, res) => {
  const { userId, operationId, resultMatrixId, matrixAId, matrixBId, scalarValue, parameters } = req.body;

  if (!userId || !operationId) {
    return res.status(400).json({ error: 'User ID and operation ID are required' });
  }

  // Here you would call calcHistoryController.addCalculation(req, res)
  res.status(201).json({
    message: 'Calculation added to history successfully',
    // historyId: result.lastInsertRowid
  });
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