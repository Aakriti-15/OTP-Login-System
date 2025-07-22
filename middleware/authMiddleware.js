module.exports = function requireLogin(req, res, next) {
  if (!req.session.userEmail) {
    return res.redirect('/login?message=login_required');
  }
  next();
};
