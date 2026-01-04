# Auth Service

This is the Authentication Service for the Multi-Tenant Delivery Application. It is built using Node.js, Express, and TypeScript with PostgreSQL as the database.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Docker](#docker)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Technologies](#technologies)

## Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (Check `.nvmrc` for the specific version)
- [pnpm](https://pnpm.io/) (Package Manager)
- [Docker](https://www.docker.com/) (Optional, for containerized development)

## Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/atharvsankpal7/pizza-store-auth.git
    cd auth
    ```

2.  Install dependencies using pnpm:

    ```bash
    pnpm install
    ```

3.  Prepare Husky hooks (automatically runs after install, but if needed):

    ```bash
    pnpm run prepare
    ```

## Configuration

1.  Create a `.env` file in the root directory based on the example provided:

    ```bash
    cp .env.example .env
    ```

2.  Open `.env` and configure the environment variables:

    ```env
    PORT=8081
    NODE_ENV="development"
    DB_URI=postgresql://root:root@localhost:5432/auth
    ```

3.  Create a `.env.test` file for testing environment:

    ```bash
    cp .env.test.example .env.test
    ```

## Database Setup

This service uses PostgreSQL with Drizzle ORM.

### Using Docker (Recommended)

Run the following command to set up a PostgreSQL container:

```bash
pnpm run postgres:dev
```

This will pull the PostgreSQL 17 image, create a volume for data persistence, and start the container.

### Database Migrations

Generate migrations with Drizzle Kit:

```bash
pnpm exec drizzle-kit generate
```

## Running the Application

### Development Mode

To run the application in development mode with hot-reloading:

```bash
pnpm run dev
```

This will start the server using `nodemon` on `src/index.ts`.

### Production Build

To compile the TypeScript code to JavaScript:

```bash
pnpm run build
```

The compiled files will be output to the `dist` directory.

## Docker

### Build and Run with Docker

Build the Docker image:

```bash
pnpm run docker:build
```

Run the container:

```bash
pnpm run docker:run
```

Or build and run in one command:

```bash
pnpm run docker:dev
```

## Scripts

Here are the available scripts defined in `package.json`:

- **`pnpm run dev`**: Starts the development server with `nodemon`.
- **`pnpm run build`**: Compiles TypeScript code using `tsc`.
- **`pnpm run format`**: Formats the codebase using Prettier.
- **`pnpm run lint:fix`**: Lints the codebase using ESLint and fixes automatically fixable issues.
- **`pnpm run test`**: Runs tests using Jest in watch mode.
- **`pnpm run prepare`**: Sets up Husky for git hooks.
- **`pnpm run docker:build`**: Builds the Docker image for development.
- **`pnpm run docker:run`**: Runs the Docker container.
- **`pnpm run docker:dev`**: Builds and runs the Docker container.
- **`pnpm run postgres:install`**: Pulls PostgreSQL image and creates a volume.
- **`pnpm run postgres:run`**: Starts a PostgreSQL container.
- **`pnpm run postgres:dev`**: Installs and runs PostgreSQL in one command.

## Project Structure

```
.
├── .husky/                 # Husky git hooks configuration
├── dist/                   # Compiled JavaScript files (after build)
├── docker/                 # Docker configuration files
├── drizzle/                # Drizzle migration files
├── logs/                   # Application logs
├── src/
│   ├── config/             # Configuration files (logger, env)
│   ├── controllers/        # Route controllers
│   ├── drizzle/            # Database schema and connection
│   ├── middleware/         # Express middleware
│   ├── routes/             # API route definitions
│   ├── test/               # Test files
│   ├── utils/              # Utility functions
│   ├── validationSchemas/  # Zod validation schemas
│   ├── app.ts              # Express app setup
│   └── index.ts            # Entry point
├── .env.example            # Example environment variables
├── drizzle.config.ts       # Drizzle Kit configuration
├── eslint.config.mjs       # ESLint configuration
├── jest.config.js          # Jest configuration
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

## Technologies

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Validation**: Zod
- **Logging**: Winston
- **Testing**: Jest, Supertest
- **Linting & Formatting**: ESLint, Prettier
- **Tools**: Husky, Lint-staged, Nodemon, Docker
