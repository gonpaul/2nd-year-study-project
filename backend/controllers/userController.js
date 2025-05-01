import UserModel from '../models/userModel.js';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10; // Количество раундов соли для bcrypt

// Контроллер для регистрации пользователя
export const registerUser = async (username, email, password) => {
  // Хешируем пароль перед сохранением
  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
  const insertedRowId = await UserModel.register({ username, email, password_hash });
  if (insertedRowId) {
    const users = await UserModel.selectAllUsers();
    console.log(JSON.stringify(users, null, 2));
    return insertedRowId;
  }
  return false;
};

// Вход пользователя с хешированием
export const loginUser = async (email, password) => {
  const user = await UserModel.login(email);
  if (user) {
    const match = await bcrypt.compare(password, user.password_hash);
    if (match) {
      return { user_id: user.user_id, username: user.username, password_hash: user.password_hash };
    }
  }
  return false;
};

// Обновление пароля с хешированием
export const updatePassword = async (user_id, new_password) => {
  const new_password_hash = await bcrypt.hash(new_password, SALT_ROUNDS);
  const result = await UserModel.updatePassword(user_id, new_password_hash);
  if (result) {
    return 'Password updated';
  }
  return false;
};
