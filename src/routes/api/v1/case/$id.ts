import { createFileRoute } from "@tanstack/react-router";

import { supportCase } from "~/_drizzle/database/case.server";
import { handleDelete, handleGet, handleUpdate } from "~/server/rest";

type Ctx = { request: Request; params: { id: string } };

export const Route = createFileRoute("/api/v1/case/$id")({
  server: {
    handlers: {
      GET: ({ request, params }: Ctx) => handleGet(supportCase, request, params.id),
      PATCH: ({ request, params }: Ctx) => handleUpdate(supportCase, request, params.id),
      DELETE: ({ request, params }: Ctx) => handleDelete(supportCase, request, params.id),
    },
  },
});
