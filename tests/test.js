const supertest = require('supertest');
// const test = require('unit.js');
const app = require('../app.js');

const request = supertest(app);

describe('GET /ping', () => {
  it('should response with 200 status', (done) => {
    request
      .get('/ping')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});
