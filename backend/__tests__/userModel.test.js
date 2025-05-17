const UserModel = require("../models/userModel.js");
// require('dotenv').config();

// Wrap test code in an async test function
describe('User Model Tests', () => {
  // Reference to hold the database connection
  let db;

  // Set up database before all tests
  beforeAll(async () => {
    // Get the database connection - this awaits initialization
    db = await require('../config/database.js');
  });

  afterAll(async () => {
    // Close database connection
    if (db) {
      await db.destroy();
    }
    // Add a small delay to ensure connections are closed
    await new Promise(resolve => setTimeout(resolve, 500));
  });

  test('should register, login and delete a user', async () => {
    await UserModel.register(
      'test_user2',
      'test@example.com',
      'hash456'
    );

    await UserModel.login(
      'test@example.com',
      'hash456'
    );

    await UserModel.deleteUser((await UserModel.getUserByEmail("test@example.com")).id);
  });
});

  // console.log(resultId);
  
// console.log(UserModel.getUserByEmail("testnode@mail.ru"));
// console.log(UserModel.login("goul@mail.ru"));

