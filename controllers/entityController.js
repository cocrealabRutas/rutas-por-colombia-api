const express = require('express');
const httpStatus = require('http-status');
const boom = require('boom');
const asyncMiddleware = require('../middleware/async');
const { authenticateAdmin } = require('../middleware/authenticate');
const entities = require('../models/entities');

const router = express.Router();

router.get(
  '/',
  asyncMiddleware(async (req, res) => {
    const data = Object.keys(entities);
    res.status(httpStatus.OK).json(data);
  }),
);

router.get(
  '/:entity',
  asyncMiddleware(async (req, res, next) => {
    const { entity } = req.params;
    if (!entities[entity])
      return next(boom.badRequest(`${entity} is not a valid entity`));

    const result = await entities[entity].Schema.find({});

    return res.status(httpStatus.OK).json(result);
  }),
);

router.post(
  '/:entity',
  authenticateAdmin,
  asyncMiddleware(async (req, res, next) => {
    const { entity } = req.params;
    if (!entities[entity])
      return next(boom.badRequest(`${entity} is not a valid entity`));

    const { error } = entities[entity].validate(req.body);
    if (error) return next(boom.badRequest(error.details[0].message));

    try {
      const newEntity = new entities[entity].Schema(req.body);
      await newEntity.save();
      return res.status(httpStatus.OK).json(newEntity);
    } catch (e) {
      return next(boom.badImplementation(e));
    }
  }),
);

router.get(
  '/:entity/:id',
  asyncMiddleware(async (req, res, next) => {
    const { entity, id } = req.params;
    if (!entities[entity])
      return next(boom.badRequest(`${entity} is not a valid entity`));

    try {
      const result = await entities[entity].Schema.findById(id);

      if (result) {
        return res.status(httpStatus.OK).json(result);
      }
      return next(boom.notFound());
    } catch (e) {
      return next(boom.notFound());
    }
  }),
);

router.delete(
  '/:entity/:id',
  authenticateAdmin,
  asyncMiddleware(async (req, res, next) => {
    const { entity, id } = req.params;
    if (!entities[entity])
      return next(boom.badRequest(`${entity} is not a valid entity`));

    try {
      const Entity = entities[entity].Schema;
      const result = await Entity.findByIdAndDelete(id);
      if (result) {
        return res.status(httpStatus.OK).json(result);
      }
      return next(boom.notFound());
    } catch (e) {
      return next(boom.notFound());
    }
  }),
);

router.put(
  '/:entity/:id',
  authenticateAdmin,
  asyncMiddleware(async (req, res, next) => {
    const { entity, id } = req.params;
    if (!entities[entity])
      return next(boom.badRequest(`${entity} is not a valid entity`));

    try {
      const Entity = entities[entity].Schema;
      const result = await Entity.findByIdAndUpdate(id, { ...req.body });
      if (result) {
        return res.status(httpStatus.OK).send();
      }
      return next(boom.notFound());
    } catch (e) {
      return next(boom.notFound());
    }
  }),
);

module.exports = router;
