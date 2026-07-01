# Task Manager

Full-stack task management application with role-based access control. Users manage their own tasks; administrators manage users, see all tasks, and view aggregated statistics.

## Architecture

```
administrador de tareas/
├── backend/     REST API — Express 5 + TypeScript + Prisma 7 + SQLite
└── frontend/    SPA — Vanilla JavaScript + Vite
```

Both services run independently. The frontend calls the backend at `http://localhost:5001/api`.

---

## Stack at a Glance

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Backend     | Express 5, TypeScript 6, Prisma 7   |
| Database    | SQLite via LibSQL adapter           |
| Auth        | JWT (15 min) + opaque refresh token (httpOnly cookie, 7 days) |
| Validation  | Zod 4                               |
| Frontend    | Vanilla JS (ES modules), Vite 7     |
| Routing     | Custom hash-based SPA router        |

---

## Running the Full Stack

Open two terminals.

**Terminal 1 — Backend**
```bash
cd backend
pnpm install
cp .env.example .env   # set JWT_SECRET
pnpm setup             # generate + migrate + seed
pnpm dev               # → http://localhost:5001
```

**Terminal 2 — Frontend**
```bash
cd frontend
pnpm install
pnpm dev               # → http://localhost:5173
```

---

## Seed Accounts

| Name           | Email               | Password  | Role          |
|----------------|---------------------|-----------|---------------|
| Juan           | juan12@mail.com     | Juan123!  | Usuario       |
| admin          | admin@mail.com      | Admin123! | Administrador |
| Antonio        | antonio@mail.com    | Anto123!  | Administrador |
| Alberto Carlos | alberto@mail.com    | Zxcv123*  | Usuario       |

---

## Roles

| Role            | Capabilities                                                   |
|-----------------|----------------------------------------------------------------|
| `Usuario`       | Manage own tasks, edit own name and password                   |
| `Administrador` | All of the above + manage all users, see all tasks, view stats |

---

## API Base URL

`http://localhost:5001/api`

| Prefix          | Description                    |
|-----------------|--------------------------------|
| `/auth`         | Register, login, refresh, logout |
| `/users`        | User CRUD (admin-managed)      |
| `/tasks`        | Task CRUD (role-filtered)      |
| `/statistics`   | Aggregated counts (admin only) |

Full API reference: [`backend/README.md`](backend/README.md)

---

## Frontend Routes

| Route         | Access     |
|---------------|------------|
| `/login`      | Public     |
| `/register`   | Public     |
| `/home`       | Any user   |
| `/tasks`      | Any user   |
| `/profile`    | Any user   |
| `/users`      | Admin only |
| `/statistics` | Admin only |
| `/logout`     | Any user   |

Full frontend reference: [`frontend/README.md`](frontend/README.md)

