import { FastifyRequest, FastifyReply } from 'fastify';

import { PreAuthBody, SupabaseUser } from '../../types';
import { supabase } from '../client';

export const authHook = async (
  request: FastifyRequest<PreAuthBody>,
  reply: FastifyReply
) => {
  try {
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) throw new Error('No token provided');

    const { data, error } = await supabase.auth.getUser(token);

    const { user } = data;

    if (error || !user) throw new Error('Authentication failed');

    if (request.method === 'GET') {
      request.body = {} as never;
      request.body.user = user;
    } else {
      request.body.user = user;
    }
  } catch (error) {
    reply.code(401).send({ error: 'Authentication failed' });
  }
};
