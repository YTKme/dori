/**
 * better-auth request handler.
 *
 * Mounts better-auth at `/api/auth/*` so the browser auth client
 * (sign-in/up, session, organization) works. `auth.server` is stripped
 * from the client bundle; the handler runs server-side only.
 */

import { createFileRoute } from "@tanstack/react-router";

import { auth } from "~/_betterauth/auth.server";

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request }: { request: Request }) => auth.handler(request),
      POST: ({ request }: { request: Request }) => auth.handler(request),
    },
  },
});
