#!/bin/bash

# Remove old builders if present in dist directory
rm -rf dist/*

# Get Nx version from package.json
NX_VERSION=$(npm show nx version)

# Install globally Nx with specific version
npm install -g nx@$NX_VERSION

# Install globally pnpm
npm install -g pnpm

# Run Nx build for rest-pokedex-node
pnpm nx build rest-pokedex-node

# Run Nx build for rest-auth-node
pnpm nx build rest-auth-node

# Run docker-compose up with --build flag
docker-compose up --build