const db = require("../config/database.js");

const UserModel = {
  /**
   * Register a new user
   * @param {string} username - The username for the new user
   * @param {string} email - The email for the new user
   * @param {string} password_hash - The hashed password for the new user
   * @returns {Promise<number>} - A promise that resolves to the ID of the newly registered user
   */
  register: async (username, email, password_hash) => {
    try {
      console.log('Method: register in userModel');
      await db.insert({username, email, password_hash}).into('users');
      // returns id as [ 1 ] in sqlite, and an object with metadata in postgres
      const id = (await db('users')).at('-1').id;
      console.log('Result: ', id);
      return id;
    } catch (error) {
      console.error('Error registering user in userModel:', error);
      throw error; // Rethrow the error for handling elsewhere
    }
  },

  /**
   * Find a user by email for login
   * @param {string} email - The email to search for
   * @returns {Promise<Object|undefined>} - A promise that resolves to the user object or undefined if not found
   */
  login: async ( email ) => {
    try {
      console.log('Method: login in userModel');
      const user = await db('users').where('email', email).first();
      console.log('Result: ', user); // returns an object with user data
      return user;
    } catch (error) {
      console.error('Error logging in user in userModel:', error);
      throw error; // Rethrow the error for handling elsewhere
    }
  },

  /**
   * Update a user's password
   * @param {number} user_id - The ID of the user
   * @param {string} new_password_hash - The new hashed password
   * @returns {Promise<boolean>} - A promise that resolves to true if the password was updated successfully
   */
  updatePassword: async ( user_id, new_password_hash ) => {
    try {
      console.log('Method: updatePassword in userModel');
      const isUpdated = await db('users').where('id', user_id).update({password_hash: new_password_hash});
      console.log('Result: ', isUpdated); // returns a boolean
      return isUpdated;
    } catch (error) {
      console.error('Error updating password in userModel:', error);
      throw error; // Rethrow the error for handling elsewhere
    }
  },

  /**
   * Get all users in the system
   * @returns {Promise<Array>} - A promise that resolves to an array of all user objects
   */
  selectAllUsers: async () => {
    try {
      console.log('Method: selectAllUsers in userModel');
      const users = await db.select('*').from('users');
      console.log('Result: ', users); // returns an array of objects with user data
      return users;
    } catch (error) {
      console.error('Error selecting all users in userModel:', error);
      throw error; // Rethrow the error for handling elsewhere
    }
  },

  /**
   * Find a user by their email address
   * @param {string} email - The email to search for
   * @returns {Promise<Object|undefined>} - A promise that resolves to the user object or undefined if not found
   */
  getUserByEmail: async (email) => {
    try {
      console.log('Method: getUserByEmail in userModel');
      const user = await db('users').where('email', email).first();
      console.log('Result: ', user); // returns an object with user data
      return user;
    } catch (error) {
      console.error('Error getting user by email in userModel:', error);
      throw error; // Rethrow the error for handling elsewhere
    }
  },

  /**
   * Delete a user by their ID
   * @param {number} userId - The ID of the user to delete
   * @returns {Promise<boolean>} - A promise that resolves to true if user was deleted successfully
   */
  deleteUser: async (userId) => {
    try {
      console.log('Method: deleteUser in userModel');
      const isDeleted = await db('users').where('id', userId).delete();
      console.log('Result: ', isDeleted); // returns a boolean
      return isDeleted;
    } catch (error) {
      console.error('Error deleting user in userModel:', error);
      throw error; // Rethrow the error for handling elsewhere
    }
  },
};

module.exports = UserModel;