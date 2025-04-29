import UserModel from '../models/user.js';

// Контроллер для регистрации пользователя
export const registerUser = (username, email, password) => {

  // В реальности нужно хешировать пароль
  const password_hash = password; // Для демонстрации

  const result = UserModel.register({ username, email, password_hash });

  if (result.success) {
    res.status(201).json({ message: 'User registered', userId: result.id });
  } else {
    if (result.error === 'Email already exists') {
      res.status(400).json({ error: result.error });
    } else {
      res.status(500).json({ error: 'Registration failed' });
    }
  }
};

// Контроллер для входа пользователя
export const loginUser = (req, res) => {
  const { email, password } = req.body;

  const user = UserModel.login(email);
  if (user && user.password_hash === password) {
    // В реальности тут нужно проверить хеш пароля
    res.json({ user_id: user.user_id, username: user.username, password_hash: user.password_hash });
  } else {
    res.status(401).json({ error: 'Invalid email or password' });
  }
};

// Контроллер для обновления пароля
export const updatePassword = (req, res) => {
  const { user_id, new_password } = req.body;

  // В реальности нужно хешировать новый пароль
  const new_password_hash = new_password;

  const result = UserModel.updatePassword(user_id, new_password_hash);
  if (result.success) {
    res.json({ message: 'Password updated' });
  } else {
    res.status(400).json({ error: 'Password update failed' });
  }
};