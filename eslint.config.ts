import { core } from "@phanect/lint";
import { nextjs } from "@phanect/lint-react";
import { defineConfig, globalIgnores } from "eslint/config";

const configs = defineConfig([
  globalIgnores([
    "./**/node_modules/**",
    "./**/.next/**",
    "./**/.open-next/**",
    "./**/.wrangler/**",
    "./**/cloudflare-env.d.ts",
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

      // Some rules in eslint-plugin-import & eslint-plugin-react are not ready for ESLint v10 yet as of 2026.16.
      // TODO: enable these rules again when `eslint-plugin-react` is ready for ESLint v10.
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
]);

export default configs;
