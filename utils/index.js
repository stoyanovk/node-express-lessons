const { body } = require("express-validator");
const User = require("../models/User");

const registerValidators = [
  body("email", "email is not correct")
    .isEmail()
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject("user with such email already exists");
        }
      } catch (e) {
        throw new Error(e);
      }
    }),
  body("name", "name min length must be over 2").isAlpha(),
  body("password", "password min length must be over 5").isLength({ min: 5 }),
  body("confirm", "password must be equal").custom((value, { req }) => {
    if (+value !== +req.body.password) {
      new Error("confirm is not equal password");
      return false;
    }
    return true;
  })
];
module.exports = registerValidators;
