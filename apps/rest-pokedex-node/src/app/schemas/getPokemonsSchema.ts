export const getPokemonsSchema = {
  description: 'Get a list of pokemons',
  tags: ['pokemon'],
  summary:
    'Fetches a paginated list of pokemons, with optional filters for search, type, and favorites',

  querystring: {
    type: 'object',
    properties: {
      search: {
        type: 'string',
        description: 'Search term to filter pokemons by name e.g. Pika',
      },
      type: {
        type: 'string',
        description:
          'Filter pokemons by type, comma-separated values e.g. Electric',
      },
      isFavorite: {
        type: 'string',
        description:
          'Filter by favorite pokemons, expected value: "true" or "false"',
      },
      page: {
        type: 'integer',
        default: 1,
        description: 'Page number for pagination',
      },
    },
  },
  response: {
    200: {
      description: 'Successful response with paginated pokemons',
      type: 'object',
      properties: {
        results: {
          type: 'array',
          items: {
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
          },
        },
        total: { type: 'integer' },
        page: { type: 'integer' },
        pageSize: { type: 'integer' },
        totalPages: { type: 'integer' },
      },
    },

    500: {
      description: 'Internal Server Error',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  },
};
