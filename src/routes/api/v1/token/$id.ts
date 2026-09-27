import { createFileRoute } from "@tanstack/react-router";

import {
  personalAccessToken,
  revokeToken,
} from "~/_drizzle/database/personal-access-token.server";
import { apiError, handle, jsonItem } from "~/server/http";
import { requireOrganization } from "~/server/tenancy.server";
import * as uuid from "~/server/uuid";

function sanitize(row: Record<string, unknown>) {
  const { tokenHash: _hash, ...rest } = row;
  return rest;
}

type Ctx = { request: Request; params: { id: string } };

export const Route = createFileRoute("/api/v1/token/$id")({
  server: {
    handlers: {
      GET: ({ request, params }: Ctx) =>
        handle(async () => {
          const ctx = await requireOrganization(request);
          if (!uuid.isValid(params.id)) {
            throw apiError.badRequest("Invalid identifier.");
          }
          const row = await personalAccessToken.retrieveById({
            id: params.id,
            organizationId: ctx.organizationId,
          });
          if (!row) throw apiError.notFound();
          return jsonItem(sanitize(row));
        }),
      DELETE: ({ request, params }: Ctx) =>
        handle(async () => {
          const ctx = await requireOrganization(request);
          if (!uuid.isValid(params.id)) {
            throw apiError.badRequest("Invalid identifier.");
          }
          const row = await revokeToken({
            id: params.id,
            organizationId: ctx.organizationId,
            actorId: ctx.userId,
          });
          if (!row) throw apiError.notFound();
          return jsonItem(sanitize(row));
        }),
    },
  },
});
