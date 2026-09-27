import { createFileRoute } from "@tanstack/react-router";

import { opportunityLineItem } from "~/_drizzle/database/opportunity-line-item.server";
import { handleCreate, handleList } from "~/server/rest";

export const Route = createFileRoute("/api/v1/opportunity-line-item/")({
  server: {
    handlers: {
      GET: ({ request }: { request: Request }) => handleList(opportunityLineItem, request),
      POST: ({ request }: { request: Request }) => handleCreate(opportunityLineItem, request),
    },
  },
});
