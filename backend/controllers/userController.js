import UserModel from '../models/userModel.js';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10; // Количество раундов соли для bcrypt

// Контроллер для регистрации пользователя
export const registerUser = async (username, email, password) => {
  // Хешируем пароль перед сохранением
  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
  const insertedRowId = await UserModel.register({ username, email, password_hash });
  if (insertedRowId) {
    const allUsers = UserModel.selectAllUsers();
    const lastThreeUsers = allUsers.slice(-3);
    console.log(JSON.stringify(lastThreeUsers, null, 2));
    return insertedRowId;
  }
  return false;
};

// Вход пользователя с хешированием
export const loginUser = async (email, password) => {
  const user = UserModel.login({ email });
  if (!user) {
    return false; // Пользователь не найден
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (match) {
    // Можно возвращать user_id или JWT токен
    return { user_id: user.user_id, username: user.username };
  }
  return false; // Неверный пароль
};

// Обновление пароля с хешированием
export const changePassword = async (email, currentPassword, newPassword) => {
  const user = UserModel.login({ email });
  if (!user) {
    return { success: false, message: 'User not found' };
  }

  const match = await bcrypt.compare(currentPassword, user.password_hash);
  if (!match) {
    return { success: false, message: 'Invalid current password' };
  }

  const result = await UserModel.updatePassword({ user_id: user.user_id, new_password_hash: await bcrypt.hash(newPassword, 10) });
  if (result.success) {
    return { success: true, message: 'Password successfully updated' };
  } else {
    return { success: false, message: 'Failed to update password' };
  }
};
