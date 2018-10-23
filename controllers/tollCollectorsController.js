const express = require('express');
const httpStatus = require('http-status');
const boom = require('boom');
const Joi = require('joi');
const turf = require('turf');
const _ = require('lodash');
const moment = require('moment');
const asyncMiddleware = require('../middleware/async');
const tollCollectors = require('./tollCollectors');

const router = express.Router();

router.post(
  '/calculate',
  asyncMiddleware(async (req, res, next) => {
    const schema = Joi.object().keys({
      routes: Joi.array().required(),
      category: Joi.number().required(),
      totalDistance: Joi.number().required(),
      totalTime: Joi.number().required(),
    });
    const { error } = Joi.validate(req.body, schema);
    if (error) return next(boom.badRequest(error.details[0].message));
    const { routes, category, totalDistance, totalTime } = req.body;
    try {
      let tollCollectorsOnRoute = [];
      let totalPrice = 0;
      routes.forEach(({ lat, lng }) => {
        tollCollectors.forEach(tollCollector => {
          const p1 = turf.point([lat, lng]);
          const p2 = turf.point([
            tollCollector.coordenadas.lat,
            tollCollector.coordenadas.lng,
          ]);
          const distance = turf.distance(p1, p2);
          if (distance < 0.05) {
            tollCollectorsOnRoute.push(tollCollector);
          }
        });
      });
      tollCollectorsOnRoute = _.uniq(tollCollectorsOnRoute);
      tollCollectorsOnRoute.forEach(({ categoria }) => {
        const price = categoria[category];
        if (_.isNumber(price)) {
          totalPrice += price;
        } else {
          totalPrice += categoria[4];
        }
      });
      const duration = moment.duration(totalTime, 'seconds');
      const durationString = `${duration.hours()}h ${duration.minutes()}min`;
      const totalDistanceString = `${(totalDistance / 1000).toFixed(2)} km`;
      return res.status(httpStatus.OK).json({
        tollCollectorsOnRoute,
        totalPrice,
        durationString,
        totalDistanceString,
      });
    } catch (err) {
      return next(boom.badImplementation(err.message));
    }
  }),
);

module.exports = router;
