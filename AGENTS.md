# AGENTS.md

This file provides guidance to AI agents when working with code in this repository.

## What GuildKit is

GuildKit is a CMS for building job platforms. It is being reshaped from a single Next.js app into a **framework distributed as a CLI** (the `guildkit` npm package). A consumer writes a `guildkit.config.ts`, runs `guildkit dev` / `guildkit build`, and the CLI scaffolds and runs the backend + frontend on their behalf. `demo/` is the reference consumer.

> The repo is WIP and mid-refactor. The database, auth, and zod schemas have moved into `@guildkit/shared`, and the API has been split into `@guildkit/backend`. When `AGENTS.md` and the actual code disagree, trust the code. Several `mise.toml` tasks (notably in `projects/guildkit` and the `cli` deps) are commented out while the split is in progress.

## Monorepo layout

pnpm workspaces under `projects/*` plus `demo`. **The directory name and the package name often differ — this is the single most confusing thing in the repo:**

| Directory | Package | Role |
|---|---|---|
| `projects/shared` | `@guildkit/shared` | Hub library. Prisma schema + generated client, better-auth setup, zod schemas, config types, CLI path helpers. Everything depends on it. |
| `projects/backend` | `@guildkit/backend` | Hono API (routes: `organizations`, `jobs`), auth middleware. Deploys to Cloudflare Workers (Wrangler + Vite). Exports `GuildKitBackendTaskRunner` via `./cli`. |
| `projects/guildkit` | `@guildkit/frontend-legacy` | The legacy Next.js 16 / React 19 app. Exports `GuildKitFrontendTaskRunner` via `./cli`. |
| `projects/frontend` | `@guildkit/frontend` | An Astro-based frontend. |
| `projects/cli` | `guildkit` | The published CLI (brocli). Loads `guildkit.config.ts` via c12, orchestrates the two task runners. Binary: `src/cli.ts`. |
| `demo` | `@guildkit/demo` | Reference consumer that runs the `guildkit` CLI. |

Note: the CLI imports `@guildkit/frontend/cli`, i.e. `projects/frontend` (Astro) — **not** `projects/guildkit` (Next.js).

## How the framework works (read these together)

The CLI (`projects/cli/src/cli.ts`) is config-driven:

1. `loadConfig` reads the consumer's `guildkit.config.ts` (shape = `GuildKitConfig` in `projects/shared/src/config.ts`).
2. It instantiates `GuildKitBackendTaskRunner` (`projects/backend/exports/cli.ts`) and `GuildKitFrontendTaskRunner` (`projects/frontend/exports/cli.ts`).
3. Each runner **copies its own source into `.guildkit/intermediate/{backend,frontend}`** in the consumer's cwd, writes a generated `wrangler.json` (when targeting Cloudflare), generates Cloudflare types, and runs dev (vite / next) or build, emitting to `dist/{backend,frontend}`. Path layout is centralized in `@guildkit/shared/cli` (`getPaths`).

So the runtime app is assembled at the consumer's machine from copied source + their config injected via `__GUILDKIT_CONFIG__`.

## Auth (hard rules — still valid post-refactor)

better-auth is configured in `projects/shared/src/auth.ts` (Prisma adapter, Google + GitHub OAuth only, no email/password). Roles live in `projects/shared/src/auth/roles.ts`.

- **User types**: `recruiter`, `candidate`, `administrative` (must match the `UserType` enum in `prisma/models/core.prisma`).
- **Admin roles**: `gkAdmin` (GuildKit-wide), `siteAdmin` (one site), `none`. **Recruiter/org roles**: `recruiterAdmin`, `recruiter`.
- **Always gate access with `requireAuthAs()`** in `projects/backend/src/middleware/auth.ts`. Calling `auth.api.getSession()` directly is forbidden everywhere — the only sanctioned wrapper is the local `getSession` defined inside that same file.

## Database & code generation

Prisma source of truth: `projects/shared/prisma/models/{core,better-auth,currencies}.prisma`. The build task `projects/shared/.mise/tasks/build/db.nu` runs a specific, order-dependent pipeline:

```
prisma generate           # generates the client into src/prisma/ (committed, DO NOT hand-edit; eslint-ignored)
auth generate ...         # regenerates prisma/models/better-auth.prisma FROM src/auth.ts
prisma generate           # again, to pick up the auth-driven schema changes
prisma migrate dev|deploy # dev when SERVER_ENV=development, else deploy
prisma db seed            # dev / demo envs only; seeder is .mise/tasks/seed.ts
```

`better-auth.prisma` is generated from `auth.ts` — edit auth config, not that file. The generated Prisma client under `projects/shared/src/prisma/` is committed and must not be edited by hand.

## Commands

Tasks are run with **mise** (a monorepo task runner here — `experimental_monorepo_root`), not npm scripts. Run from repo root:

- `mise install` — install deps (also runs corepack, `pnpm install`, and `mise setup` via postinstall hook).
- `mise dev` — build all projects, then start app + Postgres + RustFS dev servers.
- `mise build` — build all projects.
- `mise lint` — root `tsc --noEmit`, each project's `lint`, then `eslint`.
- `mise fix` — `eslint --fix` + per-project fixes.
- `mise clean` — tear down containers and gitignored files (keeps `.env`, `mise.local.toml`).
- `mise refresh` — recreate containers and `pnpm-lock.yaml`, update pnpm.

Target one project: `mise //projects/backend:build` (or `:dev`, `:lint`, `:deploy`). Cross-project deps are declared with `wait_for`/`depends` in each `mise.toml`.

**After every code edit, run `mise ai-postedit`** (`tsc --noEmit` + per-project lint + `eslint --fix` + per-project fix) and resolve all reported errors before reporting done.

## Local environment

- Prereqs: mise-en-place + Podman. `cp .env.example .env` before first run.
- If you couldn't find commands installed by mise such as `node`, `pnpm`, `corepack`, and so on, run `mise reshim` and try again.
- `compose.yaml` brings up **Postgres 17** (`:5432`) and **RustFS** S3-compatible storage (`:9000` API, `:9001` console). Storage client is `@aws-sdk/client-s3`; the `guildkit` bucket is created by `.mise/tasks/setup/storage.ts`.
- App dev port is config-driven (`GuildKitConfig.dev.port`, default 3000; the demo uses 3001). The backend CORS origin in `projects/backend/src/index.ts` is currently hardcoded to the frontend origin.
- Required env vars (see `.env.example`): `DATABASE_URL`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID/SECRET`, `GITHUB_CLIENT_ID/SECRET`, and `SERVER_ENV` (`development` | `demo-preview` | `demo-production` — gates migrate/seed and Neon branch behavior).

## Conventions & constraints

- **Package manager**: pnpm only. **Node**: 24.x. New deps wait 72h after release (renovate `minimumReleaseAge`).
- Always use `mise run lint` command when you want to check TypeScript type with `tsc` and/or lint projects with `eslint`. This command build the project before the checking the errors. Since this project is monorepo-based, you have to build the projects before running type check and the lints.
- **Build tooling**: tsdown (ESM, dual `dist`/`bin` outputs); Cloudflare deploys via wrangler.
- `@cloudflare/workers-types` is **forbidden** (deprecated).
- Domain wording (from README): **organization** = the hiring company; **recruiter** = staff belonging to an organization; **employer** = use only when you mean either/both.
- If you read command output, make sure to read all the output messages to avoid missing any important messages. Trimming the output using commands like `tail`, `head`, and `grep` is strictly forbidden.
