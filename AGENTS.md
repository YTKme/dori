# AGENTS.md

Guidance for working in this repository.

## Overview

Dori is a self-hostable, multi-tenant CRM. See [README.md](README.md) for the
feature set and [documentation/](documentation/) for schema, API, tenancy,
authentication and deployment guides.

## Conventions

- **Directories** are singular (`component`, `route`, `server`, `type`);
  infrastructure directories are underscore-prefixed (`_drizzle`, `_betterauth`,
  `_shadcn`). Path alias `~/*` → `src/*`.
- **Server-only** modules (touching the database, auth, secrets, Node APIs) use
  the `.server.ts` suffix and must only be referenced from server code (server
  functions or inside route `server.handlers`), never at the top level of a
  client-bundled module. This keeps `pg`/`redis`/secrets out of the browser
  bundle — the production build enforces it.
- **Database**: tables prefixed `dori_`, columns snake_case ↔ camelCase, UUID v7
  primary keys. Every business table embeds `baseColumns()` (tenant key,
  ownership, audit, soft-delete). Relations live in `_drizzle/relation.ts`.
- **Data access**: one module per entity in `_drizzle/database/*.server.ts`,
  built on the generic `createResource` factory (tenant-scoped CRUD +
  pagination/sort/search/expand + soft-delete) and carrying its Zod schemas.
- **REST**: `routes/api/v1/<entity>/{index,$id}.ts` with inline handlers that
  delegate to `server/rest.ts`. Tenant resolution via `server/tenancy.server.ts`.
- **UI**: the generic CRUD kit in `component/crm/` is driven by the registry in
  `component/crm/resources.ts`; most entity screens are configuration, not code.

## Common tasks

- Add a CRM field: update the `schema/*` table → `npm run drizzle:generate` →
  `npm run drizzle:migrate`; extend the entity's Zod schema in
  `database/*.server.ts` and its config in `component/crm/resources.ts`.
- Regenerate the better-auth schema: `npm run betterauth:generate`.

## Checks

- `npx tsc --noEmit` — type check.
- `npm test` — data-access + tenant-isolation + conversion tests.
- `npm run build` — production build (enforces the client/server boundary).
