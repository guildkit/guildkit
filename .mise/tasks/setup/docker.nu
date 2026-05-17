#!/usr/bin/env nu

#MISE description="Setup after `mise install`. Build intermediate files and set up local Docker containers."
#MISE raw=true # Required for interactive shell by Prisma

use ../_libs *

if not ("SERVER_ENV" in $env) {
  print "[ERROR] The environment variable SERVER_ENV is missing. If you are on your local machine, copy .env.example to .env, or set `SERVER_ENV=development` manually."
  exit 1
}

if ($env.SERVER_ENV == "development") {
  container compose up -d --wait
} else if ($env.SERVER_ENV == "demo-preview") {
  pnpm neon branches reset $"preview/($env.VERCEL_GIT_COMMIT_REF)" --parent --project-id=($env.NEON_PROJECT_ID)
}
