# Google Sheets Automatization Platform (Next.js Stage 1 Foundation)

Stage 1 implementation of the multi-school platform foundation from
`docs/implementation-roadmap-nextjs.md`.

## Tech stack

- Next.js 16 (App Router)
- Bun
- TypeScript
- Tailwind CSS v4 + shadcn/ui
- Prisma 7 + PostgreSQL (Supabase-compatible)
- better-auth (email/password)
- Vercel deployment baseline

## One-command local bootstrap

After you configure `.env` (see below), run:

```bash
bun install && bun db:migrate && bun db:seed && bun dev
```

## Environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Required for Stage 1:

- `DATABASE_URL`: Postgres/Supabase connection string
- `AUTH_SECRET`: long random secret (>=32 chars)
- `BETTER_AUTH_URL`: app URL (for local: `http://localhost:3000`)
- `NEXT_PUBLIC_APP_URL`: public app URL (for local: `http://localhost:3000`)

Reserved for next stages:

- `TELEGRAM_BOT_TOKEN`
- `NOVA_POSHTA_API_KEY`
- `GOOGLE_SERVICE_ACCOUNT_JSON`

## Database and Prisma

- Prisma schema: `prisma/schema.prisma`
- Prisma config: `prisma.config.ts`
- Seed script: `prisma/seed.ts`

Useful commands:

- `bun db:migrate`
- `bun db:migrate:deploy`
- `bun db:reset`
- `bun db:seed`
- `bun prisma:validate`

## Authentication and routes

- Auth API: `src/app/api/auth/[...all]/route.ts`
- Login page: `/login`
- Protected admin layout: `src/app/(admin)/layout.tsx`
- Initial protected page: `/dashboard`

Default seeded login (after `bun db:seed`):

- Email: `admin@example.com`
- Password: `changeme123`

## Observability baseline

- Structured logger: `src/lib/logger.ts`
- Error tracking hook stub: `src/lib/error-tracking.ts`
- Health endpoint: `GET /api/health`
- Metrics stub endpoint: `GET /api/metrics`

## CI

CI workflow is defined in `.github/workflows/ci.yml` and runs:

- Lint (`bun lint`)
- Typecheck (`bun typecheck`)
- Tests (`bun test`)
- Prisma validation (`bun prisma:validate`)

## Vercel deployment baseline

`vercel.json` includes Next.js build baseline. In Vercel, set the same env variables from `.env.example` for the target environment.

For Supabase, use the Postgres connection string in `DATABASE_URL` (SSL parameters as required by your Supabase project).

