const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
// Import routers
const userRoutes = require('./routes/userRoutes.js');
const calcHistoryRoutes = require('./routes/calcHistoryRoutes.js');
const matrixRoutes = require("./routes/matrixRoutes.js");


// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Use routers
// localhost:8080/api/users 
app.use('/api/users', userRoutes);
app.use('/api/calculation-history', calcHistoryRoutes);
app.use('/api/matrices', matrixRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
