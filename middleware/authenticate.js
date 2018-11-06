const boom = require('boom');
const { User } = require('./../models/user');

const getToken = req => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    // Authorization: Bearer g1jipjgi1ifjioj
    // Handle token presented as a Bearer token in the Authorization header
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

const authenticate = (req, res, next) => {
  const token = getToken(req);
  if (!token) next(boom.unauthorized('Access Token missing from header'));
  return User.findByToken(token)
    .then(user => {
      if (!user) {
        return Promise.reject();
      }

      req.user = user;
      req.token = token;
      return next();
    })
    .catch(() =>
      next(boom.unauthorized('Not authorized to perform this action')),
    );
};

const authenticateAdmin = (req, res, next) => {
  const token = getToken(req);
  if (!token) next(boom.unauthorized('Access Token missing from header'));
  return User.findByToken(token)
    .then(user => {
      if (!user) {
        return Promise.reject();
      }
      if (user.role !== 0) {
        return Promise.reject();
      }
      req.user = user;
      req.token = token;
      return next();
    })
    .catch(() =>
      next(boom.unauthorized('Not authorized to perform this action')),
    );
};

module.exports = { authenticate, authenticateAdmin };
