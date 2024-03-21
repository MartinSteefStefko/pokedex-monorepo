import { FastifyInstance } from 'fastify';

import {
  getPokemonById,
  getPokemonTypes,
  getPokemonByName,
  setFavoritePokemon,
  removeFavoritePokemon,
  getPokemons,
} from '../handlers';
import {
  getPokemonByIdSchema,
  getPokemonByNameSchema,
  getPokemonTypesSchema,
  getPokemonsSchema,
  removeFavoritePokemonSchema,
  setFavoritePokemonSchema,
} from '../schemas';
import 'reflect-metadata';

const PokemonRoutes = async (server: FastifyInstance) => {
  server.get(
    '/pokemons',
    {
      schema: getPokemonsSchema,
    },
    getPokemons
  );
  server.get(
    '/pokemon/:id',
    {
      schema: getPokemonByIdSchema,
    },
    getPokemonById
  );
  server.get(
    '/pokemon/types',
    {
      schema: getPokemonTypesSchema,
    },
    getPokemonTypes
  );
  server.get(
    '/pokemon/name/:name',
    {
      schema: getPokemonByNameSchema,
    },
    getPokemonByName
  );
  server.post(
    '/favorite',
    {
      schema: setFavoritePokemonSchema,
    },
    setFavoritePokemon
  );
  server.delete(
    '/favorite',
    {
      schema: removeFavoritePokemonSchema,
    },
    removeFavoritePokemon
  );
};

export default PokemonRoutes;
