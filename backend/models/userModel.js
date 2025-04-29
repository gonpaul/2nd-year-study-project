import db from "../config/database.js";

const UserModel = {
  register: ({ username, email, password_hash }) => {
    try {
      const stmt = db.prepare(`
        INSERT INTO users (username, email, password_hash) 
        VALUES (?, ?, ?)
      `);
      const result = stmt.run(username, email, password_hash);
      return { 
        id: result.lastInsertRowid,
        success: true 
      };
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        return { error: 'Email already exists', success: false };
      }
      return { error: 'Registration failed', success: false };
    }
  },

  login: (email) => {
    const stmt = db.prepare(`
      SELECT user_id, username, password_hash 
      FROM users 
      WHERE email = ?
    `);
    return stmt.get(email);
  },

  updatePassword: (user_id, new_password_hash) => {
    const stmt = db.prepare(`
      UPDATE users 
      SET password_hash = ? 
      WHERE user_id = ?
    `);
    const result = stmt.run(new_password_hash, user_id);
    return {
      changes: result.changes,
      success: result.changes > 0
    };
  }
};

export default UserModel;