import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Pokemon, Evolution, Attack } from '../database/schema';
import { pokemons } from './pokemons';

import { AttackTypeEnum } from '../enums';
import { MikroORM, mikroOrmConfig } from '../database';
import { v4 } from 'uuid';

class PokemonSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    await Promise.all(
      pokemons.map(async (pokemonData) => {
        const pokemonId = v4();
        const pokemonEntity =
          (await em.findOne(Pokemon, pokemonId)) ??
          em.create(Pokemon, {
            id: pokemonId,
            name: pokemonData.name,
            types: pokemonData.types,
            weightMinimum: pokemonData.weight.minimum,
            weightMaximum: pokemonData.weight.maximum,
            heightMinimum: pokemonData.height.minimum,
            heightMaximum: pokemonData.height.maximum,
            classification: pokemonData.classification,
            fleeRate: pokemonData.fleeRate.toString(),
            resistant: pokemonData.resistant,
            weaknesses: pokemonData.weaknesses,
            maxCP: pokemonData.maxCP,
            maxHP: pokemonData.maxHP,
            evolutionRequirementAmount:
              pokemonData.evolutionRequirements?.amount,
            evolutionRequirementName: pokemonData.evolutionRequirements?.name,
          });

        if (!(await em.findOne(Pokemon, pokemonId))) {
          em.persist(pokemonEntity);
        }

        const attackPromises = [
          ...pokemonData.attacks.fast.map((attack) =>
            this.createAttackEntity(
              em,
              attack,
              AttackTypeEnum.FAST,
              pokemonEntity
            )
          ),
          ...pokemonData.attacks.special.map((attack) =>
            this.createAttackEntity(
              em,
              attack,
              AttackTypeEnum.SPECIAL,
              pokemonEntity
            )
          ),
        ];

        await Promise.all(attackPromises);
      })
    );

    await em.flush();

    await Promise.all(
      pokemons.map(async (pokemonData) => {
        const pokemonEntity = await em.findOneOrFail(Pokemon, {
          name: pokemonData.name,
        });

        if (pokemonData.evolutions) {
          await Promise.all(
            pokemonData.evolutions.map(async (evolutionData) => {
              await this.createEvolutionEntity(
                em,
                evolutionData,
                pokemonEntity
              );
            })
          );
        }
      })
    );

    await em.flush();
  }

  private async createAttackEntity(
    em: EntityManager,
    attackData: { name: string; type: string; damage: number },
    attackType: 'fast' | 'special',
    pokemon: Pokemon
  ) {
    const attackId = v4();
    const existingAttack = await em.findOne(Attack, { id: attackId });
    const attackEntity =
      existingAttack ??
      em.create(Attack, {
        id: attackId,
        ...attackData,
        attackType,
        pokemon,
      });
    if (!existingAttack) {
      em.persist(attackEntity);
    }
  }

  private async createEvolutionEntity(
    em: EntityManager,
    evolutionData: { name: string },
    pokemon: Pokemon
  ) {
    const evolutionId = v4();
    const evolutionEntity = em.create(Evolution, {
      ...evolutionData,
      id: evolutionId,
      pokemon,
    });
    em.persist(evolutionEntity);
  }
}

export const seedDatabase = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  const em = orm.em.fork();
  const seeder = new PokemonSeeder();

  await seeder.run(em);
  await orm.close(true);
  console.log('Seeding complete.');
};

seedDatabase().catch(console.error);
