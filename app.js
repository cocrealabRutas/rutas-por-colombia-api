const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const Boom = require('boom');
const router = express.Router();
const compression = require('compression');

const errorHandler = require('./middleware/errorHandler');

const docs = require('./startup/docs');

// DB
require('./db/mongoose');

// Controllers
const pingController = require('./controllers/pingController');
const tollCollectorsController = require('./controllers/tollCollectorsController');
const userController = require('./controllers/userController');

// Express Configuration
const app = express();

// Middlewares
app.use(compression());
app.options('*', cors());
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// App routes
app.use('/api-docs', swaggerUi.serve, router.get('/', swaggerUi.setup(docs)));
app.use('/ping', pingController);
app.use('/tollCollectors', tollCollectorsController);
app.use('/users', userController);

// Error Handling
app.use('*', (req, res, next) => next(Boom.notFound()));
app.use(errorHandler);

module.exports = app;
