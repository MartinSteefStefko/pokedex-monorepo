import { FastifyRequest, FastifyReply } from 'fastify';

const favorites: Map<string, boolean> = new Map();

export const removeFavoritePokemon = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const { id } = request.params;

  if (!favorites.has(id)) {
    reply.code(404).send({ message: 'Pokemon not found in favorites' });
    return;
  }

  favorites.delete(id);
  reply.send({ message: `Pokemon with id ${id} removed from favorites` });
};
