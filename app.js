const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const Boom = require('boom');
const router = express.Router();
const compression = require('compression');
const helmet = require('helmet');
const multer = require('multer');
const uuidv4 = require('uuid/v4');

const errorHandler = require('./middleware/errorHandler');

const swaggerDocument = require('./docs.json');

// DB
require('./db/mongoose');

// Controllers
const pingController = require('./controllers/pingController');
const tollCollectorsController = require('./controllers/tollCollectorsController');
const userController = require('./controllers/userController');
const entityController = require('./controllers/entityController');
const filesController = require('./controllers/filesController');
const touristAttractionsController = require('./controllers/touristAttractionsController');

// Express Configuration
const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    const id = uuidv4();
    req.key = id;
    cb(null, `${id}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Middlewares
app.use(compression());
app.options('*', cors());
app.use(cors());
app.use(helmet());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'images')));

// App routes
app.use(
  '/api-docs',
  swaggerUi.serve,
  router.get('/', swaggerUi.setup(swaggerDocument)),
);
app.use('/ping', pingController);
app.use('/tollCollectors', tollCollectorsController);
app.use('/user', userController);
app.use('/entity', entityController);
app.use(
  '/files',
  multer({
    storage: fileStorage,
    fileFilter,
  }).single('image'),
  filesController,
);
app.use('/touristAttractions', touristAttractionsController);

// Error Handling
app.use('*', (req, res, next) => next(Boom.notFound()));
app.use(errorHandler);

module.exports = app;
