# Use the official Node.js image as our base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package.json and pnpm-lock.yaml first to leverage Docker cache
COPY package.json pnpm-lock.yaml ./

# Install app dependencies
RUN pnpm install

# Copy the rest of our app's source code into the container
COPY . .

# Expose the port the app will run on
EXPOSE 8081

# The command to run our app
CMD ["pnpm", "run", "dev"]