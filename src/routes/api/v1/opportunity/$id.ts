import { createFileRoute } from "@tanstack/react-router";

import { opportunity } from "~/_drizzle/database/opportunity.server";
import { handleDelete, handleGet, handleUpdate } from "~/server/rest";

type Ctx = { request: Request; params: { id: string } };

export const Route = createFileRoute("/api/v1/opportunity/$id")({
  server: {
    handlers: {
      GET: ({ request, params }: Ctx) => handleGet(opportunity, request, params.id),
      PATCH: ({ request, params }: Ctx) => handleUpdate(opportunity, request, params.id),
      DELETE: ({ request, params }: Ctx) => handleDelete(opportunity, request, params.id),
    },
  },
});
