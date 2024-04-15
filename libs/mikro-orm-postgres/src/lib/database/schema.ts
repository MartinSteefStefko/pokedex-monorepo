import {
  Entity,
  PrimaryKey,
  ArrayType,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
} from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity()
export class Pokemon {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property({ type: 'string' })
  name!: string;

  @Property({ type: ArrayType, nullable: true })
  types!: string[];

  @Property({ type: 'string', nullable: true })
  weightMinimum!: string;

  @Property({ type: 'string', nullable: true })
  weightMaximum!: string;

  @Property({ type: 'string', nullable: true })
  heightMinimum!: string;

  @Property({ type: 'string', nullable: true })
  heightMaximum!: string;

  @Property({ type: 'string', nullable: true })
  fleeRate!: string;

  @Property({ type: 'string', nullable: true })
  classification!: string;

  @Property({ type: ArrayType, nullable: true })
  resistant!: string[];

  @Property({ type: ArrayType, nullable: true })
  weaknesses!: string[];

  @Property({ type: 'number', nullable: true })
  maxCP!: number;

  @Property({ type: 'number', nullable: true })
  maxHP!: number;

  @Property({ type: 'number', nullable: true })
  evolutionRequirementAmount!: number;

  @Property({ type: 'string', nullable: true })
  evolutionRequirementName!: string;

  @OneToMany(() => Attack, (attack) => attack.pokemon)
  attacks = new Collection<Attack>(this);

  @OneToMany(() => Evolution, (evolution) => evolution.pokemon)
  evolutions = new Collection<Evolution>(this);

  @OneToMany(() => FavoritePokemon, (favorite) => favorite.pokemon)
  favorites = new Collection<FavoritePokemon>(this);
}

@Entity()
export class Attack {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property({ type: 'string', nullable: true })
  attackType!: 'fast' | 'special';

  @Property({ type: 'string' })
  name!: string;

  @Property({ type: 'string', nullable: true })
  type!: string;

  @Property({ type: 'number', nullable: true })
  damage!: number;

  @ManyToOne(() => Pokemon)
  pokemon!: Pokemon;
}

@Entity()
export class Evolution {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property({ type: 'string' })
  name!: string;

  @ManyToOne(() => Pokemon)
  pokemon!: Pokemon;
}

@Entity()
export class FavoritePokemon {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property({ type: 'string' })
  userId!: string;

  @ManyToOne(() => Pokemon)
  pokemon!: Pokemon;
}
