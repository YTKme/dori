import { createFileRoute } from "@tanstack/react-router";

import { account } from "~/_drizzle/database/account.server";
import { handleCreate, handleList } from "~/server/rest";

export const Route = createFileRoute("/api/v1/account/")({
  server: {
    handlers: {
      GET: ({ request }: { request: Request }) => handleList(account, request),
      POST: ({ request }: { request: Request }) => handleCreate(account, request),
    },
  },
});
