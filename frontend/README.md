# Task Manager — Frontend

Single Page Application built with vanilla JavaScript and Vite. Communicates with the [backend API](../backend/README.md) running on `http://localhost:5001`.

## Stack

| Layer           | Technology          |
|-----------------|---------------------|
| Language        | JavaScript (ES modules) |
| Bundler         | Vite 7              |
| Routing         | Custom hash-based SPA router |
| Auth storage    | `localStorage` (access token) + `httpOnly` cookie (refresh token) |
| Package manager | pnpm                |

No UI frameworks or component libraries — all views are plain JS templates with scoped CSS files.

---

## Prerequisites

The backend must be running before starting the frontend.  
See [`../backend/README.md`](../backend/README.md) for setup instructions.

---

## Setup

```bash
pnpm install
pnpm dev     # http://localhost:5173
```

---

## Scripts

| Script         | Description                              |
|----------------|------------------------------------------|
| `pnpm dev`     | Start Vite dev server with HMR           |
| `pnpm build`   | Bundle for production into `dist/`       |
| `pnpm preview` | Preview the production build locally     |

---

## Pages and Routes

| Route          | Access        | Description                              |
|----------------|---------------|------------------------------------------|
| `/login`       | Public        | Login form                               |
| `/register`    | Public        | Registration form                        |
| `/home`        | Any user      | Dashboard / landing after login          |
| `/tasks`       | Any user      | Task list — users see only their own     |
| `/profile`     | Any user      | Edit name and password                   |
| `/users`       | Admin only    | User management (CRUD)                   |
| `/statistics`  | Admin only    | Aggregated task and user counts          |
| `/logout`      | Any user      | Revokes session and redirects to login   |

---

## Project Structure

```
frontend/
├── public/          # Static assets (favicon)
├── src/
│   ├── assets/      # UI icons (edit, delete)
│   ├── components/
│   │   ├── navbar/          # Navigation bar component
│   │   └── dashboard/       # Dashboard panel component
│   ├── helpers/
│   │   ├── activate-disable-btn.js  # Form button state
│   │   ├── create-messages.js       # Success / error message rendering
│   │   ├── create-tables.js         # Dynamic table rendering for tasks and users
│   │   ├── get-metrics.js           # Fetches and renders statistics
│   │   ├── profile-form.js          # Profile form pre-fill logic
│   │   └── utils.js                 # Shared utilities
│   ├── pages/
│   │   ├── home/
│   │   ├── login/
│   │   ├── logout/
│   │   ├── profile/
│   │   ├── register/
│   │   ├── statistics/
│   │   ├── tasks/
│   │   └── users/
│   ├── router/
│   │   ├── router.js        # SPA routing logic (no page reloads)
│   │   └── routes.js        # Route-to-view mapping, split by role
│   ├── services/
│   │   ├── crud.js          # Base fetch wrapper with auth and auto-refresh on 401
│   │   ├── login.js         # POST /api/auth/login
│   │   ├── register.js      # POST /api/auth/register
│   │   └── session.js       # Access token helpers + logout call
│   ├── styles/
│   │   └── globals.css      # CSS variables and resets
│   └── main.js              # App entry point — routing and event wiring
└── index.html
```

---

## Auth Flow

1. **Login** — `POST /api/auth/login` returns `{ accessToken, user }`. The token is stored in `localStorage`; the refresh token arrives as an `httpOnly` cookie.
2. **Authenticated requests** — `crud.js` reads the access token from `localStorage` and attaches it as `Authorization: Bearer <token>` on every request.
3. **Auto-refresh** — on a `401` response, `fetchWithAuth` calls `POST /api/auth/refresh` (cookie is sent automatically), stores the new token, and retries the original request once.
4. **Logout** — calls `POST /api/auth/logout` (revokes the refresh token server-side), then clears `localStorage`.

---

## Role-Based Access

Routes and UI elements are conditionally rendered based on the `rol` field in the session stored in `localStorage`.

- **Usuario** — can view and manage their own tasks and edit their profile (`name`, `password`). Cannot change `email` or `rol`.
- **Administrador** — can manage all users, see all tasks, and view the statistics page.
