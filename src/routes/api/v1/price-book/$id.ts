import { createFileRoute } from "@tanstack/react-router";

import { priceBook } from "~/_drizzle/database/price-book.server";
import { handleDelete, handleGet, handleUpdate } from "~/server/rest";

type Ctx = { request: Request; params: { id: string } };

export const Route = createFileRoute("/api/v1/price-book/$id")({
  server: {
    handlers: {
      GET: ({ request, params }: Ctx) => handleGet(priceBook, request, params.id),
      PATCH: ({ request, params }: Ctx) => handleUpdate(priceBook, request, params.id),
      DELETE: ({ request, params }: Ctx) => handleDelete(priceBook, request, params.id),
    },
  },
});
