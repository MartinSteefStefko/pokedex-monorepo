import { FastifyRequest, FastifyReply } from 'fastify';
import {
  MikroORM,
  mikroOrmConfig,
  FavoritePokemon,
  Pokemon,
} from '@pokedex-monorepo/mikro-orm-postgres';
import { SupabaseUser } from '@pokedex-monorepo/supabase';

export const removeFavoritePokemon = async (
  request: FastifyRequest<{ Body: { id: string; user: SupabaseUser } }>,
  reply: FastifyReply
) => {
  const { id } = request.body;
  const userId = request.body.user?.identities?.[0]?.identity_data?.sub;
  const orm = await MikroORM.init(mikroOrmConfig);
  const em = orm.em.fork();

  try {
    const pokemon = await em.findOne(Pokemon, { id: parseInt(id, 10) });
    if (!pokemon) {
      reply.code(404).send({ message: 'Pokemon not found' });
      await orm.close();
      return;
    }
    console.log('pokemon', pokemon);

    const favorite = await em.findOne(FavoritePokemon, { pokemon, userId });
    console.log('favorite', favorite);
    if (!favorite) {
      reply.code(404).send({ message: 'Pokemon not found in favorites' });
      await orm.close();
      return;
    }

    await em.removeAndFlush(favorite);

    reply.send({ message: `Pokemon with id ${id} removed from favorites` });
    await orm.close();
  } catch (error) {
    console.error(error);
    reply.code(500).send({
      message: 'An error occurred while removing the favorite Pokemon',
    });
    await orm.close();
  }
};
