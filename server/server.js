const express = require('express');
const bodyParser = require('body-parser');
const findTollCollectors = require('./findTollCollectors');

// CORS Express middleware to enable CORS Requests.
const cors = require('cors');

const corsOptions = {
  origin: '*',
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}

const app = express();

app.use(bodyParser.json({
  limit: '50mb'
}));

app.options('*', cors());

app.use(cors())

app.post('/findTollCollectors', findTollCollectors);

app.listen(1337, () => {
  console.log('Started on port 1337');
});