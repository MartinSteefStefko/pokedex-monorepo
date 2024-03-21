import { FastifyRequest, FastifyReply } from 'fastify';

import {
  mikroOrm,
  FavoritePokemon,
  Pokemon,
} from '@pokedex-monorepo/mikro-orm-postgres';
import { SupabaseUser } from '@pokedex-monorepo/supabase';

export const setFavoritePokemon = async (
  request: FastifyRequest<{ Body: { id: string; user: SupabaseUser } }>,
  reply: FastifyReply
) => {
  const { id } = request.body;
  console.log('id', id);

  const userId = request.body.user?.identities?.[0]?.identity_data?.sub;
  console.log('userId', userId);

  const orm = await mikroOrm();
  console.log('orm', orm);
  const em = orm.em.fork();

  const pokemon = await em.findOne(Pokemon, { id: +id });
  console.log('pokemon', pokemon);

  if (!pokemon) {
    reply.code(404).send({ message: 'Pokemon not found' });
    return;
  }

  const existingFavorite = await em.findOne(FavoritePokemon, {
    pokemon,
    userId,
  });
  console.log('existingFavorite', existingFavorite);

  if (existingFavorite) {
    reply.code(400).send({ message: 'Pokemon already marked as favorite' });
    return;
  }
  console.log('existingFavorite', existingFavorite);

  const favoritePokemon = em.create(FavoritePokemon, {
    userId,
    pokemon,
  });
  console.log('favoritePokemon', favoritePokemon);

  await em.persistAndFlush(favoritePokemon);

  reply.send({ message: `Pokemon with id ${id} marked as favorite` });
  await orm.close();
};
