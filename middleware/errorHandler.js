const httpStatus = require('http-status');

/* eslint-disable */
module.exports = (err, req, res, next) => {
  if (err.isServer) {
    console.log(err);
  }
  if (!err.output) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(httpStatus['500_MESSAGE']);
  }
  return res.status(err.output.statusCode).json(err.output.payload);
};
