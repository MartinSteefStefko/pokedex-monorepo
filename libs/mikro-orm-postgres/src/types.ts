import { MikroORM, EntityManager, EntityRepository } from '@mikro-orm/core';
import { Pokemon, Evolution, Attack, FavoritePokemon } from '../src/lib';

export type Services = {
  close: any;
  getMigrator: any;
  orm: MikroORM;
  em: EntityManager;
  pokemon: EntityRepository<Pokemon>;
  evolution: EntityRepository<Evolution>;
  attack: EntityRepository<Attack>;
  favoritePokemon: EntityRepository<FavoritePokemon>;
};
