import { createFileRoute } from "@tanstack/react-router";

import { opportunityStage } from "~/_drizzle/database/opportunity-stage.server";
import { handleCreate, handleList } from "~/server/rest";

export const Route = createFileRoute("/api/v1/opportunity-stage/")({
  server: {
    handlers: {
      GET: ({ request }: { request: Request }) => handleList(opportunityStage, request),
      POST: ({ request }: { request: Request }) => handleCreate(opportunityStage, request),
    },
  },
});
