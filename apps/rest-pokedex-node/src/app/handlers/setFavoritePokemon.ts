import { FastifyRequest, FastifyReply } from 'fastify';
import { FavoritePokemon, Pokemon } from '@pokedex-monorepo/mikro-orm-postgres';
import { SupabaseUser } from '@pokedex-monorepo/supabase';
import { RequestContext } from '@mikro-orm/core';

export const setFavoritePokemon = async (
  request: FastifyRequest<{ Body: { id: string; user: SupabaseUser } }>,
  reply: FastifyReply,
  RequestContext: RequestContext
) => {
  const { id } = request.body;
  const userId = request.body.user?.identities?.[0]?.identity_data?.sub;

  const em = RequestContext.em;

  const pokemon = await em.findOne(Pokemon, { id: id });

  if (!pokemon) {
    reply.code(404).send({ message: 'Pokemon not found' });

    return;
  }

  const existingFavorite = await em.findOne(FavoritePokemon, {
    pokemon,
    userId,
  });

  if (existingFavorite) {
    reply.code(400).send({ message: 'Pokemon already marked as favorite' });
    return;
  }

  const favoritePokemon = em.create(FavoritePokemon, {
    userId,
    pokemon,
  });

  await em.persistAndFlush(favoritePokemon);
  reply.send({ message: `Pokemon with id ${id} marked as favorite` });
};
