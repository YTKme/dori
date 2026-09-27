import { createFileRoute } from "@tanstack/react-router";

import { caseComment } from "~/_drizzle/database/case-comment.server";
import { handleCreate, handleList } from "~/server/rest";

export const Route = createFileRoute("/api/v1/case-comment/")({
  server: {
    handlers: {
      GET: ({ request }: { request: Request }) => handleList(caseComment, request),
      POST: ({ request }: { request: Request }) => handleCreate(caseComment, request),
    },
  },
});
