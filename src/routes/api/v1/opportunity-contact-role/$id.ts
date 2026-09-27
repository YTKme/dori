import { createFileRoute } from "@tanstack/react-router";

import { opportunityContactRole } from "~/_drizzle/database/opportunity-contact-role.server";
import { handleDelete, handleGet, handleUpdate } from "~/server/rest";

type Ctx = { request: Request; params: { id: string } };

export const Route = createFileRoute("/api/v1/opportunity-contact-role/$id")({
  server: {
    handlers: {
      GET: ({ request, params }: Ctx) => handleGet(opportunityContactRole, request, params.id),
      PATCH: ({ request, params }: Ctx) => handleUpdate(opportunityContactRole, request, params.id),
      DELETE: ({ request, params }: Ctx) => handleDelete(opportunityContactRole, request, params.id),
    },
  },
});
