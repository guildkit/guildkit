import { core } from "@phanect/lint";
import { nextjs } from "@phanect/lint-react";
import { defineConfig, globalIgnores } from "eslint/config";

const configs = defineConfig([
  globalIgnores([
    "./**/node_modules/**",
    "./**/.next/**",
    "./**/dist/**",
    "./**/worker-configuration.d.ts",
    "./**/.wrangler/**",
    "./**/.openapi-gen/**",
    "./projects/backend/openapi/**",
    "./projects/backend/src/lib/prisma/**",
    "./projects/client/src/generated/**",
    "./projects/shared/src/intermediate/**",
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

  {
    // JSDoc of the Route Handlers is for next-openapi-gen
    files: [ "projects/backend/src/app/**/route.ts" ],
    rules: {
      "jsdoc/check-tag-names": [ "warn", {
        definedTags: [ "add", "body", "contentType", "path", "query", "response", "responseDescription", "tag" ],
      }],
      "jsdoc/require-param": "off",
      "jsdoc/require-returns": "off",
    },
  },
]);

export default configs;
