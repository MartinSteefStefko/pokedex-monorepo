import { FastifyRequest, FastifyReply } from 'fastify';
import { RequestContext } from '@mikro-orm/core';
import { Pokemon } from '@pokedex-monorepo/mikro-orm-postgres';
import { PokemonRelations } from '../enums';
import { mapPokemon } from '../helpers';

export const getPokemonById = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
  RequestContext: RequestContext
) => {
  const em = RequestContext.em;
  const { id } = request.params;

  const pokemon = await em.findOne(Pokemon, { id: id });
  if (!pokemon) {
    reply.code(404).send({ message: 'Pokemon not found' });

    return;
  }
  const populatedPokemon = await em.populate(pokemon, [
    PokemonRelations?.ATTACKS,
    PokemonRelations?.EVOLUTIONS,
  ]);
  const mappedPokemon = mapPokemon(populatedPokemon);

  reply.send(mappedPokemon);
};
