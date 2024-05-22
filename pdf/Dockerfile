# Use the official lightweight Node.js 20 image.
FROM node:20-slim

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy local code to the container image.
COPY . ./

# Run the web service on container startup.
CMD ["node", "./server/index.mjs"]
