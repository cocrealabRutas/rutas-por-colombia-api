const turf = require('turf');
const _ = require('lodash');
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
      routes
    }
  } = req;
  if (!routes) {
    return handleResponse(400);
  }
  try {
    let tollCollectorsOnRoute = [];
    routes.forEach(({
      lat,
      lng
    }) => {
      tollCollectors.forEach(coordenada => {
        const p1 = turf.point([lat, lng]);
        const p2 = turf.point([
          coordenada.coordenadas.lat,
          coordenada.coordenadas.lng,
        ]);
        const distance = turf.distance(p1, p2);
        if (distance < 0.05) {
          tollCollectorsOnRoute.push(coordenada);
        }
      });
    });
    const markers = [];
    tollCollectorsOnRoute = _.uniq(tollCollectorsOnRoute);
    return handleResponse(200, tollCollectorsOnRoute);
  } catch (error) {
    return handleError(error);
  }
}