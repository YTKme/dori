import { createFileRoute } from "@tanstack/react-router";

import { lead } from "~/_drizzle/database/lead.server";
import { handleCreate, handleList } from "~/server/rest";

export const Route = createFileRoute("/api/v1/lead/")({
  server: {
    handlers: {
      GET: ({ request }: { request: Request }) => handleList(lead, request),
      POST: ({ request }: { request: Request }) => handleCreate(lead, request),
    },
  },
});
