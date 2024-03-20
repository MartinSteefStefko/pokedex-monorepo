import * as path from 'path';
import { FastifyInstance } from 'fastify';
import AutoLoad from '@fastify/autoload';

import { specs } from '../config/swagger';

/* eslint-disable-next-line */
export interface AppOptions {}

export async function app(fastify: FastifyInstance, opts: AppOptions) {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: { ...opts },
  });

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  await fastify.register(require('@fastify/swagger'));
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  await fastify.register(require('@fastify/swagger-ui'), specs);

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: { ...opts },
  });
}
