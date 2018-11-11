const express = require('express');
const boom = require('boom');
const _ = require('lodash');
const Joi = require('joi');
const asyncMiddleware = require('../middleware/async');
const { User } = require('../models/user');
const {
  authenticate,
  authenticateAdmin,
} = require('../middleware/authenticate');

const router = express.Router();

router.post(
  '/',
  asyncMiddleware(async (req, res, next) => {
    try {
      const body = _.pick(req.body, ['name', 'email', 'password']);
      const schema = Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
      });
      const { error } = Joi.validate(body, schema);
      if (error) return next(boom.badRequest(error.details[0].message));
      const user = new User(body);
      await user.save();
      const token = await user.generateAuthToken();
      return res.send({ user, token });
    } catch (e) {
      return next(boom.badRequest(e));
    }
  }),
);

router.post(
  '/admin',
  authenticateAdmin,
  asyncMiddleware(async (req, res, next) => {
    try {
      const body = _.pick(req.body, ['name', 'email', 'password']);
      const schema = Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
      });
      const { error } = Joi.validate(body, schema);
      if (error) return next(boom.badRequest(error.details[0].message));
      const user = new User({ ...body, role: 0 });
      await user.save();
      const token = await user.generateAuthToken();
      return res.send({ user, token });
    } catch (e) {
      return next(boom.badRequest(e));
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
      const schema = Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required(),
      });
      const { error } = Joi.validate(body, schema);
      if (error) return next(boom.badRequest(error.details[0].message));
      const user = await User.findByCredentials(body.email, body.password);
      const token = await user.generateAuthToken();
      return res.send({ user, token });
    } catch (e) {
      return next(boom.badRequest());
    }
  }),
);

router.post(
  '/login/admin',
  asyncMiddleware(async (req, res, next) => {
    try {
      const body = _.pick(req.body, ['email', 'password']);
      const schema = Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required(),
      });
      const { error } = Joi.validate(body, schema);
      if (error) return next(boom.badRequest(error.details[0].message));
      const user = await User.findByCredentials(body.email, body.password);
      if (user.role !== 0) {
        return next(
          boom.unauthorized(
            'Not authorized to perform this action, only admin user have access',
          ),
        );
      }
      const token = await user.generateAuthToken();
      return res.send({ user, token });
    } catch (e) {
      return next(boom.badRequest());
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
      return next(boom.badRequest());
    }
  }),
);

module.exports = router;
