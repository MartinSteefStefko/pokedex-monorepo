import { mikroOrmPostgres } from './mikro-orm-postgres';

describe('mikroOrmPostgres', () => {
  it('should work', () => {
    expect(mikroOrmPostgres()).toEqual('mikro-orm-postgres');
  });
});
