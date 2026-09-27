import { createFileRoute } from "@tanstack/react-router";

import { opportunityContactRole } from "~/_drizzle/database/opportunity-contact-role.server";
import { handleCreate, handleList } from "~/server/rest";

export const Route = createFileRoute("/api/v1/opportunity-contact-role/")({
  server: {
    handlers: {
      GET: ({ request }: { request: Request }) => handleList(opportunityContactRole, request),
      POST: ({ request }: { request: Request }) => handleCreate(opportunityContactRole, request),
    },
  },
});
