import { FastifyRequest, FastifyReply } from 'fastify';
import { pokemonsData } from './pokemonsData';

const favorites: Map<string, boolean> = new Map();

export const setFavoritePokemon = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const { id } = request.params;

  if (!pokemonsData.some((pokemon) => pokemon.id === id)) {
    reply.code(404).send({ message: 'Pokemon not found' });
    return;
  }

  favorites.set(id, true);
  reply.send({ message: `Pokemon with id ${id} marked as favorite` });
};
