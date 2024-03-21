#!/bin/bash

NX_VERSION=$(npm show nx version)

npm install -g nx@$NX_VERSION

npm install -g pnpm

pnpm nx build rest-pokedex-node

pnpm nx build rest-auth-node

docker-compose up --build