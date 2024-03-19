import * as path from 'path';
import { FastifyInstance } from 'fastify';
import AutoLoad from '@fastify/autoload';

import { specs } from '../config/swagger';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AppOptions {}

export async function app(fastify: FastifyInstance, opts: AppOptions) {
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: { ...opts },
  });
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  await fastify.register(require('@fastify/swagger'));
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  await fastify.register(require('@fastify/swagger-ui'), specs);

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: { ...opts },
  });
}
