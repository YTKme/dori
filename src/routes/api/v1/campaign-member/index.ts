import { createFileRoute } from "@tanstack/react-router";

import { campaignMember } from "~/_drizzle/database/campaign-member.server";
import { handleCreate, handleList } from "~/server/rest";

export const Route = createFileRoute("/api/v1/campaign-member/")({
  server: {
    handlers: {
      GET: ({ request }: { request: Request }) => handleList(campaignMember, request),
      POST: ({ request }: { request: Request }) => handleCreate(campaignMember, request),
    },
  },
});
