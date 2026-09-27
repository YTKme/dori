import { createFileRoute } from "@tanstack/react-router";

import { activity } from "~/_drizzle/database/activity.server";
import { handleDelete, handleGet, handleUpdate } from "~/server/rest";

type Ctx = { request: Request; params: { id: string } };

export const Route = createFileRoute("/api/v1/activity/$id")({
  server: {
    handlers: {
      GET: ({ request, params }: Ctx) => handleGet(activity, request, params.id),
      PATCH: ({ request, params }: Ctx) => handleUpdate(activity, request, params.id),
      DELETE: ({ request, params }: Ctx) => handleDelete(activity, request, params.id),
    },
  },
});
