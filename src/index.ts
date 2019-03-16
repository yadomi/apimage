const Hapi = require('hapi');

const server = Hapi.server({
  port: 3000,
  host: 'localhost',
  debug: { request: ['error'] },
});

server.route({
  method: 'GET',
  path: '/{query}/{id}',
  handler: require('./handlers/read'),
  options: {
    validate: require('./validators/read'),
  },
});

server.route({
  method: 'POST',
  path: '/',
  handler: require('./handlers/upload'),
});

const main = async () => {
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', err => {
  process.exit(1);
});

main();
