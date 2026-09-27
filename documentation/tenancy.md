# Multi-tenancy

Dori is multi-tenant: a single installation hosts many isolated
**organizations**. Organizations, members, invitations and teams are provided
by the better-auth [organization plugin](https://www.better-auth.com/docs/plugins/organization).

## How isolation works

1. A user signs in and selects an **active organization** (stored on the
   session as `activeOrganizationId`).
2. Every CRM row carries an `organizationId` (the tenant key).
3. Every API request passes through
   [`requireOrganization`](../src/server/tenancy.server.ts), which:
   - resolves the caller from the session cookie **or** a Personal Access Token;
   - reads the active organization;
   - verifies the caller is a `member` of it (else `403`).
4. Every data-access call is scoped: `WHERE organization_id = $active AND deleted_at IS NULL`.
   Creates inject the tenant + owner; updates/deletes only match within the tenant.

Because scoping lives in one generic data-access layer
([`resource.ts`](../src/_drizzle/database/resource.ts)) and one guard, tenant
isolation is structural rather than per-route boilerplate. It is covered by
[`test/drizzle/tenant-isolation.test.ts`](../test/drizzle/tenant-isolation.test.ts).

## New-organization defaults

When an organization is created, a default sales pipeline (six stages) is
seeded via the `afterCreateOrganization` hook — see
[`organization-defaults.server.ts`](../src/server/organization-defaults.server.ts).

## Roles

better-auth provides `owner`, `admin` and `member` roles per organization.
Membership is required for any access; finer-grained field/record permissions
can be layered on later.
