import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig(({ isPreview, mode }) => ({
  worker: defineWorker({
    name: "guildkit-demo",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-10-11",
    compatibilityFlags: [ "nodejs_compat" ],

    // See: https://vinext.dev/docs/deploying/cloudflare#middleware-and-static-files
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: [
        "/*",
        "!/_next/static/*",
        "!/*/_next/static/*",
      ],
    },

    placement: {
      mode: "smart",
    },
    // Serve Worker Previews on `<preview name>-guildkit-demo.tenkumo.workers.dev`.
    previewUrls: true,

    env: {
      // `preview` on Worker Previews (`cf previews deploy`), and `production` on the other builds.
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
    },
  }),
}));
