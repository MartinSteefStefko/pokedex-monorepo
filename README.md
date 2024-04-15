# Pokedex Monorepo

> The backend for pokedex api with identity solution.

![Charmeleon Logo](./assets/charmeleon_logo.png)

# How to run

## Start the application

### Prerequisites

node with npm imstalled
pnpm installed

### Run

There 2 applications:

rest-pokedex-node
rest-auth-node

Run `pnpm nx serve <app_name> --watch` to start the development servers. Both are needed to complete the flow.

Note: If new fastify app cannot find the library, remove node_modules. pnpn-lock.yaml and do:
`pnpm i`

## Run with docker

### Prerequisites

docker and docker-compose installed

Pls follow the instructions how to install it on your system, especially Wsl or Git Bash

### Run

Mac / Linux / Wsl / Git Bash

chmod +x docker-up-build.sh && ./docker-up-build.sh

## Build for production

Run `pnpm nx build rest_pokedex_node` or `pnpm nx build rest_auth_node` to build the application. The build artifacts are stored in the output directory (e.g. `dist/` or `build/`), ready to be deployed.

# Working with libraries

There are 2 libraries:

@pokedex-monorepo/mikro-orm-postgres
@pokedex-monorepo/supabase

Every time you want to interact with the pokemon api or user/s identity pls priorize importing from them. You can enhance it if needed.

# Usage example

Start the rest-pokedex-node and go to the [rest-pokedex-node documentation](http://localhost:3000/documentation)

Start the rest-auth-node and go to the [rest-auth-node documentation](http://localhost:3001/documentation)

# Database

Make migrations: `pnpm nx run mikro-orm-postgres:create-migration`
Migrate: `pnpm nx run mikro-orm-postgres:migrate`
Seed: `pnpm nx run mikro-orm-postgres:seed`

# Documentation

[rest-pokedex-node documentation](http://localhost:3000/documentation)
[rest-auth-node documentation](http://localhost:3001/documentation)

# Release History

- 0.1.0
  - The Typescript, Node.js pokemon api, identity provider

# Meta

Distributed under the MIT license. See `LICENSE` for more information.

<https://github.com/pokedex-monorepo//blob/master/LICENSE.txt>

# Contributing

1. Fork it (<https://github.com/MartinSteefStefko/ecomarketcap-monorepo>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request.
