import { FastifyRequest, FastifyReply } from 'fastify';
import {
  mikroOrm,
  FavoritePokemon,
  Pokemon,
} from '@pokedex-monorepo/mikro-orm-postgres';

export const removeFavoritePokemon = async (
  request: FastifyRequest<{ Body: { id: string } }>,
  reply: FastifyReply
) => {
  const { id } = request.body;
  const userId = 'MATT01';
  const orm = await mikroOrm();
  const em = orm.em.fork();

  try {
    const pokemon = await em.findOne(Pokemon, { id: parseInt(id, 10) });
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
