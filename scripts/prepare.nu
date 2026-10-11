# Setup after `pnpm install`. Set up local containers.

use ./_libs *

pnpm exec skills experimental_install

if not ("SERVER_ENV" in $env) {
  print "[ERROR] The environment variable SERVER_ENV is missing. If you are on your local machine, copy .env.example to .env, or set `SERVER_ENV=development` manually."
  exit 1
}

if ($env.SERVER_ENV == "development") {
  container compose up -d --wait
}
