# Task Manager — Backend API

REST API for the Task Manager application. Handles authentication, user management, task CRUD, and statistics with role-based access control.

## Stack

| Layer             | Technology                                      |
|-------------------|-------------------------------------------------|
| Runtime           | Node.js 22+                                     |
| Framework         | Express 5                                       |
| Language          | TypeScript 6                                    |
| ORM               | Prisma 7 + LibSQL adapter                       |
| Database          | SQLite (`data/dev.db`)                          |
| Auth              | JWT access token + opaque refresh token (cookie)|
| Validation        | Zod 4                                           |
| Password hashing  | bcrypt 6                                        |
| Package manager   | pnpm                                            |

---

## Quick Start

**1. Install dependencies**
```bash
pnpm install
```

**2. Configure environment variables**
```bash
cp .env.example .env
```
Open `.env` and set a value for `JWT_SECRET` before continuing.

**3. Set up the database**
```bash
pnpm setup
```
Runs in order: `prisma generate` → `prisma migrate dev` → seed. Only needed the first time.

**4. Start the server**
```bash
pnpm dev
```
The server is available at `http://localhost:5001`.

---

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma          # Data models and enums
│   ├── seed.ts                # Seeds 4 users and sample tasks
│   └── migrations/            # SQL migration history
├── src/
│   ├── config/env.ts          # Environment variable validation (Zod)
│   ├── lib/prisma.ts          # PrismaClient singleton (LibSQL adapter)
│   ├── errors/app-error.ts    # AppError class for operational errors
│   ├── types/express/         # Augments Request with req.user
│   ├── middleware/
│   │   ├── auth.middleware.ts         # requireAuth — validates Bearer token
│   │   ├── role.middleware.ts         # requireRole(...roles)
│   │   ├── validate.middleware.ts     # validate(zodSchema, part)
│   │   └── error-handler.middleware.ts
│   └── modules/
│       ├── auth/        # register, login, refresh, logout
│       ├── users/       # CRUD (admin-restricted)
│       ├── tasks/       # CRUD (owner or admin)
│       └── statistics/  # Aggregated counts (admin-only)
├── generated/prisma/          # Auto-generated Prisma client (do not edit)
├── data/dev.db                # SQLite file (gitignored)
├── prisma.config.ts           # Prisma 7 CLI configuration
├── Dockerfile
└── docker-compose.yml
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values.

| Variable       | Required | Default                 | Description                                   |
|----------------|----------|-------------------------|-----------------------------------------------|
| `DATABASE_URL` | yes      | `file:./data/dev.db`    | SQLite path (or PostgreSQL URI when migrating) |
| `JWT_SECRET`   | yes      | —                       | Secret for signing access tokens (min 10 chars)|
| `PORT`         | no       | `5001`                  | HTTP port                                      |
| `NODE_ENV`     | no       | `development`           | `development`, `production`, or `test`         |
| `FRONTEND_URL` | no       | `http://localhost:5173` | Allowed CORS origin                            |

> **Note (Prisma 7):** The `DATABASE_URL` used by the Prisma CLI is read from `prisma.config.ts`, not from `schema.prisma`. The runtime client receives it via the LibSQL adapter in `src/lib/prisma.ts`.

---

## Scripts

| Script                 | Description                                           |
|------------------------|-------------------------------------------------------|
| `pnpm dev`             | Start with hot reload (`tsx watch`)                   |
| `pnpm build`           | Compile TypeScript to `dist/`                         |
| `pnpm start`           | Run compiled output                                   |
| `pnpm setup`           | generate + migrate + seed (run once after install)    |
| `pnpm seed`            | Repopulate the database with sample data              |
| `pnpm prisma:generate` | Regenerate Prisma client from schema                  |
| `pnpm prisma:migrate`  | Create and apply a new migration (dev)                |
| `pnpm prisma:deploy`   | Apply existing migrations (production / Docker)       |
| `pnpm prisma:reset`    | Drop database and re-run all migrations               |
| `pnpm prisma:studio`   | Open Prisma Studio (visual database browser)          |

---

## API Reference

Base URL: `http://localhost:5001/api`

### Auth — `/api/auth`

Public routes — no token required.

| Method | Endpoint         | Body                        | Response                                           |
|--------|------------------|-----------------------------|----------------------------------------------------|
| POST   | `/auth/register` | `{ name, email, password }` | `201 { id, name, email, rol }`                     |
| POST   | `/auth/login`    | `{ email, password }`       | `200 { accessToken, user }` + `refreshToken` cookie|
| POST   | `/auth/refresh`  | —                           | `200 { accessToken }` + rotated cookie             |
| POST   | `/auth/logout`   | —                           | `200 { message }` + clears cookie                  |

**Token configuration:**

| Token          | Type              | Duration | Storage                        | Details                              |
|----------------|-------------------|----------|--------------------------------|--------------------------------------|
| Access token   | JWT (HS256)       | 15 min   | `localStorage` (client-side)  | Payload: `{ id, rol }`. Signed with `JWT_SECRET`. |
| Refresh token  | Opaque (hex)      | 7 days   | `refresh_tokens` table (DB) + `httpOnly` cookie | 80-char random hex string (`randomBytes(40)`). Rotated on every use. Revocable by setting `revokedAt`. |

