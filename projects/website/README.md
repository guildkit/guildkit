# GuildKit website

## Development

Run `mise install` first:

```shell
mise install
```

Then run `mise dev` to run the local server and open http://localhost:4321.

Other supported dev commands:

| Command         | Action                                       |
| :-------------- | :------------------------------------------- |
| `mise install`  | Installs Node.js and npm dependencies        |
| `mise dev`      | Starts local dev server at `localhost:4321`  |
| `mise build`    | Build your production site to `./dist/`      |
| `mise lint`     | Run typecheck by `tsc` and lint by ESLint    |
| `mise fix`      | Autofix ESLint errors and warnings           |
| `mise clean`    | Cleanup gitignore'd files except for .env    |
| `mise refresh`  | Cleanup gitignore'd files, upgrade pnpm, recreate lock files and reinstall npm dependencies |

## Copyright & Credits

Copyright &copy; Jumpei Ogawa all rights reserved

This website is based on [accessible-astro-starter](https://github.com/incluud/accessible-astro-starter) licensed under [MIT](./docs/legal/LICENSE-accessible-astro-starter.txt).
