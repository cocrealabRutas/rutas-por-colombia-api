const app = require('./app');

const port = process.env.PORT;

app.listen(port, '0.0.0.0');
console.log(
  `listening on http://localhost:${port} in ${process.env.NODE_ENV} mode`,
);
