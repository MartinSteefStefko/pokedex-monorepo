import { FastifyRequest, FastifyReply } from 'fastify';
import {
  MikroORM,
  Pokemon,
  FavoritePokemon,
  mikroOrmConfig,
} from '@pokedex-monorepo/mikro-orm-postgres';
import { PAGE_SIZE } from '../constants';
import { PokemonQueryParams } from './types';
import { SupabaseUser } from '@pokedex-monorepo/supabase';
import { mapPokemon } from '../helpers';
import 'reflect-metadata';

export const getPokemons = async (
  request: FastifyRequest<{
    Querystring: PokemonQueryParams;
    Params: { user: SupabaseUser };
    Body: { user: SupabaseUser };
  }>,
  reply: FastifyReply
) => {
  const orm = await MikroORM.init(mikroOrmConfig);

  const em = orm.em.fork();
  const userId = request.body.user?.identities?.[0]?.identity_data?.sub;
  const { search, type, isFavorite, page = 1 } = request.query;
  const offset = (page - 1) * PAGE_SIZE;

  let baseQuery = em.createQueryBuilder(Pokemon);

  if (search) {
    baseQuery = baseQuery.andWhere({ name: { $ilike: `%${search}%` } });
  }

  const initialPokemons = await baseQuery.getResultList();
  const test = initialPokemons.filter((pokemon) =>
    pokemon.types.some((pokemonType) =>
      type
        ?.split(',')
        ?.map((t) => t.trim().toLowerCase())
        ?.includes(pokemonType.toLowerCase())
    )
  );

  const pokemonsAfterTypeFilter = type
    ? initialPokemons.filter((pokemon) =>
        pokemon.types.some((pokemonType) =>
          type
            ?.split(',')
            ?.map((t) => t.trim().toLowerCase())
            ?.includes(pokemonType.toLowerCase())
        )
      )
    : initialPokemons;

  const finalPokemons =
    isFavorite === 'true' && userId
      ? await em

          .find(FavoritePokemon, { userId })
          .then((favoriteRecords) =>
            pokemonsAfterTypeFilter.filter((pokemon) =>
              favoriteRecords.map((fp) => fp.pokemon.id).includes(pokemon.id)
            )
          )
      : pokemonsAfterTypeFilter;

  const paginatedPokemons = finalPokemons.slice(offset, offset + PAGE_SIZE);

  const populatedPokemons = await em.populate(paginatedPokemons, [
    'attacks',
    'evolutions',
  ]);

  const mappedPokemons = mapPokemon(populatedPokemons);

  const total = finalPokemons.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const currentPage = page > totalPages ? totalPages : page;

  reply.send({
    results: mappedPokemons,
    total,
    page: currentPage,
    pageSize: PAGE_SIZE,
    totalPerPage: Array.isArray(mappedPokemons) && mappedPokemons.length,
    totalPages,
  });
  await orm.close();
};
