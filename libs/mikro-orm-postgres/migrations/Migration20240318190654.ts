import { Migration } from '@mikro-orm/migrations';

export class Migration20240318190654 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "pokemon" add column "is_favorite" boolean null;');
  }

}
