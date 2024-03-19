import { FastifyInstance } from 'fastify';

import {
  getPokemonById,
  getFavoritePokemons,
  setFavoritePokemon,
  removeFavoritePokemon,
  getAllPokemons,
} from '../handlers';
import 'reflect-metadata';

const PokemonRoutes = async (server: FastifyInstance) => {
  server.get('/pokemons', getAllPokemons);
  server.get('/pokemon/:id', getPokemonById);
  server.get('/favorites', getFavoritePokemons);
  server.post('/favorite/:id', setFavoritePokemon);
  server.delete('/favorite/:id', removeFavoritePokemon);
};

export default PokemonRoutes;
