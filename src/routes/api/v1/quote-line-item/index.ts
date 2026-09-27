import { createFileRoute } from "@tanstack/react-router";

import { quoteLineItem } from "~/_drizzle/database/quote-line-item.server";
import { handleCreate, handleList } from "~/server/rest";

export const Route = createFileRoute("/api/v1/quote-line-item/")({
  server: {
    handlers: {
      GET: ({ request }: { request: Request }) => handleList(quoteLineItem, request),
      POST: ({ request }: { request: Request }) => handleCreate(quoteLineItem, request),
    },
  },
});
