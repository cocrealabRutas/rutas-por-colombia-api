const express = require('express');
const boom = require('boom');
const _ = require('lodash');
const asyncMiddleware = require('../middleware/async');
const { User } = require('../models/user');
const { authenticate } = require('../middleware/authenticate');

const router = express.Router();

// POST /users
router.post(
  '/',
  asyncMiddleware(async (req, res, next) => {
    try {
      const body = _.pick(req.body, ['email', 'password']);
      const user = new User(body);
      await user.save();
      const token = await user.generateAuthToken();
      return res.header('x-auth', token).send(user);
    } catch (e) {
      return next(boom.badImplementation(e));
    }
  }),
);

router.get('/me', authenticate, (req, res) => {
  res.send(req.user);
});

router.post(
  '/login',
  asyncMiddleware(async (req, res, next) => {
    try {
      const body = _.pick(req.body, ['email', 'password']);
      const user = await User.findByCredentials(body.email, body.password);
      const token = await user.generateAuthToken();
      return res.header('x-auth', token).send(user);
    } catch (e) {
      return next(boom.badImplementation());
    }
  }),
);

router.delete(
  '/me/token',
  authenticate,
  asyncMiddleware(async (req, res, next) => {
    try {
      await req.user.removeToken(req.token);
      return res.status(200).send();
    } catch (e) {
      return next(boom.badImplementation());
    }
  }),
);

module.exports = router;
