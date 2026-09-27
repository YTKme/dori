/**
 * Multi-tenancy Guard
 *
 * `requireOrganization` resolves the caller (session cookie or Bearer
 * personal access token) to an active organization and verifies
 * membership. Every API handler calls this first and passes the returned
 * `organizationId` down to the tenant-scoped data-access layer, so tenant
 * isolation is structural rather than per-route boilerplate.
 */

import { and, eq, isNull } from "drizzle-orm";

import { auth } from "~/_betterauth/auth.server";
import { drizzleClient } from "~/_drizzle/client";
import { betterauthMemberTable } from "~/_drizzle/schema/better-auth";
import { personalAccessTokenTable } from "~/_drizzle/schema/personal-access-token";

import { apiError } from "./http";
import { hashToken } from "./token.server";

type TenantContext = {
  organizationId: string;
  userId: string | null;
  role: string | null;
  via: "session" | "token";
};

async function requireOrganization(request: Request): Promise<TenantContext> {
  const authorization = request.headers.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return resolveToken(authorization.slice(7).trim());
  }
  return resolveSession(request);
}

async function resolveSession(request: Request): Promise<TenantContext> {
  const result = await auth.api.getSession({ headers: request.headers });
  if (!result) {
    throw apiError.unauthorized();
  }

  const organizationId = (
    result.session as { activeOrganizationId?: string | null }
  ).activeOrganizationId;
  if (!organizationId) {
    throw apiError.badRequest("No active organization selected.");
  }

  const membership = await drizzleClient
    .select({ role: betterauthMemberTable.role })
    .from(betterauthMemberTable)
    .where(
      and(
        eq(betterauthMemberTable.organizationId, organizationId),
        eq(betterauthMemberTable.userId, result.user.id),
      ),
    )
    .limit(1);

  if (!membership[0]) {
    throw apiError.forbidden(
      "You are not a member of the active organization.",
    );
  }

  return {
    organizationId,
    userId: result.user.id,
    role: membership[0].role,
    via: "session",
  };
}

async function resolveToken(token: string): Promise<TenantContext> {
  const rows = await drizzleClient
    .select()
    .from(personalAccessTokenTable)
    .where(
      and(
        eq(personalAccessTokenTable.tokenHash, hashToken(token)),
        isNull(personalAccessTokenTable.revokedAt),
        isNull(personalAccessTokenTable.deletedAt),
      ),
    )
    .limit(1);

  const pat = rows[0];
  if (!pat) {
    throw apiError.unauthorized("Invalid API token.");
  }
  if (pat.expiresAt && pat.expiresAt.getTime() < Date.now()) {
    throw apiError.unauthorized("API token has expired.");
  }

  // Best-effort "last used" timestamp; never block the request on it.
  void (async () => {
    try {
      await drizzleClient
        .update(personalAccessTokenTable)
        .set({ lastUsedAt: new Date() })
        .where(eq(personalAccessTokenTable.id, pat.id));
    } catch {
      /* ignore */
    }
  })();

  return {
    organizationId: pat.organizationId,
    userId: pat.ownerId,
    role: "member",
    via: "token",
  };
}

export { requireOrganization, type TenantContext };
