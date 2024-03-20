import 'reflect-metadata';
import Fastify from 'fastify';
import { app } from './app/app';
import { PORT, HOST } from './config/server';

// Instantiate Fastify with some config
const server = Fastify({
  logger: true,
});

// Register your application as a normal plugin.
server.register(app);

// Start listening.
server.listen({ port: PORT, host: HOST }, (err) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  } else {
    console.log(`[ ready ] http://${HOST}:${PORT}`);
  }
});
