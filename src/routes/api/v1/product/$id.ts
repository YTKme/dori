import { createFileRoute } from "@tanstack/react-router";

import { product } from "~/_drizzle/database/product.server";
import { handleDelete, handleGet, handleUpdate } from "~/server/rest";

type Ctx = { request: Request; params: { id: string } };

export const Route = createFileRoute("/api/v1/product/$id")({
  server: {
    handlers: {
      GET: ({ request, params }: Ctx) => handleGet(product, request, params.id),
      PATCH: ({ request, params }: Ctx) => handleUpdate(product, request, params.id),
      DELETE: ({ request, params }: Ctx) => handleDelete(product, request, params.id),
    },
  },
});
