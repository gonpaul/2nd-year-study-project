import express from 'express';
import { registerUser, loginUser, updatePassword } from '../controllers/userController.js';

const router = express.Router();

// Register route
router.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // returns id if success, otherwise false;
  const response = registerUser(username, email, password);
  if (response) {
    res.status(201).json({
        message: 'User registered successfully',
        user: { username, email }
    });
  } else {
    res.status(400).json("Registration failed");
  }
});

// Login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const response = loginUser(email, password);
  if (response) {
    res.status(201).json({
      message: 'Login successful',
      user: { email }
    });
  } else {
    res.status(400).json("Login failed")
  }
});

// Change password route
router.post('/change-password', (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  if (!email || !currentPassword || !newPassword) {
    return res.status(400).json({
      error: 'Email, current password, and new password are required'
    });
  }

  const response = updatePassword(email, currentPassword, newPassword);
  if (response) {
    res.status(201).json({
      message: 'Password changed successfully',
      user: { email }
    });
  } else {
    res.status(400).json("Password change failed");
  }
});

export default router;
