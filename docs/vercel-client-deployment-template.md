## Vercel Deployment Template (Client)

This checklist is optimized for “set env vars, run migrations once, deploy”.

### One-click Deploy Button
[Deploy with Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fthedev-company%2Fgoogle-sheets-automatization.git&env=DATABASE_URL,AUTH_SECRET,DATA_ENCRYPTION_KEY,BETTER_AUTH_URL,NEXT_PUBLIC_APP_URL,CRON_SECRET)
The URL only requests which env var keys are needed; secret values are entered in the Vercel form (not in the link).

### 1) Create a Vercel project
Import this repo (GitHub) and create a new Vercel project for it.

### 2) Build settings
In Vercel settings, ensure:
- Install command: `bun install --frozen-lockfile`
- Build command: `bun run build`

(`vercel.json` already includes these defaults.)

Vercel can install Bun automatically when a Bun lockfile is present in the repo (this project uses `bun.lock`).

### 3) Set Environment Variables
Copy values from this repo’s `.env.example` into the Vercel Project Environment Variables.

Required for Stage 1 runtime (login + cron):
- `DATABASE_URL`
- `AUTH_SECRET` (>= 32 chars)
- `DATA_ENCRYPTION_KEY` (>= 32 chars)
- `BETTER_AUTH_URL` (public URL; set to your Vercel domain)
- `NEXT_PUBLIC_APP_URL` (public URL; set to your Vercel domain; can be the same as `BETTER_AUTH_URL`)
- `CRON_SECRET` (required for cron auth in production)

Optional:
- `NEXT_PUBLIC_TELEGRAM_WEBHOOK_BASE_URL` (set to your Vercel domain, for Telegram webhook setup hints)
- `TELEGRAM_BOT_TOKEN` (enables Telegram webhook behavior)
- `NOVA_POSHTA_API_KEY`
- `GOOGLE_SERVICE_ACCOUNT_JSON_B64` (or `GOOGLE_SERVICE_ACCOUNT_JSON`)

### 4) Run Prisma migrations once
Vercel does not automatically run Prisma migrations for you.

Run (locally) using the exact same `DATABASE_URL` your client will use in Vercel:
- `bun db:migrate:deploy`

### 5) Deploy
Deploy the project in Vercel.

### 6) Smoke tests
After deployment:
- `GET /api/health` should return `ok: true` (or `status: healthy/degraded`)
- Confirm cron endpoint auth behavior:
  - Vercel cron calls `GET /api/cron/process-sync-jobs` with `Authorization: Bearer <CRON_SECRET>` via `vercel.json`

Example curl (replace with real values):
```bash
curl -sS https://YOUR-DOMAIN/api/cron/process-sync-jobs \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

