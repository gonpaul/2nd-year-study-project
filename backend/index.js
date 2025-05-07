// import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { db } from './config/databaseNew.js';
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

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// Use routers
app.use('/api/users', userRoutes);
app.use('/api/calculation-history', calcHistoryRoutes);

// Initialize database and start server
const startServer = async () => {
  try {
    db.connect();
    await db.initDatabase();
    const isInitialized = await db.checkDatabase();
    if (!isInitialized) {
      throw new Error('Database initialization failed');
    }
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
