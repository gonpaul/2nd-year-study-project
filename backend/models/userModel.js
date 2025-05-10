import db from "../config/database.js";

const UserModel = {
  register: async ({ username, email, password_hash }) => {
      const result = await db.query(`
        INSERT INTO users (username, email, password_hash) 
        VALUES (?, ?, ?)
      `, [username, email, password_hash]);
      console.log(result);
      // EXAMPLE:  { changes: 1, lastInsertRowid: 15 }
      return result.lastInsertRowid;
  },

  login: async ({ email }) => {
      // const stmt = db.prepare(`
      //   SELECT user_id, username, password_hash 
      //   FROM users 
      //   WHERE email = ?
      // `);
      // const user = stmt.get(email);
      const user = await db.query(`
        SELECT user_id, username, password_hash 
        FROM users 
        WHERE email = ?
      `, [email]);

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

  selectAllUsers: async () => {
    // const stmt = db.prepare(`
    //     SELECT * FROM users
    //   `);
    // const users = stmt.all();
    const users = await db.query('SELECT * FROM users');
    return users;
  },

  getUserByEmail: (email) => {
    const result = db.prepare(`
      SELECT * FROM users WHERE email = ?
    `).get(email)
    // console.log(result);
    return result;
  },

  /**
   * Delete a user by their ID
   * @param {number} userId - The ID of the user to delete
   * @returns {boolean} - True if user was deleted successfully, false otherwise
   */
  deleteUser: (userId) => {
    const stmt = db.prepare(`
      DELETE FROM users
      WHERE user_id = ?
    `);
    const result = stmt.run(userId);
    return result.changes > 0;
  },
};

export default UserModel;