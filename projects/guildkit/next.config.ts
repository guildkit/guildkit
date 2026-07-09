import { join } from "node:path";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // required to be `standalone` for OpenNextJs
  outputFileTracingRoot: join(import.meta.dirname, "../.."),
  // `pg` requires the real `pg-cloudflare` (workerd export) at runtime on Workers,
  // but Next's file tracing only copies its `default` stub (`dist/empty.js`). Force
  // the full package into the standalone output so OpenNext's esbuild (workerd
  // condition) can resolve `dist/index.js`.
  outputFileTracingIncludes: {
    "*": [ "../../node_modules/.pnpm/pg-cloudflare@*/node_modules/pg-cloudflare/**/*" ],
  },

  reactStrictMode: true,

  images: {
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "15mb",
    },
  },
};

export default nextConfig;

// eslint-disable-next-line @typescript-eslint/no-floating-promises -- `await` does not work properly.
initOpenNextCloudflareForDev();
