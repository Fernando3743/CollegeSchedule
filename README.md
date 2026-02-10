# College Schedule

A private student dashboard to track courses, schedule, semester progress, grades, and notes.

## Features

- Dashboard with degree completion, current semester progress, upcoming classes, and GPA.
- Course catalog with filters and course detail pages.
- Course detail tabs for overview, grade management, and note management.
- Semester roadmap with progress by semester and semester detail pages grouped by `Momento`.
- Grades analytics with overall GPA, passing rate, GPA by semester, and grade tables.
- Weekly schedule view for the active semester.
- Password-protected access for private deployments.

## Tech Stack

- Next.js (App Router) + React + TypeScript
- Prisma ORM + SQLite (default) or Turso/libSQL (optional)
- Tailwind CSS v4 + shadcn/ui
- Server Actions for mutations

## Getting Started

### 1) Install dependencies

```bash
pnpm install
```

### 2) Configure environment variables

Create/update `.env`:

```bash
DATABASE_URL="file:./dev.db"

# Recommended for private/prod deployment
APP_PASSWORD="change-me"
APP_SESSION_SECRET="replace-with-a-long-random-secret"

# Optional (use Turso/libSQL instead of local SQLite)
# TURSO_DATABASE_URL="libsql://..."
# TURSO_AUTH_TOKEN="..."
```

### 3) Create database and apply migrations

```bash
pnpm prisma migrate dev
```

### 4) Seed initial courses/settings

```bash
pnpm tsx prisma/seed.ts
```

### 5) Run the app

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Available Commands

- `pnpm dev` - Start local development server
- `pnpm build` - Build production bundle
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Authentication Behavior

- In `development`, pages under `/(app)` are accessible even if auth env vars are missing.
- In `production`, `APP_PASSWORD` and `APP_SESSION_SECRET` are required and users must log in via `/login`.
- Auth is shared-password based (not multi-user accounts).

## Project Structure

- `src/app` - App Router pages/layouts
- `src/components` - UI and feature components
- `src/actions` - Server Actions for course/grade/note mutations
- `src/lib` - DB client, queries, auth, validations, utilities
- `prisma` - Prisma schema, migrations, and seed script
- `data/courses.json` - Seed source data

## Deployment Notes

- For production, use a remote database (`DATABASE_URL`) instead of local `file:./dev.db`.
- If using Turso, set `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`.
- Set `APP_PASSWORD` and a strong `APP_SESSION_SECRET`.
