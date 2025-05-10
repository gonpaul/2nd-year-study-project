import express from 'express';
import { registerUser, loginUser, changePassword } from '../controllers/userController.js';

const router = express.Router();

// Регистрация
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const insertedRowId = await registerUser(username, email, password);
  if (insertedRowId) {
    res.status(201).json({ message: 'User successfully registered', userId: insertedRowId });
  } else {
    res.status(400).json({ error: 'A user with this email already exists or an error has occurred' });
  }
});

// Вход
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = await loginUser(email, password);
  if (user) {
    // user is a dict where {userId: Number, username: string}
    res.json({ message: 'Successful entry', user });
  } else {
    res.status(401).json({ error: 'Invalid email or password' });
  }
});

// Смена пароля
router.post('/change-password', async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  if (!email || !currentPassword || !newPassword) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const result = await changePassword(email, currentPassword, newPassword);
  if (result.success) {
    res.json({ message: result.message });
  } else {
    res.status(400).json({ error: result.message });
  }
});

export default router;
