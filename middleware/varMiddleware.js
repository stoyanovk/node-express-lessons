module.exports = function(req, res, next) {
  res.locals.isAuth = req.session.approved;
  res.locals.csurf = req.csrfToken()
  next();
};
