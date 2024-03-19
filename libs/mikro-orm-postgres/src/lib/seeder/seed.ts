import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Pokemon, Evolution, Attack } from '../database/schema';
import { pokemons } from './pokemons';
import { mikroOrm } from '../database';
import { AttackTypeEnum } from '../enums';

class PokemonSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    await Promise.all(
      pokemons.map(async (pokemonData) => {
        const pokemonId = parseInt(pokemonData.id, 10);
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
        const evolutionPromises =
          pokemonData.evolutions?.map((evolution) =>
            this.createEvolutionEntity(em, evolution, pokemonEntity)
          ) || [];

        await Promise.all([...attackPromises, ...evolutionPromises]);
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
    const existingAttack = await em.findOne(Attack, {
      name: attackData.name,
      type: attackData.type,
      pokemon,
    });
    const attackEntity =
      existingAttack ??
      em.create(Attack, {
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
    evolutionData: { id: number; name: string },
    pokemon: Pokemon
  ) {
    const existingEvolution = await em.findOne(Evolution, {
      id: evolutionData.id,
    });

    const evolutionEntity =
      existingEvolution ?? em.create(Evolution, evolutionData);

    if (!existingEvolution) {
      evolutionEntity.pokemon = pokemon;
      em.persist(evolutionEntity);
    } else {
      evolutionEntity.name = evolutionData.name;
    }
  }
}

export const seedDatabase = async () => {
  const orm = await mikroOrm();
  const em = orm.em.fork();
  const seeder = new PokemonSeeder();

  await seeder.run(em);
  await orm.close(true);
  console.log('Seeding complete.');
};

seedDatabase().catch(console.error);
