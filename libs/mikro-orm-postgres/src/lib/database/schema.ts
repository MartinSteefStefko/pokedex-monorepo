import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
} from '@mikro-orm/core';

@Entity()
export class Pokemon {
  @PrimaryKey({ type: 'number' })
  id!: number;

  @Property({ type: 'string' })
  name!: string;

  @Property({ columnType: 'text[]', nullable: true, type: 'string' }) // Ensure correct type specification for arrays
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

  @Property({ columnType: 'text[]', nullable: true, type: 'string' }) // Ensure correct type specification for arrays
  resistant!: string[];

  @Property({ columnType: 'text[]', nullable: true, type: 'string' }) // Ensure correct type specification for arrays
  weaknesses!: string[];

  @Property({ type: 'number', nullable: true })
  maxCP!: number;

  @Property({ type: 'number', nullable: true })
  maxHP!: number;

  @Property({ type: 'number', nullable: true })
  evolutionRequirementAmount!: number;

  @Property({ type: 'string', nullable: true })
  evolutionRequirementName!: string;

  @Property({ type: 'boolean', nullable: true })
  isFavorite!: boolean;

  @OneToMany(() => Attack, (attack) => attack.pokemon)
  attacks = new Collection<Attack>(this);

  @OneToMany(() => Evolution, (evolution) => evolution.pokemon)
  evolutions = new Collection<Evolution>(this);
}

@Entity()
export class Attack {
  @PrimaryKey({ type: 'number' })
  id!: number;

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
  @PrimaryKey({ type: 'number' })
  id!: number;

  @Property({ type: 'string' })
  name!: string;

  @ManyToOne(() => Pokemon)
  pokemon!: Pokemon;
}
