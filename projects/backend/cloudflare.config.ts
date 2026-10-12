import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig(({ isPreview, mode }) => ({
  worker: defineWorker({
    name: "guildkit-backend",
    entrypoint: "vinext/server/fetch-handler",
    // The newest date the workerd of @cloudflare/vite-plugin supports
    compatibilityDate: "2026-09-30",
    // `nodejs_compat` also populates `process.env` with the bindings below
    compatibilityFlags: [ "nodejs_compat" ],

    assets: {
      notFoundHandling: "none",
    },

    env: {
      // `preview` on Worker Previews, and `production` on the other builds.
      // In the `development` mode (`vite dev` and `pnpm run preview`), the value is loaded from .env like the secrets below.
      SERVER_ENV: mode === "development"
        ? bindings.secret()
        : bindings.text(isPreview ? "preview" : "production"),

      ASSETS: bindings.assets(),

      // Environment variables read via `process.env` at runtime.
      // On local machines, the values are loaded from .env (or the process environment).
      // On Cloudflare, set them as the Worker's secrets.
      DATABASE_URL: bindings.secret(),
      BETTER_AUTH_URL: bindings.secret(),
      BETTER_AUTH_SECRET: bindings.secret(),
      GOOGLE_CLIENT_ID: bindings.secret(),
      GOOGLE_CLIENT_SECRET: bindings.secret(),
      GITHUB_CLIENT_ID: bindings.secret(),
      GITHUB_CLIENT_SECRET: bindings.secret(),
      AWS_ACCESS_KEY_ID: bindings.secret(),
      AWS_SECRET_ACCESS_KEY: bindings.secret(),
      // Cloudflare R2, which guildkit.config.ts uses except in the `development` mode
      ...(mode === "development" ? {} : {
        STORAGE_BUCKET: bindings.secret(),
        CLOUDFLARE_ACCOUNT_ID: bindings.secret(),
      }),
    },
  }),
}));
