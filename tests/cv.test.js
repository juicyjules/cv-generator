const request = require('supertest');
const app = require('../src/index');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

describe('CV Management', () => {
  let token;

  beforeAll(async () => {
    await prisma.user.deleteMany({});
    await prisma.cv.deleteMany({});

    // Register and login a user to get a token
    await request(app)
      .post('/api/users/register')
      .send({ email: 'testcv@example.com', password: 'password123' });
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'testcv@example.com', password: 'password123' });
    token = res.headers['set-cookie'][0].split(';')[0];
  });

  it('should not allow access to CVs without a token', async () => {
    const res = await request(app).get('/api/cvs');
    expect(res.statusCode).toEqual(401);
  });

  it('should create a new CV for an authenticated user', async () => {
    const res = await request(app)
      .post('/api/cvs')
      .set('Cookie', token)
      .send({
        title: 'My First CV',
        content: { experience: 'Software Engineer' },
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.cv).toHaveProperty('id');
    expect(res.body.cv.title).toBe('My First CV');
  });

  it('should get all CVs for an authenticated user', async () => {
    const res = await request(app)
      .get('/api/cvs')
      .set('Cookie', token);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBe(1);
  });

  it('should update a CV', async () => {
    const cvsRes = await request(app)
      .get('/api/cvs')
      .set('Cookie', token);
    const cvId = cvsRes.body[0].id;

    const res = await request(app)
      .put(`/api/cvs/${cvId}`)
      .set('Cookie', token)
      .send({
        title: 'My Updated CV',
        content: { experience: 'Senior Software Engineer' },
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.cv.title).toBe('My Updated CV');
  });

  it('should delete a CV', async () => {
    const cvsRes = await request(app)
      .get('/api/cvs')
      .set('Cookie', token);
    const cvId = cvsRes.body[0].id;

    const res = await request(app)
      .delete(`/api/cvs/${cvId}`)
      .set('Cookie', token);
    expect(res.statusCode).toEqual(200);

    const getRes = await request(app)
      .get(`/api/cvs/${cvId}`)
      .set('Cookie', token);
    expect(getRes.statusCode).toEqual(404);
  });
});
