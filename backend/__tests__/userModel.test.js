const UserModel = require("../models/userModel.js");

const resultId = UserModel.register({
    username: 'test_user2',
    email: 'test@example.com',
    password_hash: 'hash456'
  });
  console.log(resultId);
  
// console.log(UserModel.getUserByEmail("testnode@mail.ru"));
// console.log(UserModel.login("goul@mail.ru"));

