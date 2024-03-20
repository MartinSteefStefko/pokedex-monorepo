import { Migration } from '@mikro-orm/migrations';

export class Migration20240320132637 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "favorite_pokemon" ("id" serial primary key, "user_id" varchar(255) not null, "pokemon_id" int not null);');

    this.addSql('alter table "favorite_pokemon" add constraint "favorite_pokemon_pokemon_id_foreign" foreign key ("pokemon_id") references "pokemon" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "pokemon" add column "is_favorite" boolean null;');
  }

}
