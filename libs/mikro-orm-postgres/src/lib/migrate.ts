import { mikroOrm } from './database';

export const runMigrations = async () => {
  const orm = await mikroOrm();
  const migrator = orm.getMigrator();

  try {
    await migrator.up();
    console.log('Migrations successfully run');
  } catch (e) {
    console.error('Error running migrations', e);
    process.exit(1);
  } finally {
    await orm.close(true);
  }
};

runMigrations().catch((e) => {
  console.error('Error during migrations', e);
});
