import { createFileRoute } from "@tanstack/react-router";

import { caseComment } from "~/_drizzle/database/case-comment.server";
import { handleDelete, handleGet, handleUpdate } from "~/server/rest";

type Ctx = { request: Request; params: { id: string } };

export const Route = createFileRoute("/api/v1/case-comment/$id")({
  server: {
    handlers: {
      GET: ({ request, params }: Ctx) => handleGet(caseComment, request, params.id),
      PATCH: ({ request, params }: Ctx) => handleUpdate(caseComment, request, params.id),
      DELETE: ({ request, params }: Ctx) => handleDelete(caseComment, request, params.id),
    },
  },
});