**Token flow:**
- `login` returns the access token in the response body and sets the refresh token as an `httpOnly` cookie.
- `refresh` validates the cookie against the DB (checks `revokedAt` and `expiresAt`), revokes the old token, issues a new one (rotation), and returns a new access token.
- `logout` marks the refresh token as revoked in the DB and clears the cookie.
- All protected endpoints require `Authorization: Bearer <accessToken>`.

**Password rules:**
- Minimum 7 characters
- No spaces allowed
- At least one lowercase letter
- At least one uppercase letter
- At least one number
- At least one special character (`!`, `@`, `#`, `$`, `%`, `^`, `&`, `*`, etc.)

Stored as a bcrypt hash (10 salt rounds) — plain text is never persisted.

---

### Users — `/api/users`

Requires `Authorization: Bearer <token>`.

| Method | Endpoint      | Auth          | Description                            |
|--------|---------------|---------------|----------------------------------------|
| GET    | `/users`      | Admin         | List all users (no passwords)          |
| GET    | `/users/:id`  | Self or Admin | Get a single user                      |
| POST   | `/users`      | Admin         | Create a user                          |
| PUT    | `/users/:id`  | Self or Admin | Update a user                          |
| DELETE | `/users/:id`  | Admin         | Delete a user                          |

- Regular users (`Usuario`) can only update `name` and `password` — `email` and `rol` are locked.
- Passwords are never included in any response.

---

### Tasks — `/api/tasks`

Requires `Authorization: Bearer <token>`.

| Method | Endpoint      | Auth           | Description                                       |
|--------|---------------|----------------|---------------------------------------------------|
| GET    | `/tasks`      | Any            | Admin sees all tasks; user sees only their own    |
| GET    | `/tasks/:id`  | Owner or Admin | Get a single task                                 |
| POST   | `/tasks`      | Any            | Create a task (userId always set from token)      |
| PUT    | `/tasks/:id`  | Owner or Admin | Update a task (partial updates supported)         |
| DELETE | `/tasks/:id`  | Owner or Admin | Delete a task                                     |

- Admin can filter by `GET /tasks?userId=<id>`.
- Any `userId` in the request body is ignored on creation.

**Field values:**
- `priority`: `Alta` | `Media` | `Baja`
- `status`: `Pendiente` | `Progreso` | `Completada`
- `date`: `YYYY-MM-DD`

---

### Statistics — `/api/statistics`

Requires `Administrador` role.

| Method | Endpoint       | Response                                                        |
|--------|----------------|-----------------------------------------------------------------|
| GET    | `/statistics`  | `{ totalTasks, pendingTasks, completedTasks, totalUsers }`      |

---

## Error Responses

```json
{
  "message": "Human-readable description",
  "details": [ ... ]
}
```

`details` is only present on validation errors (400) and contains the Zod issue array.

| Status | Meaning                               |
|--------|---------------------------------------|
| 400    | Invalid request body (Zod validation) |
| 401    | Missing, invalid, or expired token    |
| 403    | Authenticated but not authorized      |
| 404    | Resource not found                    |
| 409    | Email already registered              |
| 500    | Unexpected server error               |

---

## Seed Data

After `pnpm seed`, these accounts are available:

| Name           | Email               | Password  | Role          |
|----------------|---------------------|-----------|---------------|
| Juan           | juan12@mail.com     | Juan123!  | Usuario       |
| admin          | admin@mail.com      | Admin123! | Administrador |
| Antonio        | antonio@mail.com    | Anto123!  | Administrador |
| Alberto Carlos | alberto@mail.com    | Zxcv123*  | Usuario       |

---

## Testing with curl

```bash
# Register
curl -s -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@mail.com","password":"secret"}' | jq

# Login (saves cookie to file)
curl -s -c cookies.txt -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mail.com","password":"12345"}' | jq

# Store the token
TOKEN="<paste accessToken here>"

# List users (admin only)
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:5001/api/users | jq

# Create a task
curl -s -X POST http://localhost:5001/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Fix bug","category":"Dev","date":"2026-07-10","priority":"Alta","status":"Pendiente","description":""}' | jq

# Refresh access token
curl -s -b cookies.txt -X POST http://localhost:5001/api/auth/refresh | jq

# Logout
curl -s -b cookies.txt -X POST http://localhost:5001/api/auth/logout | jq
```

---

## Migrating to PostgreSQL / Supabase

Three changes are needed when moving off SQLite:

**1. `.env`**
```
DATABASE_URL="postgresql://user:password@host:5432/dbname"
```

**2. `prisma/schema.prisma`**
```prisma
datasource db {
  provider = "postgresql"
}
```

**3. `src/lib/prisma.ts`** — swap the LibSQL adapter for the Postgres one:
```bash
pnpm add @prisma/adapter-pg pg
pnpm add -D @types/pg
```
```ts
import { PrismaClient } from '../../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
export const prisma = new PrismaClient({ adapter });
```

**4. Regenerate migrations** — SQLite migrations are incompatible with PostgreSQL:
```bash
rm -rf prisma/migrations
pnpm prisma:generate
pnpm prisma migrate dev --name init
```

Application code (services, controllers, schemas) requires no changes.
