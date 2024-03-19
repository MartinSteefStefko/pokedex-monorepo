import { FastifyRequest, FastifyReply } from 'fastify';
import { pokemonsData } from './pokemonsData';

const favorites: Map<string, boolean> = new Map();

export const getFavoritePokemons = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const favoritePokemons = pokemonsData.filter((pokemon) =>
    favorites.get(pokemon.id)
  );
  reply.send(favoritePokemons);
};
