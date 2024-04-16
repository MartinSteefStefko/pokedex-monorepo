import { FastifyRequest, FastifyReply } from 'fastify';
import { Pokemon } from '@pokedex-monorepo/mikro-orm-postgres';
import { RequestContext } from '@mikro-orm/core';

export const getPokemonTypes = async (
  request: FastifyRequest,
  reply: FastifyReply,
  RequestContext: RequestContext
) => {
  const em = RequestContext.em;

  const pokemons = await em.find(Pokemon, {});

  const allTypesWithDuplicates = pokemons.reduce((acc, pokemon) => {
    if (pokemon.types) {
      acc.push(...pokemon.types);
    }
    return acc;
  }, []);

  const uniqueTypes = Array.from(new Set(allTypesWithDuplicates));

  reply.send({
    types: uniqueTypes,
  });
};
