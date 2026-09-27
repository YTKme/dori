import { createFileRoute } from "@tanstack/react-router";

import { note } from "~/_drizzle/database/note.server";
import { handleCreate, handleList } from "~/server/rest";

export const Route = createFileRoute("/api/v1/note/")({
  server: {
    handlers: {
      GET: ({ request }: { request: Request }) => handleList(note, request),
      POST: ({ request }: { request: Request }) => handleCreate(note, request),
    },
  },
});
