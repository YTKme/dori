import { createFileRoute } from "@tanstack/react-router";

import { priceBookEntry } from "~/_drizzle/database/price-book-entry.server";
import { handleCreate, handleList } from "~/server/rest";

export const Route = createFileRoute("/api/v1/price-book-entry/")({
  server: {
    handlers: {
      GET: ({ request }: { request: Request }) => handleList(priceBookEntry, request),
      POST: ({ request }: { request: Request }) => handleCreate(priceBookEntry, request),
    },
  },
});
