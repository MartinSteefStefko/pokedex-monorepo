import { FastifyRequest, FastifyReply } from 'fastify';

import {
  MikroORM,
  mikroOrmConfig,
  FavoritePokemon,
  Pokemon,
} from '@pokedex-monorepo/mikro-orm-postgres';
import { SupabaseUser } from '@pokedex-monorepo/supabase';

export const setFavoritePokemon = async (
  request: FastifyRequest<{ Body: { id: string; user: SupabaseUser } }>,
  reply: FastifyReply
) => {
  const { id } = request.body;
  const userId = request.body.user?.identities?.[0]?.identity_data?.sub;
  const orm = await MikroORM.init(mikroOrmConfig);
  const em = orm.em.fork();

  const pokemon = await em.findOne(Pokemon, { id: +id });

  if (!pokemon) {
    reply.code(404).send({ message: 'Pokemon not found' });
    await orm.close();
    return;
  }

  const existingFavorite = await em.findOne(FavoritePokemon, {
    pokemon,
    userId,
  });

  if (existingFavorite) {
    reply.code(400).send({ message: 'Pokemon already marked as favorite' });
    await orm.close();
    return;
  }

  const favoritePokemon = em.create(FavoritePokemon, {
    userId,
    pokemon,
  });

  await em.persistAndFlush(favoritePokemon);

  reply.send({ message: `Pokemon with id ${id} marked as favorite` });
  await orm.close();
};
