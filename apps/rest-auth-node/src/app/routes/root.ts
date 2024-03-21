import { FastifyInstance } from 'fastify';
import { signInUser } from '../handlers';
import 'reflect-metadata';
import { signInSchema } from '../schemas';

const AuthRoutes = async (server: FastifyInstance) => {
  server.post(
    '/user/signin',
    {
      schema: signInSchema,
    },

    signInUser
  );
};

export default AuthRoutes;
