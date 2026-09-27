import { createFileRoute } from "@tanstack/react-router";

import { priceBookEntry } from "~/_drizzle/database/price-book-entry.server";
import { handleDelete, handleGet, handleUpdate } from "~/server/rest";

type Ctx = { request: Request; params: { id: string } };

export const Route = createFileRoute("/api/v1/price-book-entry/$id")({
  server: {
    handlers: {
      GET: ({ request, params }: Ctx) => handleGet(priceBookEntry, request, params.id),
      PATCH: ({ request, params }: Ctx) => handleUpdate(priceBookEntry, request, params.id),
      DELETE: ({ request, params }: Ctx) => handleDelete(priceBookEntry, request, params.id),
    },
  },
});
