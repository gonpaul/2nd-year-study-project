const UserModel = require('../models/userModel.js');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10; // Количество раундов соли для bcrypt

// Контроллер для регистрации пользователя
const registerUser = async (username, email, password) => {
  // Хешируем пароль перед сохранением
  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
  const insertedUserId = await UserModel.register( username, email, password_hash );
  if (insertedUserId) {
    // const allUsers = UserModel.selectAllUsers();
    // const lastThreeUsers = allUsers.slice(-3);
    // console.log(JSON.stringify(lastThreeUsers, null, 2));
    return insertedUserId;
  }
  return false;
};

// Вход пользователя с хешированием
const loginUser = async (email, password) => {
  const user = await UserModel.login(email);
  if (!user) {
    return false; // Пользователь не найден
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (match) {
    // Можно возвращать user_id или JWT токен
    return { user_id: user.id, username: user.username };
  }
  return false; // Неверный пароль
};

// Обновление пароля с хешированием
const changePassword = async (email, currentPassword, newPassword) => {
  const user = await UserModel.login(email);
  if (!user) {
    return { success: false, message: 'User not found' };
  }

  const match = await bcrypt.compare(currentPassword, user.password_hash);
  if (!match) {
    return { success: false, message: 'Invalid credentials' };
  }

  const result = await UserModel.updatePassword( user.id, await bcrypt.hash(newPassword, 10) );
  if (result) {
    return { success: true, message: 'Password successfully updated' };
  } else {
    return { success: false, message: 'Failed to update password' };
  }
};

module.exports = { registerUser, loginUser, changePassword };