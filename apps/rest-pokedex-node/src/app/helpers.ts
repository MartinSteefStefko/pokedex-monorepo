export const mapPokemon = (input) => {
  const pokemons = Array.isArray(input) ? input : [input];

  const mappedPokemons = pokemons.map((pokemon) => ({
    id: String(pokemon.id),
    name: pokemon.name,
    classification: pokemon.classification,
    types: pokemon.types,
    resistant: pokemon.resistant,
    weaknesses: pokemon.weaknesses,
    weight: {
      minimum: pokemon.weightMinimum,
      maximum: pokemon.weightMaximum,
    },
    height: {
      minimum: pokemon.heightMinimum,
      maximum: pokemon.heightMaximum,
    },
    fleeRate: pokemon.fleeRate,
    evolutionRequirements: pokemon.evolutionRequirements
      ? {
          amount: pokemon.evolutionRequirements.amount,
          name: pokemon.evolutionRequirements.name,
        }
      : undefined,
    evolutions: pokemon.evolutions
      ? pokemon.evolutions.map((evolution) => ({
          id: String(evolution.id),
          name: evolution.name,
        }))
      : [],
    maxCP: pokemon.maxCP,
    maxHP: pokemon.maxHP,
    attacks: {
      fast: pokemon.attacks
        ? pokemon.attacks
            .filter((attack) => attack.attackType === 'fast')
            .map((attack) => ({
              name: attack.name,
              type: attack.type,
              damage: attack.damage,
            }))
        : [],
      special: pokemon.attacks
        ? pokemon.attacks
            .filter((attack) => attack.attackType === 'special')
            .map((attack) => ({
              name: attack.name,
              type: attack.type,
              damage: attack.damage,
            }))
        : [],
    },
  }));
  // If the original input was not an array, return the first mapped element.
  return Array.isArray(input) ? mappedPokemons : mappedPokemons[0];
};
