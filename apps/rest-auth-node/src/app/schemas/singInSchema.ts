import { sessionSchema } from '@pokedex-monorepo/supabase';

export const signInSchema = {
  description: 'Sign in user',
  tags: ['user'],
  summary: 'Signs in a user',
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 8 },
    },
  },
  response: {
    200: {
      description: 'Successful response',
      type: 'object',
      properties: {
        session: sessionSchema,
      },
    },
    400: {
      description: 'Bad request when something goes wrong',
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
};
