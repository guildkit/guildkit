import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import compress from "astro-compress";
import icon from "astro-icon";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  compressHTML: true,
  site: "https://guildkit.net",

  trailingSlash: "always",

  integrations: [
    mdx(),
    icon(),
    compress(),
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          logger: {
            warn: (message) => {
              console.warn(message);
            },
          },
        },
      },
    },
    plugins: [
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@components": fileURLToPath(new URL("./src/components", import.meta.url)),
        "@layouts": fileURLToPath(new URL("./src/layouts", import.meta.url)),
        "@assets": fileURLToPath(new URL("./src/assets", import.meta.url)),
        "@content": fileURLToPath(new URL("./src/content", import.meta.url)),
        "@pages": fileURLToPath(new URL("./src/pages", import.meta.url)),
        "@public": fileURLToPath(new URL("./public", import.meta.url)),
        "@post-images": fileURLToPath(new URL("./public/posts", import.meta.url)),
        "@project-images": fileURLToPath(new URL("./public/projects", import.meta.url)),
      },
    },
  },
});
