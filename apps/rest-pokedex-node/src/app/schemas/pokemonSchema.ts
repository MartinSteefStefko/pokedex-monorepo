export const pokemonSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    classification: { type: 'string' },
    types: {
      type: 'array',
      items: { type: 'string' },
    },
    resistant: {
      type: 'array',
      items: { type: 'string' },
    },
    weaknesses: {
      type: 'array',
      items: { type: 'string' },
    },
    weight: {
      type: 'object',
      properties: {
        minimum: { type: 'string' },
        maximum: { type: 'string' },
      },
    },
    height: {
      type: 'object',
      properties: {
        minimum: { type: 'string' },
        maximum: { type: 'string' },
      },
    },
    fleeRate: { type: 'number' },
    evolutionRequirements: {
      type: 'object',
      properties: {
        amount: { type: 'number' },
        name: { type: 'string' },
      },
    },
    evolutions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          name: { type: 'string' },
        },
      },
    },
    maxCP: { type: 'number' },
    maxHP: { type: 'number' },
    attacks: {
      type: 'object',
      properties: {
        fast: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              type: { type: 'string' },
              damage: { type: 'number' },
            },
          },
        },
        special: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              type: { type: 'string' },
              damage: { type: 'number' },
            },
          },
        },
      },
    },
  },
  required: ['id', 'name', 'types', 'attacks'],
};
