import express from 'express';
import MatrixController from '../controllers/matrixController.js';

const router = express.Router();

router.get('/:matrixId', (req, res) => {
  const { matrixId } = req.params;
  
  // return an object if true, false otherwise
  const result = MatrixController.getMatrixContentById(matrixId);
  
  // console.log(result);
  if (result) {
    res.json({ matrix: result});
  } else {
    res.status(404).json({ error: 'Matrix record not found' });
  }
})


export default router;