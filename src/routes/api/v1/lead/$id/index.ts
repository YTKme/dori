import { createFileRoute } from "@tanstack/react-router";

import { lead } from "~/_drizzle/database/lead.server";
import { handleDelete, handleGet, handleUpdate } from "~/server/rest";

type Ctx = { request: Request; params: { id: string } };

export const Route = createFileRoute("/api/v1/lead/$id/")({
  server: {
    handlers: {
      GET: ({ request, params }: Ctx) => handleGet(lead, request, params.id),
      PATCH: ({ request, params }: Ctx) => handleUpdate(lead, request, params.id),
      DELETE: ({ request, params }: Ctx) => handleDelete(lead, request, params.id),
    },
  },
});
