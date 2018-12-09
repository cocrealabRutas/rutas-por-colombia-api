const express = require('express');
const httpStatus = require('http-status');
const boom = require('boom');
const asyncMiddleware = require('../middleware/async');
const { authenticateAdmin } = require('../middleware/authenticate');
const fileHelper = require('../utils/file');

const router = express.Router();

router.post(
  '/image',
  authenticateAdmin,
  asyncMiddleware(async (req, res, next) => {
    const image = req.file;
    if (!image) return next(boom.badRequest());
    return res.status(httpStatus.OK).json({ key: req.key, url: image.path });
  }),
);

router.post(
  '/image/delete',
  authenticateAdmin,
  asyncMiddleware(async (req, res, next) => {
    const { path } = req.body;
    if (!path) return next(boom.badRequest());
    try {
      await fileHelper.deleteFile(path);
      return res.status(httpStatus.OK).json('Image deleted');
    } catch (error) {
      return next(boom.badRequest(error));
    }
  }),
);

module.exports = router;
