import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
// Import routers
import userRoutes from './routes/userRoutes.js';
import calcHistoryRoutes from './routes/calcHistoryRoutes.js';


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

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
