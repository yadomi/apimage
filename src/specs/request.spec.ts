const request = require('supertest');
const { server } = require('../index');
const { join } = require('path');

it('should returns 200 when upload a valid image', async () => {
  await request(server.listener)
    .post('/')
    .attach('data', join(__dirname, 'samples/lenna.jpg'))
    .expect(200);
});

it('should returns 415 when upload an unsuported media', async () => {
  await request(server.listener)
    .post('/')
    .attach('data', join(__dirname, 'samples/lenna.gif'))
    .expect(415);
});

it('should returns 404 when request an inexistant media', async () => {
  await request(server.listener)
    .get('/source/db0f9fb0-9b7b-4038-a4bc-ed71e3838554')
    .expect(404);
});
