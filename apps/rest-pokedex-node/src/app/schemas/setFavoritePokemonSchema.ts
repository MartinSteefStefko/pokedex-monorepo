export const setFavoritePokemonSchema = {
  description: 'Mark a pokemon as favorite',
  tags: ['favorite'],
  summary: 'Marks a pokemon as favorite for a user',
  body: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'ID of the pokemon to mark as favorite e.g. 1',
      },
    },
    required: ['id'],
  },
  response: {
    200: {
      description: 'Pokemon successfully marked as favorite',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
    400: {
      description: 'Pokemon already marked as favorite',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
    404: {
      description: 'Pokemon not found',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  },
};
