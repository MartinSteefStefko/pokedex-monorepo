import * as path from 'path';
import { RequestContext } from '@mikro-orm/core';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import AutoLoad from '@fastify/autoload';

import { specs } from '../config/swagger';
import { authHook, PreAuthBody } from '@pokedex-monorepo/supabase';
import { initORM } from '@pokedex-monorepo/mikro-orm-postgres';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AppOptions {}

export async function app(fastify: FastifyInstance, opts: AppOptions) {
  const db = await initORM();
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: { ...opts },
  });
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  await fastify.register(require('@fastify/swagger'), {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'Test swagger',
        description: 'Testing the Fastify swagger API',
        version: '0.1.0',
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [{ bearerAuth: [] }],
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here',
      },
    },
  });
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  await fastify.register(require('@fastify/swagger-ui'), specs);

  fastify.addHook(
    'preHandler',
    async (request: FastifyRequest<PreAuthBody>, reply: FastifyReply) => {
      if (
        !request.raw.url?.startsWith('/documentation') &&
        !request.raw.url?.startsWith('/swagger-ui')
      ) {
        await authHook(request, reply);
      }
    }
  );

  fastify.addHook('onRequest', (request, reply, done) => {
    RequestContext.create(db.em, done);
  });

  fastify.addHook('onClose', async () => {
    await db.orm.close();
  });

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: { ...opts },
  });
}
