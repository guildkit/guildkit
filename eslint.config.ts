import { core } from "@phanect/lint";
import { nextjs } from "@phanect/lint-react";
import { defineConfig } from "eslint/config";

const configs = defineConfig([
  {
    ignores: [
      "./.next/**",
      "./build/**",
      "./out/**",
      "./tmp/**",
      "./src/intermediate/**",
      "./src/lib/db/schema/better-auth.ts",
      "./src/lib/db/schema/index.ts",
      "next-env.d.ts",
    ],
  },
  ...core,
  ...nextjs,

  {
    // Do not add `files: [ "*" ],` here.

    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]);

export default configs;
