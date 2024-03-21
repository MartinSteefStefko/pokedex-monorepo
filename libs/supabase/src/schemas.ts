export const sessionSchema = {
  type: 'object',
  properties: {
    access_token: { type: 'string' },
    token_type: { type: 'string', enum: ['bearer'] },
    expires_in: { type: 'number' },
    expires_at: { type: 'number' },
    refresh_token: { type: 'string' },
    user: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        aud: { type: 'string' },
        role: { type: 'string' },
        email: { type: 'string', format: 'email' },
        email_confirmed_at: { type: 'string', format: 'date-time' },
        phone: { type: 'string' },
        confirmed_at: { type: 'string', format: 'date-time' },
        last_sign_in_at: { type: 'string', format: 'date-time' },
        app_metadata: {
          type: 'object',
          properties: {
            provider: { type: 'string' },
            providers: {
              type: 'array',
              items: { type: 'string' },
            },
          },
        },
        user_metadata: {
          type: 'object',
          // Include properties for user_metadata if they're defined
        },
        identities: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              identity_id: { type: 'string' },
              id: { type: 'string' },
              user_id: { type: 'string' },
              identity_data: {
                type: 'object',
                properties: {
                  email: { type: 'string', format: 'email' },
                  email_verified: { type: 'boolean' },
                  phone_verified: { type: 'boolean' },
                  sub: { type: 'string' },
                },
              },
              provider: { type: 'string' },
              last_sign_in_at: { type: 'string', format: 'date-time' },
              created_at: { type: 'string', format: 'date-time' },
              updated_at: { type: 'string', format: 'date-time' },
              email: { type: 'string', format: 'email' },
            },
            required: [
              'identity_id',
              'id',
              'user_id',
              'identity_data',
              'provider',
              'last_sign_in_at',
              'created_at',
              'updated_at',
              'email',
            ],
          },
        },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
        is_anonymous: { type: 'boolean' },
      },
      required: [
        'id',
        'aud',
        'role',
        'email',
        'created_at',
        'updated_at',
        'is_anonymous',
      ],
    },
  },
  required: [
    'access_token',
    'token_type',
    'expires_in',
    'expires_at',
    'refresh_token',
    'user',
  ],
};
