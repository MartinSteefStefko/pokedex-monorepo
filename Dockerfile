FROM node:18.17.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN pnpm install

COPY . .

EXPOSE 3000

CMD ["ts-node", "apps/rest/pokedex/node/src/main.ts"]