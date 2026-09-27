import { createFileRoute } from "@tanstack/react-router";

import { note } from "~/_drizzle/database/note.server";
import { handleDelete, handleGet, handleUpdate } from "~/server/rest";

type Ctx = { request: Request; params: { id: string } };

export const Route = createFileRoute("/api/v1/note/$id")({
  server: {
    handlers: {
      GET: ({ request, params }: Ctx) => handleGet(note, request, params.id),
      PATCH: ({ request, params }: Ctx) => handleUpdate(note, request, params.id),
      DELETE: ({ request, params }: Ctx) => handleDelete(note, request, params.id),
    },
  },
});
