const app = require('./app');

const port = 8080;

app.listen(port, '0.0.0.0');
console.log(`listening on http://localhost:${port}`);
