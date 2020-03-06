const { body } = require("express-validator");
const registerValidators = [
  body("email", "email is not correct").isEmail(),
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
