import { FastifyRequest, FastifyReply } from 'fastify';
import { EntityManager } from '@mikro-orm/core';
import { Pokemon, mikroOrm } from '@pokedex-monorepo/mikro-orm-postgres';
import { PokemonRelations } from '../enums';

export const getPokemonById = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const orm = await mikroOrm();
  const em: EntityManager = orm.em.fork();
  const { id } = request.params;

  const pokemon = await em.findOne(Pokemon, { id: parseInt(id, 10) });
  if (!pokemon) {
    reply.code(404).send({ message: 'Pokemon not found' });
    return;
  }
  const populatedPokemon = await em.populate(pokemon, [
    PokemonRelations?.ATTACKS,
    PokemonRelations?.EVOLUTIONS,
  ]);

  reply.send(populatedPokemon);
};
