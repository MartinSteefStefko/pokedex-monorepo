# Use the official Node.js 18 image as a parent image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install git, as your instructions indicate it's required
RUN apt-get update && apt-get install -y git

# Install pnpm globally
RUN npm install -g pnpm

# Copy the package.json file and pnpm-lock.yaml to the working directory
COPY pnpm-lock.yaml package.json ./

# Install project dependencies using pnpm
RUN pnpm install

RUN pnpm install reflect-metadata

# Copy the rest of your application's source code to the working directory
COPY . .

EXPOSE 3000
EXPOSE 3001

# Build the application using the TypeScript Compiler
