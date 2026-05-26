import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig } from "vite";
import viteSsrPlugin from "vite-ssr-components/plugin";

const config = defineConfig({
  plugins: [
    cloudflare(), // TODO do not add this when the user choose to use Node.js as a backend.
    viteSsrPlugin(),
  ],
  server: {
    port: 3001,
  },
});

export default config;
