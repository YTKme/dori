import { createFileRoute } from "@tanstack/react-router";

import { contact } from "~/_drizzle/database/contact.server";
import { handleDelete, handleGet, handleUpdate } from "~/server/rest";

type Ctx = { request: Request; params: { id: string } };

export const Route = createFileRoute("/api/v1/contact/$id")({
  server: {
    handlers: {
      GET: ({ request, params }: Ctx) => handleGet(contact, request, params.id),
      PATCH: ({ request, params }: Ctx) => handleUpdate(contact, request, params.id),
      DELETE: ({ request, params }: Ctx) => handleDelete(contact, request, params.id),
    },
  },
});
