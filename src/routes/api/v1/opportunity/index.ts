import { createFileRoute } from "@tanstack/react-router";

import { opportunity } from "~/_drizzle/database/opportunity.server";
import { handleCreate, handleList } from "~/server/rest";

export const Route = createFileRoute("/api/v1/opportunity/")({
  server: {
    handlers: {
      GET: ({ request }: { request: Request }) => handleList(opportunity, request),
      POST: ({ request }: { request: Request }) => handleCreate(opportunity, request),
    },
  },
});
