const requireAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }

  return res.redirect('/login');
};

const redirectIfAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return res.redirect('/');
  }

  return next();
};

module.exports = {
  requireAuth,
  redirectIfAuthenticated,
};
