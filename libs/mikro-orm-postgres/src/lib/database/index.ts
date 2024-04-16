import 'reflect-metadata';
import { MikroORM, ReflectMetadataProvider } from '@mikro-orm/core';
import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { SeedManager } from '@mikro-orm/seeder';
import path = require('path');
import { Pokemon, Evolution, Attack, FavoritePokemon } from './schema';
import { DB_NAME, DB_URL } from '../config';
import { Services } from '../../types';

const mikroOrmConfig: Options<PostgreSqlDriver> = {
  entities: [Pokemon],
  extensions: [Migrator, SeedManager],
  dbName: DB_NAME,
  clientUrl: DB_URL,
  debug: process.env.NODE_ENV !== 'production',
  migrations: {
    path: path.join(__dirname, '../../,,/../../migrations'),
    dropTables: false,
    safe: true,
  },
  driver: PostgreSqlDriver,
  metadataProvider: ReflectMetadataProvider,
  pool: { min: 2, max: 20 },
};

let cache: Services;

export async function initORM(
  options: Options = mikroOrmConfig
): Promise<Services> {
  if (cache) {
    return cache;
  }

  const orm = await MikroORM.init(options);

  // save to cache before returning
  return (cache = {
    orm,
    em: orm.em,
    pokemon: orm.em.getRepository(Pokemon),
    attack: orm.em.getRepository(Attack),
    evolution: orm.em.getRepository(Evolution),
    favoritePokemon: orm.em.getRepository(FavoritePokemon),
    getMigrator: orm.getMigrator(),
    close: orm.close(),
  });
}

export {
  Pokemon,
  Evolution,
  Attack,
  FavoritePokemon,
  DB_NAME,
  DB_URL,
  MikroORM,
  mikroOrmConfig,
};
