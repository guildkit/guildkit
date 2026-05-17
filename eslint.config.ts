import { core } from "@phanect/lint";
import { nextjs } from "@phanect/lint-react";
import { defineConfig, globalIgnores } from "eslint/config";

const configs = defineConfig([
  globalIgnores([
    "./**/dist/**",
    "./**/worker-configuration.d.ts",
    "./projects/guildkit/src/intermediate/**",
    "./projects/guildkit/src/lib/prisma/**",
  ]),

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
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "import/extensions": "off",
    },
  },

  {
    files: [ "projects/backend/**/*.tsx" ],
    rules: {
      "@next/next/no-head-element": "off",
    },
  },
]);

export default configs;
