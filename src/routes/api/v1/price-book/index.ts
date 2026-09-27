import { createFileRoute } from "@tanstack/react-router";

import { priceBook } from "~/_drizzle/database/price-book.server";
import { handleCreate, handleList } from "~/server/rest";

export const Route = createFileRoute("/api/v1/price-book/")({
  server: {
    handlers: {
      GET: ({ request }: { request: Request }) => handleList(priceBook, request),
      POST: ({ request }: { request: Request }) => handleCreate(priceBook, request),
    },
  },
});
