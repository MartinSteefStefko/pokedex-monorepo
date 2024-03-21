import { FastifyRequest, FastifyReply } from 'fastify';
import { mikroOrm, Pokemon } from '@pokedex-monorepo/mikro-orm-postgres';
import { PokemonRelations } from '../enums';
import { mapPokemon } from '../helpers';

export const getPokemonByName = async (
  request: FastifyRequest<{ Params: { name: string } }>,
  reply: FastifyReply
) => {
  const orm = await mikroOrm();
  const em = orm.em.fork();

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
  await orm.close();
};
