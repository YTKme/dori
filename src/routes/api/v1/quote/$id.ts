import { createFileRoute } from "@tanstack/react-router";

import { quote } from "~/_drizzle/database/quote.server";
import { handleDelete, handleGet, handleUpdate } from "~/server/rest";

type Ctx = { request: Request; params: { id: string } };

export const Route = createFileRoute("/api/v1/quote/$id")({
  server: {
    handlers: {
      GET: ({ request, params }: Ctx) => handleGet(quote, request, params.id),
      PATCH: ({ request, params }: Ctx) => handleUpdate(quote, request, params.id),
      DELETE: ({ request, params }: Ctx) => handleDelete(quote, request, params.id),
    },
  },
});
