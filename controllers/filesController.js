const express = require('express');
const httpStatus = require('http-status');
const boom = require('boom');
const cloudinary = require('cloudinary').v2;
const asyncMiddleware = require('../middleware/async');
const { authenticateAdmin } = require('../middleware/authenticate');
const fileHelper = require('../utils/file');

const router = express.Router();

router.put(
  '/image',
  authenticateAdmin,
  // eslint-disable-next-line consistent-return
  asyncMiddleware(async (req, res, next) => {
    const image = req.file;
    if (!image) return next(boom.badRequest());
    try {
      cloudinary.uploader.upload(
        image.path,
        { public_id: `images/${req.key}`, tags: 'images' }, // directory and tags are optional
        async (err, cloud) => {
          if (err) return next(boom.badRequest(err));
          await fileHelper.deleteFile(image.path);
          return res.status(httpStatus.OK).json({
            key: cloud.public_id,
            url: cloud.secure_url,
          });
        },
      );
    } catch (error) {
      return next(boom.badRequest(error));
    }
  }),
);

router.delete(
  '/image/delete',
  authenticateAdmin,
  // eslint-disable-next-line consistent-return
  asyncMiddleware(async (req, res, next) => {
    const { id } = req.query;
    if (!id) return next(boom.badRequest());
    try {
      cloudinary.uploader.destroy(id, (err, result) => {
        if (err) return next(boom.badRequest(err));
        return res.status(httpStatus.OK).json(result);
      });
    } catch (error) {
      return next(boom.badRequest(error));
    }
  }),
);

module.exports = router;
