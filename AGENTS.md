# AGENTS.md

GuildKit is a platform to create your own job platforms.  
This file provides guidance to AI agents when working with the GuildKit code.

## Project Structure

### Tech stacks

- React 19.x with React Compiler
- Vite as bundler
- Prisma 7.x with PostgreSQL
- 

### Directory Layout

```
guildkit/
├── projects/                 # Monorepo root
│   └── guildkit/             # Main GuildKit application
│       ├── tsconfig.json
│       ├── package.json
│       └── prisma.config.ts
├── compose.yaml             # Docker/Podman compose for dev services
├── eslint.config.ts         # ESLint configuration
├── mise.toml                # Mise task configuration
├── pnpm-workspace.yaml      # pnpm workspace configuration
└── package.json
```

### Architecture Notes

- GuildKit is built as a Next.js-based web application.
- GuildKit uses [Prisma](https://www.prisma.io/docs/) as the ORM.
- GuildKit uses an S3-compatible object storage. It uses [`@aws-sdk/client-s3` npm package](https://www.npmjs.com/package/@aws-sdk/client-s3).
- GuildKit uses Podman Compose, which is compatible with Docker Compose, to run the database and object storage server on the local development machines.
- GuildKit uses pnpm instead of npm.
- GuildKit does not use npm scripts. We use [mise-en-place](https://mise.jdx.dev) instead. The tasks are defined in mise.toml and the files under .mise/tasks/.

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
