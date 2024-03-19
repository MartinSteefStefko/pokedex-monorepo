import { FastifyRequest, FastifyReply } from 'fastify';
import { pokemonsData } from './pokemonsData';

export const getPokemonById = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const { id } = request.params;
  const pokemon = pokemonsData.find((p) => p.id === id);

  if (!pokemon) {
    reply.code(404).send({ message: 'Pokemon not found' });
    return;
  }

  reply.send(pokemon);
};
