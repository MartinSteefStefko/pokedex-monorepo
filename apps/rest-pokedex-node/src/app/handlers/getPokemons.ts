import { FastifyRequest, FastifyReply } from 'fastify';
import {
  mikroOrm,
  Pokemon,
  FavoritePokemon,
} from '@pokedex-monorepo/mikro-orm-postgres';
import { PAGE_SIZE } from '../constants';
import { PokemonQueryParams } from './types';
import { SupabaseUser } from '@pokedex-monorepo/supabase';
import { mapPokemon } from '../helpers';

export const getPokemons = async (
  request: FastifyRequest<{
    Querystring: PokemonQueryParams;
    Params: { user: SupabaseUser };
    Body: { user: SupabaseUser };
  }>,
  reply: FastifyReply
) => {
  const orm = await mikroOrm();
  const em = orm.em.fork();
  const userId = request.body.user?.identities?.[0]?.identity_data?.sub;
  console.log('userId', userId);
  const { search, type, isFavorite, page = 1 } = request.query;
  console.log('page', page);
  console.log('isFavorite', isFavorite);
  console.log('type,', type);
  console.log('search', search);
  const offset = (page - 1) * PAGE_SIZE;

  let baseQuery = em.createQueryBuilder(Pokemon);
  console.log('baseQuery', baseQuery);

  if (search) {
    baseQuery = baseQuery.andWhere({ name: { $ilike: `%${search}%` } });
  }

  const initialPokemons = await baseQuery.getResultList();
  console.log('initialPokemons', initialPokemons);
  const test = initialPokemons.filter((pokemon) =>
    pokemon.types.some((pokemonType) =>
      type
        ?.split(',')
        ?.map((t) => t.trim().toLowerCase())
        ?.includes(pokemonType.toLowerCase())
    )
  );
  console.log('test =', test);

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

  console.log('pokemonsAfterTypeFilter', pokemonsAfterTypeFilter);

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
  console.log('finalPokemons', finalPokemons);

  const paginatedPokemons = finalPokemons.slice(offset, offset + PAGE_SIZE);

  const populatedPokemons = await em.populate(paginatedPokemons, [
    'attacks',
    'evolutions',
  ]);
  console.log('populatedPokemons', populatedPokemons);

  const mappedPokemons = mapPokemon(populatedPokemons);
  console.log('mappedPokemons', mappedPokemons);

  const total = finalPokemons.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const currentPage = page > totalPages ? totalPages : page;

  reply.send({
    results: mappedPokemons,
    total,
    page: currentPage,
    pageSize: PAGE_SIZE,
    totalPages,
  });
  await orm.close();
};
