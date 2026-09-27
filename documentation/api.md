# REST API

Base path: `/api/v1`. All responses are JSON. All requests are scoped to the
caller's **active organization** (tenant).

## Authentication

- **Session cookie** — used by the web app (better-auth).
- **Personal Access Token** — `Authorization: Bearer dori_pat_…`. Create and
  revoke tokens under Settings → API Tokens, or `POST /api/v1/token`.

## Resources

Each CRM object exposes a collection and an item endpoint:

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/<entity>` | List (paginated, filtered, sorted, expandable) |
| `POST` | `/api/v1/<entity>` | Create |
| `GET` | `/api/v1/<entity>/{id}` | Retrieve |
| `PATCH` | `/api/v1/<entity>/{id}` | Update |
| `DELETE` | `/api/v1/<entity>/{id}` | Soft delete (`?hard=true` to remove) |

Entities: `account`, `contact`, `lead`, `opportunity`, `opportunity-stage`,
`opportunity-contact-role`, `product`, `price-book`, `price-book-entry`,
`opportunity-line-item`, `quote`, `quote-line-item`, `case`, `case-comment`,
`campaign`, `campaign-member`, `activity`, `note`, `token`.

Special actions:

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/v1/lead/{id}/convert` | Convert a lead (body: `createOpportunity`, `opportunityName`, `stageId`) |

## List query parameters

| Param | Meaning |
|---|---|
| `limit` | Page size (default 25, max 200) |
| `offset` | Page offset |
| `sort` | Sort field (allow-listed per entity) |
| `order` | `asc` \| `desc` (default `desc`) |
| `q` | Full-text-ish search over the entity's text columns |
| `expand` | Comma-separated relations to include (e.g. `owner,account`) |
| *other* | Any allow-listed field is treated as an equality filter, e.g. `?status=new&accountId=<uuid>` |

## Response envelopes

```jsonc
// list
{ "data": [ ... ], "pagination": { "total": 42, "limit": 25, "offset": 0 } }
// item
{ "data": { ... } }
// error
{ "error": { "message": "…", "code": "not_found", "details": [ ... ] } }
```

## Status codes

`200` OK · `201` Created · `400` bad request · `401` unauthorized ·
`403` forbidden (not a member of the active org) · `404` not found ·
`409` conflict · `422` validation error · `500` internal error.
