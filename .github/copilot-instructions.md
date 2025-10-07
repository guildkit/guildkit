When you write TypeScript and JavaScript code, you should always follow the following conditions:

- Add file extensions (e.g., .ts, .tsx) when importing local modules.
  - Path starts with `@/` is probably a local module. Path starts with `@` without slash is probably not a local module.
- If possible, avoid using default exports.

When you write React components, you should always follow the following conditions:

- Use `ReactElement` from `react` for component types.
