import { createFileRoute } from "@tanstack/react-router";

import { opportunityLineItem } from "~/_drizzle/database/opportunity-line-item.server";
import { handleDelete, handleGet, handleUpdate } from "~/server/rest";

type Ctx = { request: Request; params: { id: string } };

export const Route = createFileRoute("/api/v1/opportunity-line-item/$id")({
  server: {
    handlers: {
      GET: ({ request, params }: Ctx) => handleGet(opportunityLineItem, request, params.id),
      PATCH: ({ request, params }: Ctx) => handleUpdate(opportunityLineItem, request, params.id),
      DELETE: ({ request, params }: Ctx) => handleDelete(opportunityLineItem, request, params.id),
    },
  },
});
