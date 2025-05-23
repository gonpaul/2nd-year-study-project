const express = require('express');
const calcHistoryController = require('../controllers/calcHistoryController.js');
const { convertMatricesToIds } = require('../utils/matrixConverter.js');

const router = express.Router();

// Import your calculation history controller here
// const calcHistoryController = require('../controllers/calcHistoryController');

// Add calculation to history
router.post('/add', async (req, res) => {
  const { userId, operationId, matrixA, matrixB, resultMatrix, scalarValue } = req.body;

  // Basic validation
  if (!userId || !operationId || !resultMatrix || !matrixA) {
    return res.status(400).json({ 
      error: 'User ID, operation ID, result matrix, and matrix A are required.' 
    });
  }

  try {
    // Convert matrices to database entries and get their IDs
    const { matrixAId, matrixBId, resultMatrixId } = await convertMatricesToIds(
      userId,
      matrixA,
      matrixB,
      resultMatrix
    );
    
    // Add calculation to history
    const result = await calcHistoryController.addCalculation(
      userId, 
      operationId, 
      matrixAId, 
      matrixBId, 
      resultMatrixId, 
      scalarValue
    );
    
    if (result.success) {
      res.status(201).json({ 
        message: 'Calculation added to history successfully',
        historyId: result.historyId
      });
    } else {
      res.status(400).json({ error: result.error || 'Failed to add calculation to history' });
    }
  } catch (error) {
    console.error('Error adding calculation:', error);
    res.status(500).json({ error: 'An error occurred while processing the calculation' });
  }
});

// Get calculation history for a user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  const { limit } = req.query;

  const result = await calcHistoryController.getHistoryByUserId(userId, limit ? parseInt(limit) : undefined);
  
  if (result.success) {
    res.json({ history: result.history });
  } else {
    res.status(500).json({ error: result.error || 'Failed to retrieve calculation history' });
  }
});

// Get specific calculation history record
router.get('/record/:historyId', async (req, res) => {
  const { historyId } = req.params;
  
  const result = await calcHistoryController.getHistoryById(historyId);
  
  if (result.success) {
    res.json({ history: result.history });
  } else {
    res.status(404).json({ error: result.error || 'History record not found' });
  }
});

// Delete a calculation history record
router.delete('/record/:historyId', async (req, res) => {
  const { historyId } = req.params;
  
  const result = await calcHistoryController.deleteHistory(historyId);
  
  if (result.success) {
    res.json({ message: 'History record deleted successfully' });
  } else {
    res.status(404).json({ error: result.error || 'Failed to delete history record' });
  }
});

// Clear all calculation history for a user
router.delete('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  
  const result = await calcHistoryController.clearUserHistory(userId);
  
  if (result.success) {
    res.json({ message: 'User history cleared successfully' });
  } else {
    res.status(400).json({ error: result.error || 'Failed to clear user history' });
  }
});

module.exports = router;