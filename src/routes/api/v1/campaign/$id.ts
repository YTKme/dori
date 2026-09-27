import { createFileRoute } from "@tanstack/react-router";

import { campaign } from "~/_drizzle/database/campaign.server";
import { handleDelete, handleGet, handleUpdate } from "~/server/rest";

type Ctx = { request: Request; params: { id: string } };

export const Route = createFileRoute("/api/v1/campaign/$id")({
  server: {
    handlers: {
      GET: ({ request, params }: Ctx) => handleGet(campaign, request, params.id),
      PATCH: ({ request, params }: Ctx) => handleUpdate(campaign, request, params.id),
      DELETE: ({ request, params }: Ctx) => handleDelete(campaign, request, params.id),
    },
  },
});
