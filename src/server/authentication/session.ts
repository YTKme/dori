/**
 * Session
 *
 * Server function exposing the current better-auth session to the router
 * (used by the authenticated layout's `beforeLoad`).
 */

import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

import { auth } from "~/_betterauth/auth.server";

const getCurrentSessionFn = createServerFn({ method: "GET" }).handler(
  async () => {
    return await auth.api.getSession({ headers: getRequestHeaders() });
  },
);

export { getCurrentSessionFn };
