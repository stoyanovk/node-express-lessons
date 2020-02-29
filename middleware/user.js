const User = require("../models/User");

module.exports = async function(req, res, next) {
  if (!req.session.user) {
    return next();
  }
  const user = await User.findById(req.session.user._id);
  req.session.user = user;
  next();
};
