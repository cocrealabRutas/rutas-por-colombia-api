const boom = require('boom');
const { User } = require('./../models/user');

const authenticate = (req, res, next) => {
  const token = req.header('x-auth');
  if (!token) next(boom.unauthorized('x-auth header is missing'));
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

module.exports = { authenticate };
