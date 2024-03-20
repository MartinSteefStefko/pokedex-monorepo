export const HOST = process.env.HOST ?? 'localhost';
export const PORT = process.env.REST_AUTH_NODE_PORT
  ? Number(process.env.REST_AUTH_NODE_PORT)
  : 3000;
