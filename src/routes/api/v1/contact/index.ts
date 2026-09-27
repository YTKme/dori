import { createFileRoute } from "@tanstack/react-router";

import { contact } from "~/_drizzle/database/contact.server";
import { handleCreate, handleList } from "~/server/rest";

export const Route = createFileRoute("/api/v1/contact/")({
  server: {
    handlers: {
      GET: ({ request }: { request: Request }) => handleList(contact, request),
      POST: ({ request }: { request: Request }) => handleCreate(contact, request),
    },
  },
});
