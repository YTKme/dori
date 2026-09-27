import { createFileRoute } from "@tanstack/react-router";

import { campaignMember } from "~/_drizzle/database/campaign-member.server";
import { handleDelete, handleGet, handleUpdate } from "~/server/rest";

type Ctx = { request: Request; params: { id: string } };

export const Route = createFileRoute("/api/v1/campaign-member/$id")({
  server: {
    handlers: {
      GET: ({ request, params }: Ctx) => handleGet(campaignMember, request, params.id),
      PATCH: ({ request, params }: Ctx) => handleUpdate(campaignMember, request, params.id),
      DELETE: ({ request, params }: Ctx) => handleDelete(campaignMember, request, params.id),
    },
  },
});
