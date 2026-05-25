import { core } from "@phanect/lint";
import { nextjs } from "@phanect/lint-react";
import { defineConfig, globalIgnores } from "eslint/config";

const configs = defineConfig([
  globalIgnores([
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
]);

export default configs;
