const request = require('supertest');
const app = require('../src/index');

describe('Simple Test', () => {
  it('should return 200 for the root path', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
  });
});
