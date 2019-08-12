const express = require("express");
const httpStatus = require("http-status");
const boom = require("boom");
const asyncMiddleware = require("../middleware/async");
const { authenticateAdmin } = require("../middleware/authenticate");
const fileHelper = require("../utils/file");

const router = express.Router();

router.put(
  "/image",
  authenticateAdmin,
  asyncMiddleware(async (req, res, next) => {
    const image = req.file;
    if (!image) return next(boom.badRequest());
    return res.status(httpStatus.OK).json({ key: req.key, path: image.path });
  })
);

router.delete(
  "/image/delete",
  authenticateAdmin,
  asyncMiddleware(async (req, res, next) => {
    const { path } = req.query;
    if (!path) return next(boom.badRequest());
    try {
      await fileHelper.deleteFile(path);
      return res.status(httpStatus.OK).json("Image deleted");
    } catch (error) {
      if (error.code && error.code === "ENOENT") {
        return next(boom.notFound(error));
      }
      return next(boom.badRequest(error));
    }
  })
);

module.exports = router;
