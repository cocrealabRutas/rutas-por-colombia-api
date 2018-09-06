const turf = require('turf');
const _ = require('lodash');
const moment = require('moment');
const tollCollectors = require('./tollCollectors');

module.exports = (req, res) => {
  const handleError = error => {
    console.error(error);
    return res.sendStatus(500);
  };

  const handleResponse = (status, body) => {
    console.log({
      Response: {
        Status: status,
        Body: body
      }
    });
    if (body) {
      return res.status(200).json(body);
    }
    return res.sendStatus(status);
  };
  // Authentication requests are POSTed, other requests are forbidden
  if (req.method !== "POST") {
    return handleResponse(405);
  }

  const {
    body: {
      routes,
      category,
      totalDistance,
      totalTime,
    }
  } = req;
  if (_.isEmpty(routes) || !_.isNumber(category) ||
    !_.isNumber(totalDistance) || !_.isNumber(totalTime)) {
    return handleResponse(400);
  }
  try {
    let tollCollectorsOnRoute = [];
    let totalPrice = 0;
    routes.forEach(({
      lat,
      lng
    }) => {
      tollCollectors.forEach(tollCollector => {
        const p1 = turf.point([lat, lng]);
        const p2 = turf.point([
          tollCollector.coordenadas.lat,
          tollCollector.coordenadas.lng,
        ]);
        const distance = turf.distance(p1, p2);
        if (distance < 0.05) {
          const price = tollCollector.categoria[category];
          if (price) {
            totalPrice += price;
          } else {
            totalPrice += tollCollector.categoria[4];
          }
          tollCollectorsOnRoute.push(tollCollector);
        }
      });
    });
    tollCollectorsOnRoute = _.uniq(tollCollectorsOnRoute);
    const duration = moment.duration(totalTime, 'seconds');
    const durationString = `${ duration.hours()}h ${duration.minutes()}min`;
    const totalDistanceString = `${totalDistance / 1000} km`
    return handleResponse(200, {
      tollCollectorsOnRoute,
      totalPrice,
      durationString,
      totalDistanceString
    });
  } catch (error) {
    return handleError(error);
  }
}