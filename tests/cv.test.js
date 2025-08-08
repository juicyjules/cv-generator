const request = require('supertest');
const app = require('../src/index');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

describe('CV Management', () => {
  let token;
  let cvId;

  beforeAll(async () => {
    await prisma.user.deleteMany({});
    await request(app)
      .post('/api/users/register')
      .send({ email: 'cvtest@example.com', password: 'password123' });
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'cvtest@example.com', password: 'password123' });
    token = res.headers['set-cookie'][0].split(';')[0];
  });

  it('should create a new CV', async () => {
    const res = await request(app)
      .post('/api/cvs')
      .set('Cookie', token)
      .send({ title: 'My Test CV' });
    expect(res.statusCode).toEqual(201);
    cvId = res.body.cv.id;
  });

  it('should generate a PDF for the CV', async () => {
    const res = await request(app)
      .get(`/api/cvs/${cvId}/pdf`)
      .set('Cookie', token);
    expect(res.statusCode).toEqual(200);
    expect(res.headers['content-type']).toEqual('application/pdf');
  });

  it('should make the CV public', async () => {
    const res = await request(app)
      .put(`/api/cvs/${cvId}/toggle-public`)
      .set('Cookie', token)
      .send({ isPublic: true });
    expect(res.statusCode).toEqual(200);
    expect(res.body.cv.isPublic).toBe(true);
    expect(res.body.cv.publicId).toBeDefined();
  });

  it('should be able to view the public CV', async () => {
    const res = await request(app)
      .put(`/api/cvs/${cvId}/toggle-public`)
      .set('Cookie', token)
      .send({ isPublic: true });
    const publicId = res.body.cv.publicId;
    const publicRes = await request(app).get(`/cv/${publicId}`);
    expect(publicRes.statusCode).toEqual(200);
  });
});
