import { FastifyInstance } from 'fastify';

import {
  getPokemonById,
  getPokemonTypes,
  getPokemonByName,
  setFavoritePokemon,
  removeFavoritePokemon,
  getPokemons,
} from '../handlers';
import 'reflect-metadata';

const PokemonRoutes = async (server: FastifyInstance) => {
  server.get('/pokemons', getPokemons);
  server.get('/pokemon/:id', getPokemonById);
  server.get('/pokemon/types', getPokemonTypes);
  server.get('/pokemon/name/:name', getPokemonByName);
  server.post('/favorite', setFavoritePokemon);
  server.delete('/favorite', removeFavoritePokemon);
};

export default PokemonRoutes;
