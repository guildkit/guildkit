// Not using `defineConfig()` of next-openapi-gen because its type declarations
// re-export the types from an unpublished package (`@workspace/openapi-core`).
export default {
  openapi: "3.1.0",
  info: {
    title: "GuildKit API",
    version: "1.0.0",
  },
  servers: [
    { url: "http://localhost:3001" }, // TODO replace with the backend URL
  ],
  apiDir: "./src/app",
  routerType: "app",
  schemaDir: [
    "../shared/src/zod",
    "./src/schemas",
  ],
  schemaType: "zod",
  // Inline these schemas instead of adding them to `components.schemas`
  excludeSchemas: [
    // Schemas for each field
    "jobTitleSchema",
    "jobDescriptionSchema",
    "jobApplicationUrlSchema",
    "jobLocationSchema",
    "jobSalary*Schema",
    "jobCurrencySchema",
    "jobExpiresAtSchema",
    "org*Schema",
    // Schemas for the parameters
    "*Params",
    "*Query",
    // Schemas not used in the API
    "JobSchema",
    "GuildKitConfigSchema",
  ],
  // better-auth's endpoints
  ignoreRoutes: [ "/api/auth/*" ],
  outputDir: "./openapi",
  outputFile: "openapi.json",
};
