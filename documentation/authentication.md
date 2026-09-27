# Authentication

Authentication is handled by [better-auth](https://www.better-auth.com/),
configured in [`src/_betterauth/auth.server.ts`](../src/_betterauth/auth.server.ts)
and exposed to the browser via
[`auth-client.ts`](../src/_betterauth/auth-client.ts).

## Methods

- **Email + password** with the **username** plugin (sign in with username or
  email). Minimum password length 8.
- **Personal Access Tokens** for the REST API (`Authorization: Bearer`).

## Sessions

Sessions are persisted in PostgreSQL through the Drizzle adapter and cached in
**Redis** (secondary storage) with a short cookie cache. The handler is mounted
at `/api/auth/*` ([`routes/api/auth/$.ts`](../src/routes/api/auth/$.ts)).

## Server/client boundary

`auth.server.ts` and other database/secret-touching modules use the
`.server.ts` suffix and are only referenced from server code (server functions
or inside route `server.handlers`). This keeps `redis`, `pg` and secrets out of
the client bundle.

## Flow

1. Register (`/register`) → creates the user.
2. Onboarding (`/onboarding`) → create or select an organization (sets it active).
3. Authenticated app under `/_authed/*`; the layout's `beforeLoad` requires a
   session and an active organization.
