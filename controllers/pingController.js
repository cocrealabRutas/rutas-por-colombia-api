const express = require('express');
const httpStatus = require('http-status');

const router = express.Router();

// #region Swagger
/**
 * @swagger
 * /ping:
 *   get:
 *     description: Check the status of the API
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description:
 *           ok
 */
// #endregion
router.get('/', (req, res) => {
  res.status(httpStatus.OK).json({
    message: 'Pong',
  });
});

module.exports = router;
