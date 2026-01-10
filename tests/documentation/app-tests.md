# Test Suite Documentation

## Overview

This test suite uses **Jest** as the testing framework and **supertest** for HTTP endpoint testing. The tests verify the core functionality of the authentication service.

## Running Tests

```bash
# Run all tests in watch mode
pnpm test

# Run tests without watch mode
npx jest
```

## Test Structure

```
tests/
├── app.spec.ts           # Application health and database tests
├── register.spec.ts      # Registration endpoint tests
└── utils/
    ├── index.ts          # Utility functions
    └── tests.types.ts    # TypeScript type definitions
```

---

## app.spec.ts

Tests application health and database connectivity.

#### Describe: `app`

| Test Name             | Description                                        | Expected Result |
| --------------------- | -------------------------------------------------- | --------------- |
| `app health`          | Verifies the `/health` endpoint responds correctly | HTTP 200        |
| `non-matching routes` | Tests that unknown routes return 404               | HTTP 404        |

#### Describe: `db`

| Test Name                 | Description                             | Expected Result              |
| ------------------------- | --------------------------------------- | ---------------------------- |
| `db connection`           | Verifies database connection is working | Returns `ok: 1`              |
| `db has read permission`  | Tests read access to the users table    | Executes successfully        |
| `db has write permission` | Tests write access to the users table   | Inserts and retrieves record |

---

## Utilities

### `truncateAllTables()`

Cleans all tables in the database before each test to ensure test isolation.

**Location:** `tests/utils/index.ts`

```typescript
export async function truncateAllTables()
```

- Uses PostgreSQL dynamic SQL to truncate all tables
- Runs with `CASCADE` to handle foreign key constraints
- Called in `beforeEach` hooks for registration tests

### TypedResponse<T>

Custom type that extends supertest's Response with typed body.

**Location:** `tests/utils/tests.types.ts`

```typescript
export type TypedResponse<T> = Omit<Response, "body"> & { body: T }
```

---

## Status Codes Expected

| Code | Meaning     | Used For                |
| ---- | ----------- | ----------------------- |
| 200  | OK          | Health check            |
| 201  | Created     | Successful registration |
| 400  | Bad Request | Missing/invalid fields  |
| 404  | Not Found   | Unknown routes          |
| 409  | Conflict    | Duplicate email         |
