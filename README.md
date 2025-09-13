# GuildKit

A CMS for job search services

> [!CAUTION]
> Currently WIP. Do not use in production.

## Development

### Prerequisites

- Node.js v20, v22, or v24
- corepack
- [Podman](https://podman.io)
  - Requires Podman engine only. Podman Desktop is optional.

### Run local server

First, start Podman daemon.

Then run the following commands:

```sh
cd /path/to/guildkit
cp ./.env.example ./.env
pnpm install
pnpm dev
```

Now GuildKit will be served via http://localhost:3000.

Min.io's dashboard is also available via http://localhost:9001.

### Wording conventions

- organization: The organization (i.e. company in most cases) to hire the candidate(s).
- recruiter: The recruitment staff (user) who belongs to the organization(s).
- employer: Only use this term if you want to express both the organization or its recruitment staff(s).

## Credit

Copyright (c) 2025-present Jumpei Ogawa and the contributors

This project includes source code derived from:

- [JOB PORTAL](https://github.com/irakozetony/jobportal) by [**@irakozetony**](https://github.com/irakozetony)
  - License: [MIT](https://github.com/irakozetony/jobportal/blob/69f5478cb18c97e5a703dfc2235e2b9c900f40c0/LICENSE)
  - Hash of the HEAD at the time of fork: [69f5478](https://github.com/irakozetony/jobportal/commit/69f5478cb18c97e5a703dfc2235e2b9c900f40c0)

This project includes thirdparty assets listed in [CREDITS.md](./static/vendor/CREDITS.md)

## License

[A proprietary license](./LICENSE.md), but it allows self host and redistributing under some limitations.
