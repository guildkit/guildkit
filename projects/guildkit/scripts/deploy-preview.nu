# Deploy the build output as a Cloudflare Worker Preview named after the PR author,
# set the Preview's secrets, and comment the Preview URLs on the pull request.
# Run `pnpm run build` with `CLOUDFLARE_PREVIEW_BUILD=true` first.

const WORKER_NAME = "guildkit-demo"

for name in [ PR_AUTHOR PR_NUMBER DATABASE_URL ] {
  if not ($name in $env) {
    print $"[ERROR] The environment variable ($name) is missing."
    exit 1
  }
}

# Each GitHub user has a fixed Preview URL: https://<username>-guildkit-demo.<subdomain>.workers.dev
let preview_name = ($env.PR_AUTHOR | str replace --regex '\[bot\]$' '')

# Set a dummy value for `BETTER_AUTH_URL` because `cf previews deploy` fails without it.
const DUMMY_BETTER_AUTH_URL = "https://dummy.guildkit.net"
# Base configs for new Preview environments
$DUMMY_BETTER_AUTH_URL | wrangler preview base-config secret put BETTER_AUTH_URL --worker-name $WORKER_NAME
# For the existing Previews.
# It fails if the Preview does not exist yet, but the new Preview is automatically created in that case.
$DUMMY_BETTER_AUTH_URL | do --ignore-errors {
  wrangler preview secret put BETTER_AUTH_URL --name $preview_name --worker-name $WORKER_NAME
}

let preview = (cf previews deploy --prebuilt $preview_name | from json)

if ($preview.preview_urls | is-empty) {
  print $"[ERROR] The Preview \"($preview_name)\" has no URL. Enable Preview URLs of the Worker \"($WORKER_NAME)\" on the Cloudflare dashboard."
  exit 1
}

# `cf` cannot set the secrets of a Worker Preview yet, so use wrangler here.
{ DATABASE_URL: $env.DATABASE_URL, BETTER_AUTH_URL: ($preview.preview_urls | first) }
  | to json
  | wrangler preview secret bulk --name $preview_name --worker-name $WORKER_NAME

# Migrate and seed database
pnpm exec prisma migrate deploy
pnpm exec prisma db seed

# Comment to PR
gh pr comment $env.PR_NUMBER --edit-last --create-if-none --body $"Deployed to Cloudflare Workers:
- Fixed URL: ($preview.preview_urls | str join ', ')
- Commit-specific URL: ($preview.deployment_urls | str join ', ')"
