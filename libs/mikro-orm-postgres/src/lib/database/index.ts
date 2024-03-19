import 'reflect-metadata';
import { MikroORM, ReflectMetadataProvider } from '@mikro-orm/core';
import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { SeedManager } from '@mikro-orm/seeder';
import path = require('path');
import { Pokemon, Evolution, Attack } from './schema';
import { DB_NAME, DB_URL } from '../config';

export const mikroOrmConfig: Options<PostgreSqlDriver> = {
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
};

export const mikroOrm = async (config = mikroOrmConfig) => {
  return await MikroORM.init(config);
};

export { Pokemon, Evolution, Attack };
