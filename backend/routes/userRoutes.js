import express from 'express';
import { registerUser, loginUser, updatePassword } from '../controllers/userController.js';

const router = express.Router();

// Register route
router.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

// registerUser(username, email, password);
  res.status(201).json({
    message: 'User registered successfully',
    user: { username, email }
  });
});

// Login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Here you would call userController.loginUser(req, res)
  res.json({
    message: 'Login successful',
    user: { email }
  });
});

// Change password route
router.post('/change-password', (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  if (!email || !currentPassword || !newPassword) {
    return res.status(400).json({
      error: 'Email, current password, and new password are required'
    });
  }

  // Here you would call userController.changePassword(req, res)
  res.json({
    message: 'Password changed successfully',
    user: { email }
  });
});

export default router;
