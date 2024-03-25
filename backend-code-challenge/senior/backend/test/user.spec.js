'use strict';

require('dotenv').config({ path: `${__dirname}/test.env` });

const request = require('supertest');

jest.mock('../src/config');

const {
  API: { KEY },
} = require('../src/config');

describe.skip('User Resource', () => {
  let database = null;
  let server = null;

  let agent = null;

  beforeAll(async () => {
    database = require('./helpers/database');
    await database.start();
    server = require('../src/server');
    const app = await server.start();
    agent = request.agent(app);
    agent.set({ 'x-api-key': KEY });
  });

  afterAll(async () => {
    await server.stop();
    await database.stop();
  });

  describe('List Operation - GET /users', () => {
    test('should return emptry array', async () => {
      const res = await agent.get('/users');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([]);
    });
  });

  describe('GET /users/me', () => {
    test('should return user information for authenticated user', async () => {
      const res = await agent.get('/users/me');
      expect(res.statusCode).toEqual(200);
      // expect(res.body).toHaveProperty('id');
      // expect(res.body).toHaveProperty('slug');
    });

  });

  describe('PUT /users/me', () => {
    test('should update user information for authenticated user', async () => {
      const updatedUserData = {name: 'Abegunde Olanrewaju' };
      const res = await agent.put('/users/me').send(updatedUserData);
      expect(res.statusCode).toEqual(200);
      // expect(res.body).toHaveProperty('id');
      // expect(res.body.name).toEqual(updatedUserData.name);
    });

  });
});
