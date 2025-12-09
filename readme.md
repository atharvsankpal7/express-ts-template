# Auth Service

This is the Authentication Service for the Multi-Tenant Delivery Application. It is built using Node.js, Express, and TypeScript.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Technologies](#technologies)

## Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (Check `.nvmrc` for the specific version)
- [pnpm](https://pnpm.io/) (Package Manager)

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
    PORT=8080
    NODE_ENV="dev"
    ```

## Running the Application

### Development Mode

To run the application in development mode with hot-reloading:

```bash
pnpm run dev
```

This will start the server using `nodemon` on `src/server.ts`.

### Production Build

To compile the TypeScript code to JavaScript:

```bash
pnpm run build
```

The compiled files will be output to the `dist` directory (or wherever `tsc` is configured to output).

## Scripts

Here are the available scripts defined in `package.json`:

- **`pnpm run dev`**: Starts the development server with `nodemon`.
- **`pnpm run build`**: Compiles TypeScript code using `tsc`.
- **`pnpm run format`**: Formats the codebase using Prettier.
- **`pnpm run lint:fix`**: Lints the codebase using ESLint and fixes automatically fixable issues.
- **`pnpm run test`**: Runs tests using Jest in watch mode.
- **`pnpm run prepare`**: Sets up Husky for git hooks.

## Project Structure

```
.
├── .husky/             # Husky git hooks configuration
├── dist/               # Compiled JavaScript files (after build)
├── logs/               # Application logs
├── src/                # Source code
│   └── server.ts       # Entry point of the application
├── .env.example        # Example environment variables
├── .eslintrc.js        # ESLint configuration
├── .prettierrc         # Prettier configuration
├── jest.config.js      # Jest configuration
├── package.json        # Project dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── README.md           # Project documentation
```

## Technologies

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Logging**: Winston
- **Testing**: Jest, Supertest
- **Linting & Formatting**: ESLint, Prettier
- **Tools**: Husky, Lint-staged, Nodemon
