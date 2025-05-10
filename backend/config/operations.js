// import db from '../config/database.js';

// Объект с операциями
const operations = {
  unary: [
    { name: 'Transpose', description: 'Transpose the matrix' },
    { name: 'Multiply by scalar', description: 'Multiply the matrix by scalar' },
    { name: 'Calculate Determinant', description: 'Calculate the determinant' },
    { name: 'Raise to Power', description: 'Raise the matrix to a power' },
    { name: 'Calculate Rank', description: 'Find the rank of the matrix' },
    { name: 'Calculate Inverse', description: 'Invert the matrix' },
    // { name: 'Triangular Form', description: 'Transform to triangular form' },
    // { name: 'Diagonal Form', description: 'Transform to diagonal form' },
  ],
  binary: [
    { name: 'Add', description: 'Add two matrices' },
    { name: 'Subtract', description: 'Subtract two matrices' },
    { name: 'Multiply', description: 'Multiply two matrices' },
  ]
};
  

// Вызов функции при запуске
// updateOperations();

// Экспорт, если нужно
export default operations;