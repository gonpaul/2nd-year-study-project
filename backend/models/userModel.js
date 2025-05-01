import db from "../config/database.js";

const UserModel = {
  register: ({ username, email, password_hash }) => {
      const stmt = db.prepare(`
        INSERT INTO users (username, email, password_hash) 
        VALUES (?, ?, ?)
      `);
      const result = stmt.run(username, email, password_hash);
      // EXAMPLE:  { changes: 1, lastInsertRowid: 15 }
      return result.lastInsertRowid;
  },

  login: ({ email }) => {
      const stmt = db.prepare(`
        SELECT user_id, username, password_hash 
        FROM users 
        WHERE email = ?
      `);
      const user = stmt.get(email);
      return user;
  },

  updatePassword: ({ user_id, new_password_hash }) => {
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
  },

  selectAllUsers: () => {
    const stmt = db.prepare(`
        SELECT * FROM users
      `);
    const users = stmt.all();
    return users;
  },

  getUserByEmail: (email) => {
    const result = db.prepare(`
      SELECT * FROM users WHERE email = ?
    `).get(email)
    // console.log(result);
    return result;
  }
};

export default UserModel;