export const removeFavoritePokemonSchema = {
  description: 'Remove a pokemon from favorites',
  tags: ['favorite'],
  summary: "Removes a pokemon from the user's favorite list",
  body: {
    type: 'object',
    properties: {
      id: {
        type: 'number',
        description: 'ID of the pokemon to remove from favorites e.g. 1',
      },
    },
    required: ['id'],
  },
  response: {
    200: {
      description: 'Pokemon successfully removed from favorites',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
    404: {
      description: 'Pokemon not found or not in favorites',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
    500: {
      description: 'Internal server error',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  },
};
