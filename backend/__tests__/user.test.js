import db from "../config/database.js";
import UserModel from "../models/userModel.js";

beforeAll(async () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL
    )`
  );
});

beforeEach(() => {
  db.exec("DELETE FROM users");
});

describe('User Model Tests', () => {
  // Тест успешной регистрации
  test('Successful registration', () => {
    const result = UserModel.register({
      username: 'test_user',
      email: 'test@example.com',
      password_hash: 'hash123'
    });
    
    expect(result.success).toBe(true);
    expect(result.id).toBe(1);
  });

  // Тест дублирования email
  test('Duplicate email registration', () => {
    // Первая регистрация
    UserModel.register({
      username: 'test_user1',
      email: 'test@example.com',
      password_hash: 'hash123'
    });
    // Попытка зарегистрировать другого пользователя с тем же email
    const result = UserModel.register({
      username: 'test_user2',
      email: 'test@example.com',
      password_hash: 'hash456'
    });
    expect(result.success).toBe(false);
    expect(result.error).toMatch('Email already exists');
  });

  // Тест успешного входа
  test('Valid login', () => {
    // Регистрация пользователя
    UserModel.register({
      username: 'test_user',
      email: 'test@example.com',
      password_hash: 'hash123'
    });
    // Вход по email
    const user = UserModel.login('test@example.com');
    expect(user).toEqual({
      user_id: 1,
      username: 'test_user',
      password_hash: 'hash123'
    });
  });

  // Тест входа с неверным email
  test('Invalid email login', () => {
    const user = UserModel.login('wrong@example.com');
    expect(user).toBeUndefined();
  });

  // Тест смены пароля
  test('Password update', () => {
    // Регистрация пользователя
    UserModel.register({
      username: 'test_user',
      email: 'test@example.com',
      password_hash: 'hash123'
    });
    // Обновление пароля
    const updateResult = UserModel.updatePassword(1, 'new_hash');
    expect(updateResult.success).toBe(true);
    // Проверка обновленного пароля
    const user = UserModel.login('test@example.com');
    expect(user.password_hash).toBe('new_hash');
  });
});