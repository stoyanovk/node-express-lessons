module.exports = function(req, res, next) {
  if (!req.session.approved) {
    return res.redirect("/auth");
  }
  next();
};
