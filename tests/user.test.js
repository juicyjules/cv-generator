const request = require('supertest');
const app = require('../src/index');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

describe('User Management', () => {
  let token;
  let userId;

  beforeAll(async () => {
    await prisma.user.deleteMany({});
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({ email: 'testuser@example.com', password: 'password123' });
    expect(res.statusCode).toEqual(201);
    userId = res.body.userId;
  });

  it('should login the new user', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'testuser@example.com', password: 'password123' });
    expect(res.statusCode).toEqual(200);
    token = res.headers['set-cookie'][0].split(';')[0];
  });

  it('should change the user password', async () => {
    const res = await request(app)
      .post('/api/users/change-password')
      .set('Cookie', token)
      .send({ oldPassword: 'password123', newPassword: 'newpassword123' });
    expect(res.statusCode).toEqual(200);
  });

  it('should login with the new password', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'testuser@example.com', password: 'newpassword123' });
    expect(res.statusCode).toEqual(200);
  });

  it('should delete the user account', async () => {
    const res = await request(app)
      .delete('/api/users/delete-account')
      .set('Cookie', token);
    expect(res.statusCode).toEqual(200);
  });

  it('should not be able to login with the deleted account', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'testuser@example.com', password: 'newpassword123' });
    expect(res.statusCode).toEqual(401);
  });
});
