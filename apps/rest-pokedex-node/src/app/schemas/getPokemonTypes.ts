export const getPokemonTypesSchema = {
  description: 'Get all pokemon types',
  tags: ['pokemon'],
  summary: 'Fetches all unique pokemon types',
  response: {
    200: {
      description: 'Successful response',
      type: 'object',
      properties: {
        types: {
          type: 'array',
          items: { type: 'string' },
          uniqueItems: true,
        },
      },
    },
    500: {
      description: 'Internal Server Error',
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
};
