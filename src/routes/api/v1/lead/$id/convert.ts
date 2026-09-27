import { createFileRoute } from "@tanstack/react-router";
import * as z from "zod";

import { convertLead } from "~/server/lead-convert.server";
import { apiError, handle, jsonItem, parseBody } from "~/server/http";
import { requireOrganization } from "~/server/tenancy.server";
import * as uuid from "~/server/uuid";

const bodySchema = z.object({
  createOpportunity: z.boolean().optional(),
  opportunityName: z.string().trim().min(1).optional(),
  stageId: z.string().uuid().nullish(),
});

export const Route = createFileRoute("/api/v1/lead/$id/convert")({
  server: {
    handlers: {
      POST: ({ request, params }: { request: Request; params: { id: string } }) =>
        handle(async () => {
          const ctx = await requireOrganization(request);
          if (!uuid.isValid(params.id)) {
            throw apiError.badRequest("Invalid identifier.");
          }
          const body = await parseBody(request, bodySchema);
          const result = await convertLead({
            id: params.id,
            organizationId: ctx.organizationId,
            actorId: ctx.userId,
            createOpportunity: body.createOpportunity,
            opportunityName: body.opportunityName,
            stageId: body.stageId,
          });
          return jsonItem(result);
        }),
    },
  },
});
