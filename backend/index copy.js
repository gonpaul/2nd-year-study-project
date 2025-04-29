import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// register route
// POST is better for registration as it creates a new resource (user)
// Routes for user authentication
app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;
  
  // Basic validation
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  // Here you would typically:
  // 1. Check if user already exists
  // 2. Hash the password
  // 3. Store user in database
  // 4. Generate authentication token
  
  // For now, just return a success message
  res.status(201).json({ 
    message: 'User registered successfully',
    user: { username, email }
  });
});

// Login route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  // Here you would typically:
  // 1. Verify user exists
  // 2. Verify password
  // 3. Generate authentication token
  
  res.json({ 
    message: 'Login successful',
    user: { email }
  });
});

// Change password route
app.post('/api/change-password', (req, res) => {
  const { email, currentPassword, newPassword } = req.body;
  
  // Basic validation
  if (!email || !currentPassword || !newPassword) {
    return res.status(400).json({ 
      error: 'Email, current password, and new password are required' 
    });
  }
  
  // Here you would typically:
  // 1. Verify user exists
  // 2. Verify current password
  // 3. Hash the new password
  // 4. Update password in database
  
  res.json({ 
    message: 'Password changed successfully',
    user: { email }
  });
});

// Add calculation to history route
app.post('/api/calculation-history', (req, res) => {
  const { userId, operationId, resultMatrixId, matrixAId, matrixBId, scalarValue, parameters } = req.body;
  
  // Basic validation
  if (!userId || !operationId) {
    return res.status(400).json({ error: 'User ID and operation ID are required' });
  }
  
  try {
    // Insert the calculation history record into the database
    const stmt = db.prepare(`
      INSERT INTO calculationHistory 
      (user_id, operation_id, result_matrix_id, matrix_a_id, matrix_b_id, scalar_value, parameters)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      userId, 
      operationId, 
      resultMatrixId || null, 
      matrixAId || null, 
      matrixBId || null, 
      scalarValue || null, 
      parameters || null
    );
    
    res.status(201).json({
      message: 'Calculation added to history successfully',
      historyId: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Error adding calculation to history:', error);
    res.status(500).json({ error: 'Failed to add calculation to history' });
  }
});

// Get calculation history route
app.get('/api/calculation-history/:userId', (req, res) => {
  const { userId } = req.params;
  
  try {
    const stmt = db.prepare(`
      SELECT ch.*, o.operation_name, o.description
      FROM calculationHistory ch
      JOIN operations o ON ch.operation_id = o.operation_id
      WHERE ch.user_id = ?
      ORDER BY ch.timestamp DESC
    `);
    
    const history = stmt.all(userId);
    
    res.json({ history });
  } catch (error) {
    console.error('Error retrieving calculation history:', error);
    res.status(500).json({ error: 'Failed to retrieve calculation history' });
  }
});


