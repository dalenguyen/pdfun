# Use the official lightweight Node.js 20 image.
FROM node:20-slim

RUN apt-get -y update && apt-get -y install ghostscript

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies.
RUN yarn

# Copy local code to the container image.
COPY . ./

# Build the app
RUN npx nx build pdf

# # Copy local code to the container image.
# COPY ./dist/apps/api ./

# Run the web service on container startup.
CMD ["node", "./dist/pdf/analog/server/index.mjs"]
