export const HOST = process.env.HOST ?? '0.0.0.0';
export const PORT = process.env.REST_AUTH_NODE_PORT
  ? Number(process.env.REST_AUTH_NODE_PORT)
  : 3000;
