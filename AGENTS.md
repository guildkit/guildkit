# AGENTS.md

This file provides guidance to AI agents when working with code in this repository.

## Project Overview

GuildKit is a CMS to create job platforms.
You can create your own job platforms and customize them for their targeted industries and features.

## Project Structure

GuildKit is a Next.js application. It follows the directory structure of Next.js.

### Technology Stack

- **Framework**: Next.js 16 with App Router
- **Auth**: better-auth with role-based access control
  - User Types: `administrative`, `recruiter`, `candidate`
  - Admin Roles: `gkAdmin` (GuildKit admins), `siteAdmin` (site admins), `none`
  - **IMPORTANT**: Use `requireAuthAs()` function in `projects/guildkit/src/lib/auth/server.ts` instead of betterAuth's `auth.api.getSession()` to check if the user is authenticated and has the required role. **`auth.api.getSession()` is strictly forbidden in any code base of GuildKit**.
- **Database**: PostgreSQL with Prisma ORM
- **Storage**: S3-compatible object storage with [`@aws-sdk/client-s3` npm package](https://www.npmjs.com/package/@aws-sdk/client-s3) as a client library.
- **Local Development**: Podman Compose, which is compatible with Docker Compose, to run the database and object storage server on the local development machines.
- **Package Manager**: pnpm instead of npm.
- **Task Runner**: [mise-en-place](https://mise.jdx.dev) instead of npm scripts. The tasks are defined in mise.toml and the files under .mise/tasks/.

### Directory Structure

This project is a monorepo. Sub-projects are stored under `projects/`

```
guildkit/
├── projects/                 # Monorepo root
│   └── guildkit/             # Main GuildKit application
│       ├── prisma/           # Database schema and migrations
│       │   ├── schema.prisma
│       │   ├── migrations/
│       │   └── models/
│       │       ├── better-auth.prisma
│       │       ├── core.prisma
│       │       └── currencies.prisma
│       ├── public/           # Static assets
│       │   └── vendor/
│       │       ├── octicons/
│       │       └── tabler/
│       ├── src/
│       │   ├── app/          # Next.js app directory
│       │   │   ├── (public)/ # Public routes (landing, job listing)
│       │   │   ├── auth/     # Authentication pages
│       │   │   ├── employer/ # Employer dashboard
│       │   │   └── api/      # API routes
│       │   ├── components/   # React components
│       │   │   ├── generic/  # Reusable UI components
│       │   │   │   └── fields/
│       │   │   ├── JobCard.tsx
│       │   │   ├── JobEditor.tsx
│       │   │   └── OrgEditor.tsx
│       │   ├── devkit/       # CLI tools and utilities
│       │   │   ├── cli.ts
│       │   │   ├── config.ts
│       │   │   └── utils.ts
│       │   ├── intermediate/ # Intermediate build files
│       │   │   ├── currencies.ts
│       │   │   └── public-configs.json
│       │   └── lib/          # Core business logic
│       │       ├── auth/     # Authentication utilities
│       │       ├── prisma/   # Prisma database schema and utilities
│       │       ├── actions/  # Server actions
│       │       ├── validations/ # Zod schemas
│       │       ├── utils/    # Helper utilities
│       │       ├── styles/   # Global CSS
│       │       └── types.ts  # TypeScript type definitions
│       ├── next.config.ts
│       ├── tsconfig.json
│       ├── package.json
│       └── prisma.config.ts
├── compose.yaml             # Docker/Podman compose for dev services
├── eslint.config.ts         # ESLint configuration
├── mise.toml                # Mise task configuration
├── pnpm-workspace.yaml      # pnpm workspace configuration
└── package.json
```

### Key Directories

- **projects/guildkit/src/app** - Next.js pages and API routes using app directory
- **projects/guildkit/src/lib** - Business logic, type definitions, and utilities
- **projects/guildkit/src/components** - Reusable React components
- **projects/guildkit/prisma** - Database schema, migrations, and model definitions
- **projects/guildkit/public** - Static assets and vendor files

## Quick Start

1. `mise install`
2. `mise build`
3. `mise dev`

## Dev Commands

- `mise install` - Install all dependencies, including npm dependencies.
- `mise dev` - Start dev servers including application server, database server, and object storage server.
- `mise build` - Build application.
- `mise lint` - Run `tsc --noEmit` and ESLint.
- `mise fix` - Fix linting issues.
- `mise clean` - Delete the Docker containers and gitignore'd files except for .env and mise.local.toml.
- `mise refresh` - Recreate the Docker containers and pnpm-lock.yaml, and update pnpm.

## AI Agent Instructions

### Post-Modification Linting

**After every code modification, the AI agent must:**

1. Run `mise lint` to check for TypeScript and ESLint errors
2. If errors are found, fix them either by:
   - Running `mise fix` for auto-fixable issues
   - Manually correcting code issues if auto-fix doesn't resolve them
3. Continue running `mise lint` until all errors are resolved
4. Report the final lint status to the user

This ensures the codebase remains free of TypeScript and lint errors at all times.

### package blocklist

1. **`@cloudflare/workers-types` npm package is strictly forbidden** since it is deprecated.
