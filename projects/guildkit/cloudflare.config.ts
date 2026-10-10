import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig({
  worker: defineWorker({
    name: "guildkit-demo",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-09-30",
    compatibilityFlags: [ "nodejs_compat" ],
    assets: { notFoundHandling: "none" },
    env: {
      ASSETS: bindings.assets(),

      // Environment variables read via `process.env` at runtime.
      // On local machines, the values are loaded from .env (or the process environment).
      // On Cloudflare, set them as the Worker's secrets.
      SERVER_ENV: bindings.secret(),
      DATABASE_URL: bindings.secret(),
      BETTER_AUTH_URL: bindings.secret(),
      BETTER_AUTH_SECRET: bindings.secret(),
      GOOGLE_CLIENT_ID: bindings.secret(),
      GOOGLE_CLIENT_SECRET: bindings.secret(),
      GITHUB_CLIENT_ID: bindings.secret(),
      GITHUB_CLIENT_SECRET: bindings.secret(),
      AWS_ACCESS_KEY_ID: bindings.secret(),
      AWS_SECRET_ACCESS_KEY: bindings.secret(),
      CLOUDFLARE_ACCOUNT_ID: bindings.secret(),
    },
  }),
});
