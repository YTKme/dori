import { createFileRoute } from "@tanstack/react-router";

import { opportunityStage } from "~/_drizzle/database/opportunity-stage.server";
import { handleDelete, handleGet, handleUpdate } from "~/server/rest";

type Ctx = { request: Request; params: { id: string } };

export const Route = createFileRoute("/api/v1/opportunity-stage/$id")({
  server: {
    handlers: {
      GET: ({ request, params }: Ctx) => handleGet(opportunityStage, request, params.id),
      PATCH: ({ request, params }: Ctx) => handleUpdate(opportunityStage, request, params.id),
      DELETE: ({ request, params }: Ctx) => handleDelete(opportunityStage, request, params.id),
    },
  },
});
