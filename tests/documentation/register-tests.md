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

### register.spec.ts

Tests the `POST /auth/register` endpoint.

#### Test Data

```typescript
const userData = {
  fullName: "test user",
  email: "test@email.com",
  password: "testP@ssw0rd",
}
```

#### Describe: `POST /auth/register`

##### Given: All Valid Fields

| Test Name                           | Description                          | Expected Result                   |
| ----------------------------------- | ------------------------------------ | --------------------------------- |
| `should return 201`                 | Valid registration request           | HTTP 201 Created                  |
| `should return json`                | Response content type is JSON        | `content-type` includes "json"    |
| `should return id of created user`  | Response includes user ID            | ID is a number type               |
| `creates a user`                    | Verifies user exists in database     | User record is defined            |
| `hashes the password before saving` | Password is not stored in plain text | Saved password differs from input |

##### Given: Missing Fields

| Test Name                                    | Missing Field | Expected Result      |
| -------------------------------------------- | ------------- | -------------------- |
| `should return 400 when fullName is missing` | fullName      | HTTP 400 Bad Request |
| `should return 400 when email is missing`    | email         | HTTP 400 Bad Request |
| `should return 400 when password is missing` | password      | HTTP 400 Bad Request |

##### Given: Invalid Email Format

| Test Name                                 | Description             | Expected Result      |
| ----------------------------------------- | ----------------------- | -------------------- |
| `should return 400 when email is invalid` | Email format validation | HTTP 400 Bad Request |

##### Given: Duplicate Email

| Test Name                                   | Description               | Expected Result   |
| ------------------------------------------- | ------------------------- | ----------------- |
| `should return 409 when email is duplicate` | Duplicate email rejection | HTTP 409 Conflict |

---

## Test Setup

### Before Each

- `register.spec.ts` calls `truncateAllTables()` before every test to ensure clean state
