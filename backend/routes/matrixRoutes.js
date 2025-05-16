const express = require("express");
const MatrixController = require("../controllers/matrixController.js");

const router = express.Router();

router.get('/:matrixId', async (req, res) => {
  const { matrixId } = req.params;
  
  // return an object if true, false otherwise
  const result = await MatrixController.getMatrixContentById(matrixId);
  
  // console.log(result);
  if (result) {
    res.json({ matrix: result});
  } else {
    res.status(404).json({ error: 'Matrix record not found' });
  }
})

module.exports = router;