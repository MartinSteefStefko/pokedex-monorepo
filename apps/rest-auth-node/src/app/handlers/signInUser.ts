import { FastifyRequest, FastifyReply } from 'fastify';
import { supabase } from '@pokedex-monorepo/supabase';

export const signInUser = async (
  request: FastifyRequest<{
    Body: { email: string; password: string };
  }>,
  reply: FastifyReply
) => {
  const { email, password } = request.body;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  const { user, session } = data;
  console.log('user', user);
  console.log('session,', session);
  console.log('error', error);

  if (error) {
    reply.code(400).send({ error: error.message });
    return;
  }

  reply.send({ user, session });
};
