import { createFileRoute } from "@tanstack/react-router";

import { campaign } from "~/_drizzle/database/campaign.server";
import { handleCreate, handleList } from "~/server/rest";

export const Route = createFileRoute("/api/v1/campaign/")({
  server: {
    handlers: {
      GET: ({ request }: { request: Request }) => handleList(campaign, request),
      POST: ({ request }: { request: Request }) => handleCreate(campaign, request),
    },
  },
});
