import { FastifyRequest, FastifyReply } from 'fastify';

import { PreAuthBody } from '../../types';
import { supabase } from '../client';

export const authHook = async (
  request: FastifyRequest<PreAuthBody> | any,
  reply: FastifyReply
) => {
  try {
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) throw new Error('No token provided');

    const { data, error } = await supabase.auth.getUser(token);

    const { user } = data;

    if (error || !user) throw new Error('Authentication failed');

    if (Object.keys(request?.query).length) {
      request.body = {};
    }
    request.body.user = user;
  } catch (error) {
    reply.code(401).send({ error: 'Authentication failed' });
  }
};
