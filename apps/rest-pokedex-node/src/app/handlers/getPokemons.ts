import { FastifyRequest, FastifyReply } from 'fastify';
import { PokemonQueryParams } from './types';
import {
  FavoritePokemon,
  mikroOrm,
  Pokemon,
} from '@pokedex-monorepo/mikro-orm-postgres';
import { PAGE_SIZE } from '../constants';
import { PokemonRelations } from '../enums';
import { SupabaseUser } from '@pokedex-monorepo/supabase';

export const getPokemons = async (
  request: FastifyRequest<{
    Querystring: PokemonQueryParams;
    Params: { user: SupabaseUser };
    Body: { user: SupabaseUser };
  }>,
  reply: FastifyReply
) => {
  console.log('hello');
  console.log('Pokemon', Pokemon);

  const orm = await mikroOrm();
  console.log('orm', orm);
  const em = orm.em.fork();
  const userId = request.body.user?.identities?.[0]?.identity_data?.sub;

  const { search, type, isFavorite } = request.query;
  const initialPage = +request.query.page || 1;
  const offset = (initialPage - 1) * PAGE_SIZE;
  console.log('isFavorite', isFavorite);
  console.log('type', type);
  console.log('esarch', search);

  const qb = em.createQueryBuilder(Pokemon);
  console.log('qb', qb);

  if (type) {
    const typesArray = type.split(',').map((t) => t.trim().toLowerCase());
    qb.limit(PAGE_SIZE).offset(offset);
    const filteredPokemons = (await em.find(Pokemon, {})).filter((pokemon) =>
      pokemon.types.some((pokemonType) =>
        typesArray.includes(pokemonType.toLowerCase())
      )
    );
    const populatedPokemons = await em.populate(filteredPokemons, [
      'attacks',
      'evolutions',
    ]);
    const total = await qb.getCount();
    const totalPages = Math.ceil(total / PAGE_SIZE);
    const totalPerPage = populatedPokemons?.length;
    const page = initialPage > totalPages ? totalPages : initialPage;

    reply.send({
      results: populatedPokemons,
      totalPerPage,
      total,
      page,
      pageSize: PAGE_SIZE,
      totalPages,
    });
  }

  if (search) {
    console.log('search', search);
    qb.andWhere({ name: { $ilike: `%${search}%` } });
  }

  if (isFavorite) {
    const favoritePokemons = await em.find(FavoritePokemon, { userId });
    console.log('favoritePokemons', favoritePokemons);
    const favoritePokemonIds = favoritePokemons.map((fp) => fp.pokemon.id);
    console.log('favoritePokemonIds', favoritePokemonIds);
    const pokemons = await em.find(Pokemon, {
      id: { $in: favoritePokemonIds },
    });
    console.log('pokemons', pokemons);

    const populatedPokemons = await em.populate(pokemons, [
      'attacks',
      'evolutions',
    ]);
    console.log('oppulatedPokemons', populatedPokemons);

    const total = favoritePokemons.length;
    const totalPages = Math.ceil(total / PAGE_SIZE);
    const page = initialPage > totalPages ? totalPages : initialPage;

    return reply.send({
      results: populatedPokemons,
      total,
      page,
      pageSize: PAGE_SIZE,
      totalPages,
    });
  }

  qb.limit(PAGE_SIZE).offset(offset);

  const result = await qb.getResultList();
  const populatedPokemons = await em.populate(result, [
    PokemonRelations?.ATTACKS,
    PokemonRelations?.EVOLUTIONS,
  ]);
  const total = await qb.getCount();
  const totalPerPage = populatedPokemons?.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const page = initialPage > totalPages ? totalPages : initialPage;

  reply.send({
    results: populatedPokemons,
    totalPerPage,
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages,
  });
};
