import { createFileRoute } from "@tanstack/react-router";

import { product } from "~/_drizzle/database/product.server";
import { handleCreate, handleList } from "~/server/rest";

export const Route = createFileRoute("/api/v1/product/")({
  server: {
    handlers: {
      GET: ({ request }: { request: Request }) => handleList(product, request),
      POST: ({ request }: { request: Request }) => handleCreate(product, request),
    },
  },
});
