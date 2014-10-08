// Util functions for checking auth

exports.loggedIn = function (req, res, next) {
  if (req.isAuthenticated()) return next()
  res.status(401).send('Unauthorized');
}