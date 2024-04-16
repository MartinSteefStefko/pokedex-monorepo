import { FastifyRequest, FastifyReply } from 'fastify';
import { Pokemon } from '@pokedex-monorepo/mikro-orm-postgres';
import { RequestContext } from '@mikro-orm/core';
import { PokemonRelations } from '../enums';
import { mapPokemon } from '../helpers';

export const getPokemonByName = async (
  request: FastifyRequest<{ Params: { name: string } }>,
  reply: FastifyReply,
  RequestContext: RequestContext
) => {
  const em = RequestContext.em;

  const { name } = request.params;

  const pokemons = await em.find(Pokemon, {
    name: { $ilike: `%${name}%` },
  });
  const populatedPokemons = await em.populate(pokemons, [
    PokemonRelations?.ATTACKS,
    PokemonRelations?.EVOLUTIONS,
  ]);
  const mappedPokemons = mapPokemon(populatedPokemons);

  reply.send(mappedPokemons);
};
