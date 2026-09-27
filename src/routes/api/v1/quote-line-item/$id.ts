import { createFileRoute } from "@tanstack/react-router";

import { quoteLineItem } from "~/_drizzle/database/quote-line-item.server";
import { handleDelete, handleGet, handleUpdate } from "~/server/rest";

type Ctx = { request: Request; params: { id: string } };

export const Route = createFileRoute("/api/v1/quote-line-item/$id")({
  server: {
    handlers: {
      GET: ({ request, params }: Ctx) => handleGet(quoteLineItem, request, params.id),
      PATCH: ({ request, params }: Ctx) => handleUpdate(quoteLineItem, request, params.id),
      DELETE: ({ request, params }: Ctx) => handleDelete(quoteLineItem, request, params.id),
    },
  },
});
