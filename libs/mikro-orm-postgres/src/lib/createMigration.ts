import { MikroORM, mikroOrmConfig } from './database';

const createMigration = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  const migrator = orm.getMigrator();
  const migration = await migrator.createMigration();

  console.log(migration.fileName);
  await orm.close(true);
};

createMigration().catch(console.error);
