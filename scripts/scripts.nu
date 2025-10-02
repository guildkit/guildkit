const scriptDirPath = path self | path dirname
const projectRootPath = $scriptDirPath | path join ".." | path expand

def type [cmd] {
  return (0 < (which $cmd | length))
}

def --wrapped container [ ...args ] {
  if (type podman) {
    (podman ...$args)
  } else if (type docker) {
    (docker ...$args)
  } else {
    print "[ERROR] Neither Docker nor Podman are found. Please install one of them."
    exit 1
  }
}

if not ("SERVER_ENV" in $env) {
  print "[ERROR] The environment variable SERVER_ENV is missing. If you are on your local machine, copy mise.local.example.toml to mise.local.toml, or set `SERVER_ENV=development` manually."
  exit 1
}

let isLocal = ($env.SERVER_ENV == "development")

def "main resetdb" [] {
  container compose down --rmi local --volumes --remove-orphans
  main sync --seed
}

def "main sync" [--seed] {
  # Generate DB Schemas: Currency codes
  pnpm jiti ($scriptDirPath | path join "scripts-sync-currency.ts")

  # Generate DB Schemas: BetterAuth
  ## Requires to properly load auth.ts which imports the generated BetterAuth schema.
  cp ($scriptDirPath | path join "fixtures/barrel-dummy.ts") ($projectRootPath | path join "src/lib/db/schema/index.ts")
  pnpx @better-auth/cli generate --yes --output="./src/lib/db/schema/better-auth.ts" # relative path from project root

  # Generate barrel file for schemas
  pnpm jiti ($scriptDirPath | path join "scripts-sync-barrel.ts")

  if ($isLocal) {
    container compose up -d --wait
  } else if ($env.SERVER_ENV == "demo-preview") {
    pnpm neon branches reset $"preview/($env.VERCEL_GIT_COMMIT_REF)" --parent --project-id=($env.NEON_PROJECT_ID)
  }

  pnpm drizzle-kit generate
  pnpm drizzle-kit migrate

  if (($isLocal or $env.SERVER_ENV == "demo-preview") and $seed) {
    pnpm jiti ./scripts/seed.ts
  }
}

# Required to run subcommands
def main [] {}
