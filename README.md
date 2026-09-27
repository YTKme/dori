# Dori

**Dori** is a self-hostable, multi-tenant CRM — think a compact, open
alternative to Salesforce or Odoo. It ships as a self-contained appliance:
`docker compose up` gives you the application, PostgreSQL and Redis with no
external services required.

## Table of Contents

- [Features](#features)
- [Technology](#technology)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [REST API](#rest-api)
- [Testing](#testing)
- [Documentation](#documentation)

## Features

- **Multi-tenant** — one installation serves many isolated organizations.
- **Sales** — Leads (with one-click conversion), Accounts, Contacts,
  Opportunities with a configurable, drag-and-drop **pipeline**.
- **Products / CPQ** — Products, Price Books, Price Book Entries, Quotes and
  line items.
- **Service** — Cases and case comments.
- **Marketing** — Campaigns and campaign members.
- **Engagement** — Activities (tasks, calls, meetings, emails) and Notes.
- **RESTful API** — full CRUD for every object with pagination, filtering,
  sorting and relation expansion, authenticated by session cookie or
  Personal Access Token.
- **Auditing** — every record carries owner, created/updated by, timestamps
  and soft-delete.

## Technology

- [TanStack Start](https://tanstack.com/start) (React 19) + Nitro
- [Drizzle ORM](https://orm.drizzle.team/) (1.0 RC) + [PostgreSQL 18](https://www.postgresql.org/)
- [better-auth](https://www.better-auth.com/) (email/password, username &
  organization plugins) with Redis secondary storage
- [shadcn/ui](https://ui.shadcn.com/) (`base-nova`, on Base UI) + Tailwind CSS v4
- [Zod](https://zod.dev/) validation, [Vitest](https://vitest.dev/) tests

## Quick Start

### As an appliance (Docker)

```bash
cp .env.example .env
# edit .env: set strong BETTER_AUTH_SECRET and database/redis passwords,
# optionally set DORI_SEED="true" to plant demo data on first boot.
docker compose up -d
```

Open <http://localhost:3000>, register, and create your organization.

### Local development

Requires Node 22+ and either a local PostgreSQL 18 + Redis, or:

```bash
docker compose -f docker-compose.dev.yml up -d   # Postgres + Redis
npm install
npm run drizzle:migrate                            # apply migrations
npm run drizzle:plant                              # optional: demo data
npm run dev                                         # http://localhost:3000
```

Demo login after planting: **admin / password123**.

## Configuration

All configuration is via environment variables (see [`.env.example`](.env.example)).
Key groups: `DORI_APPLICATION_*` (public URL), `DORI_POSTGRESQL_*`,
`DORI_REDIS_*`, and `BETTER_AUTH_SECRET` / `BETTER_AUTH_URL`.

## Project Structure

```
src/
  _betterauth/     better-auth server config + browser client
  _drizzle/        database: schema/, database/ (data access), relation, seeds
  _shadcn/         UI primitives (Base UI + Tailwind)
  component/       app components incl. component/crm/ (generic CRUD kit)
  configuration/   env-validated config (drizzle, redis, application, global)
  library/         browser API client
  routes/          file-based routes: _authed/ app, api/v1/ REST, api/auth/
  server/          tenancy guard, REST helpers, validation, lead conversion
  type/            shared types & picklist enums
```

See [`documentation/`](documentation/) for the schema, API, tenancy,
authentication and deployment guides.

## REST API

Base path `/api/v1`. Every request is tenant-scoped to the caller's active
organization. Examples:

```bash
# List accounts (paginated, searchable, sortable, expandable)
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3000/api/v1/account?limit=25&q=acme&sort=name&expand=owner"

# Create a contact
curl -X POST -H "Authorization: Bearer <token>" -H "content-type: application/json" \
  -d '{"lastName":"Hopper","accountId":"<uuid>"}' \
  http://localhost:3000/api/v1/contact

# Convert a lead
curl -X POST -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/v1/lead/<id>/convert
```

Full reference: [`documentation/api.md`](documentation/api.md).

## Testing

```bash
docker compose -f docker-compose.dev.yml up -d
npm run drizzle:migrate   # (once) applies to the dev DB
npm test
```

The suite covers data-access CRUD, **cross-tenant isolation**, soft-delete and
lead conversion.

## Documentation

- [Schema](documentation/schema.md)
- [REST API](documentation/api.md)
- [Tenancy](documentation/tenancy.md)
- [Authentication](documentation/authentication.md)
- [Deployment](documentation/deployment.md)
- [Entity diagram](documentation/entity.mermaid)
