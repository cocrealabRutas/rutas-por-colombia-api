const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  info: {
    title: 'Rutas por Colombia API',
    version: '0.0.1',
    description:
      'Rutas Por Colombia Express Server. API Rest utilizada para consumir todos los servicios de la aplicación web y el administrador.',
  },
  schemes: ['http', 'https'],
};

const options = {
  swaggerDefinition,
  apis: ['./controllers/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
