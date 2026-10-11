# GuildKit

A CMS to build your own job platform

> [!CAUTION]
> Currently WIP. Do not use in production.

## Development

### Prerequisites

- [mise-en-place](https://mise.jdx.dev/installing-mise.html)
  - mise will install Node.js, corepack, and pnpm.
- [Podman](https://podman.io)
  - Requires Podman engine only. Podman Desktop is optional.

### Run local server

First, start Podman daemon.

Then run the following commands:

```sh
cd /path/to/guildkit
cp ./.env.example ./.env
mise install
pnpm run dev
```

Now GuildKit will be served via http://localhost:3000.

RustFS' dashboard is also available via http://localhost:9001.

### Wording conventions

- organization: The organization (i.e. company in most cases) to hire the candidate(s).
- recruiter: The recruitment staff (user) who belongs to the organization(s).
- employer: Only use this term if you want to express both the organization or its recruitment staff(s).

## License

This repository is licensed under the [Apache License 2.0](./LICENSE.txt).  
See [credits.md](./legal/credits.md) for the thirdparty code and assets used in this repository.

Copyright (c) 2025-present Tenkumo, Inc., Jumpei Ogawa, and the contributors
