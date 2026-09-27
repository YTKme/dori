import { createFileRoute } from "@tanstack/react-router";

import { activity } from "~/_drizzle/database/activity.server";
import { handleCreate, handleList } from "~/server/rest";

export const Route = createFileRoute("/api/v1/activity/")({
  server: {
    handlers: {
      GET: ({ request }: { request: Request }) => handleList(activity, request),
      POST: ({ request }: { request: Request }) => handleCreate(activity, request),
    },
  },
});
