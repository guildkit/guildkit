import { core } from "@phanect/lint";
import { astro } from "@phanect/lint-astro";
import { react } from "@phanect/lint-react";
import { defineConfig, globalIgnores } from "eslint/config";

const configs = defineConfig([
  globalIgnores([
    "./**/dist/**",
    "./**/worker-configuration.d.ts",
    "./projects/cli/bin/**",
    "./projects/db/src/prisma/**",
    "./projects/shared/src/intermediate/**",
  ]),

  ...core,
  ...astro,
  ...react,

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

      // Some rules in some plugins (e.g. eslint-plugin-react) are not ready for ESLint v10 yet as of 2026.06.
      // TODO: enable these rules again when the plugins are ready for ESLint v10.
      "import/order": "off",
      "react/display-name": "off",
      "react/no-direct-mutation-state": "off",
      "react/no-render-return-value": "off",
      "react/no-string-refs": "off",
      "react/no-unknown-property": "off",
      "react/prop-types": "off",
      "react/require-render-return": "off",
    },
  },

  {
    files: [ "**/.mise/**" ],
    rules: {
      // To allow `//MISE ...`
      "@stylistic/spaced-comment": "off",
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
