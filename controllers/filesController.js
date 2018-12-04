const express = require('express');
const httpStatus = require('http-status');
const boom = require('boom');
const asyncMiddleware = require('../middleware/async');
const { authenticateAdmin } = require('../middleware/authenticate');
const fileHelper = require('../utils/file');

const router = express.Router();

router.post(
  '/images',
  authenticateAdmin,
  asyncMiddleware(async (req, res, next) => {
    console.log(req);
    const image = req.file;
    if (!image) return next(boom.badRequest());
    return res.status(httpStatus.OK).json({ key: req.key, url: image.path });
  }),
);

router.post(
  '/images/delete',
  authenticateAdmin,
  asyncMiddleware(async (req, res, next) => {
    const { url } = req.body;
    if (!url) return next(boom.badRequest());
    fileHelper.deleteFile(url);
    return res.status(httpStatus.OK).json('Image deleted');
  }),
);

module.exports = router;
