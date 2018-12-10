const express = require('express');
const httpStatus = require('http-status');
const boom = require('boom');
const Joi = require('joi');
const turf = require('turf');
const _ = require('lodash');
const asyncMiddleware = require('../middleware/async');
const entities = require('../models/entities');

const router = express.Router();

router.post(
  '/calculate',
  asyncMiddleware(async (req, res, next) => {
    const schema = Joi.object().keys({
      routes: Joi.array().required(),
    });
    const { error } = Joi.validate(req.body, schema);
    if (error) return next(boom.badRequest(error.details[0].message));
    const { routes } = req.body;
    try {
      let touristAttractionsOnRoute = [];
      const touristAttractions = await entities.touristAttraction.Schema.find(
        {},
      );
      routes.forEach(({ lat, lng }) => {
        touristAttractions.forEach(touristAttraction => {
          const p1 = turf.point([lat, lng]);
          const p2 = turf.point([touristAttraction.lat, touristAttraction.lng]);
          const distance = turf.distance(p1, p2);
          if (distance < 10) {
            touristAttractionsOnRoute.push(touristAttraction);
          }
        });
      });
      touristAttractionsOnRoute = _.uniq(touristAttractionsOnRoute);
      return res.status(httpStatus.OK).json({
        touristAttractionsOnRoute,
      });
    } catch (err) {
      return next(boom.badRequest(err));
    }
  }),
);

module.exports = router;
