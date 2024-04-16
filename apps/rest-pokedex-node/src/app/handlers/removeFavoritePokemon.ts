import { FastifyRequest, FastifyReply } from 'fastify';
import { FavoritePokemon, Pokemon } from '@pokedex-monorepo/mikro-orm-postgres';
import { SupabaseUser } from '@pokedex-monorepo/supabase';
import { RequestContext } from '@mikro-orm/core';

export const removeFavoritePokemon = async (
  request: FastifyRequest<{ Body: { id: string; user: SupabaseUser } }>,
  reply: FastifyReply,
  RequestContext: RequestContext
) => {
  const { id } = request.body;
  const userId = request.body.user?.identities?.[0]?.identity_data?.sub;

  const em = RequestContext.em;

  try {
    const pokemon = await em.findOne(Pokemon, { id: id });
    if (!pokemon) {
      reply.code(404).send({ message: 'Pokemon not found' });

      return;
    }

    const favorite = await em.findOne(FavoritePokemon, { pokemon, userId });
    if (!favorite) {
      reply.code(404).send({ message: 'Pokemon not found in favorites' });
      return;
    }
    await em.removeAndFlush(favorite);

    reply.send({ message: `Pokemon with id ${id} removed from favorites` });
  } catch (error) {
    console.error(error);
    reply.code(500).send({
      message: 'An error occurred while removing the favorite Pokemon',
    });
  }
};
