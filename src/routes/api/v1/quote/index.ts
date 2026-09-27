import { createFileRoute } from "@tanstack/react-router";

import { quote } from "~/_drizzle/database/quote.server";
import { handleCreate, handleList } from "~/server/rest";

export const Route = createFileRoute("/api/v1/quote/")({
  server: {
    handlers: {
      GET: ({ request }: { request: Request }) => handleList(quote, request),
      POST: ({ request }: { request: Request }) => handleCreate(quote, request),
    },
  },
});
