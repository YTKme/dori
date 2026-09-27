import { createFileRoute } from "@tanstack/react-router";

import { account } from "~/_drizzle/database/account.server";
import { handleDelete, handleGet, handleUpdate } from "~/server/rest";

type Ctx = { request: Request; params: { id: string } };

export const Route = createFileRoute("/api/v1/account/$id")({
  server: {
    handlers: {
      GET: ({ request, params }: Ctx) => handleGet(account, request, params.id),
      PATCH: ({ request, params }: Ctx) => handleUpdate(account, request, params.id),
      DELETE: ({ request, params }: Ctx) => handleDelete(account, request, params.id),
    },
  },
});
