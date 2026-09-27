import { createFileRoute } from "@tanstack/react-router";
import * as z from "zod";

import {
  createToken,
  personalAccessToken,
} from "~/_drizzle/database/personal-access-token.server";
import {
  handle,
  jsonCreated,
  jsonList,
  parseBody,
  parseListQuery,
} from "~/server/http";
import { requireOrganization } from "~/server/tenancy.server";

/** Never expose the token hash. */
function sanitize(row: Record<string, unknown>) {
  const { tokenHash: _hash, ...rest } = row;
  return rest;
}

const createSchema = z.object({
  name: z.string().trim().min(1).max(200),
  expiresAt: z.coerce.date().nullish(),
  scopes: z.string().nullish(),
});

export const Route = createFileRoute("/api/v1/token/")({
  server: {
    handlers: {
      GET: ({ request }: { request: Request }) =>
        handle(async () => {
          const ctx = await requireOrganization(request);
          const query = parseListQuery(request);
          const { data, total } = await personalAccessToken.list({
            organizationId: ctx.organizationId,
            limit: query.limit,
            offset: query.offset,
            sort: query.sort,
            order: query.order,
            q: query.q,
          });
          return jsonList(data.map(sanitize), {
            total,
            limit: query.limit,
            offset: query.offset,
          });
        }),
      POST: ({ request }: { request: Request }) =>
        handle(async () => {
          const ctx = await requireOrganization(request);
          const body = await parseBody(request, createSchema);
          const { token, record } = await createToken({
            organizationId: ctx.organizationId,
            actorId: ctx.userId,
            name: body.name,
            expiresAt: body.expiresAt ?? null,
            scopes: body.scopes ?? null,
          });
          return jsonCreated({ token, record: sanitize(record) });
        }),
    },
  },
});
