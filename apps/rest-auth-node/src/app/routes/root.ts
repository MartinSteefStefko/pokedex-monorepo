import { FastifyInstance } from 'fastify';
import { signInUser } from '../handlers';
import 'reflect-metadata';

const AuthRoutes = async (server: FastifyInstance) => {
  server.post('/user/signin', signInUser);
};

export default AuthRoutes;
