import { FastifyRequest, FastifyReply } from 'fastify';
import {
  MikroORM,
  mikroOrmConfig,
  Pokemon,
} from '@pokedex-monorepo/mikro-orm-postgres';

export const getPokemonTypes = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const orm = await MikroORM.init(mikroOrmConfig);
  const em = orm.em.fork();

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
  await orm.close();
};
