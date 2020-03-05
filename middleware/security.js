const Course = require("../models/Course");
module.exports = async function(req, res, next) {
  const id = req.params.id || req.body.id;
  const course = await Course.findById(id);
  const currentUserID = req.session.user && req.session.user._id.toString();
  const ownerId = course.userId.toString();
  if (currentUserID === ownerId) {
    req.course = course;
    return next();
  }
  return res.redirect("/courses");
};
