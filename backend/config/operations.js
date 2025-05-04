// import db from '../config/database.js';

// Объект с операциями
const operations = {
    unary: [
      { name: 'Clear', description: 'Clear the matrix' },
      { name: 'Transpose', description: 'Transpose the matrix' },
      { name: 'Find Rank', description: 'Find the rank of the matrix' },
      { name: 'Find Determinant', description: 'Calculate the determinant' },
      { name: 'Invert', description: 'Invert the matrix' },
      { name: 'Triangular Form', description: 'Transform to triangular form' },
      { name: 'Diagonal Form', description: 'Transform to diagonal form' },
      { name: 'Raise to Power', description: 'Raise the matrix to a power' }
    ],
    binary: [
      { name: 'Multiply', description: 'Multiply two matrices' },
      { name: 'Add', description: 'Add two matrices' },
      { name: 'Subtract', description: 'Subtract two matrices' },
      // { name: 'Add Another Matrix', description: 'Add a third matrix (optional)' }
    ]
  };
  

// Вызов функции при запуске
// updateOperations();

// Экспорт, если нужно
export default operations;