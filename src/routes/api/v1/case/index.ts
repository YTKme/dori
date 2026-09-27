import { createFileRoute } from "@tanstack/react-router";

import { supportCase } from "~/_drizzle/database/case.server";
import { handleCreate, handleList } from "~/server/rest";

export const Route = createFileRoute("/api/v1/case/")({
  server: {
    handlers: {
      GET: ({ request }: { request: Request }) => handleList(supportCase, request),
      POST: ({ request }: { request: Request }) => handleCreate(supportCase, request),
    },
  },
});
