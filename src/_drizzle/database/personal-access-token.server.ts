import { and, eq } from "drizzle-orm";

import { generateAccessToken } from "../../server/token.server";
import { drizzleClient } from "../client";
import type { PersonalAccessToken } from "../schema/personal-access-token";
import { personalAccessTokenTable } from "../schema/personal-access-token";
import { createResource } from "./resource";

export const personalAccessToken = createResource<
  PersonalAccessToken,
  typeof personalAccessTokenTable.$inferInsert
>({
  queryKey: "personalAccessTokenTable",
  table: personalAccessTokenTable,
  searchColumns: ["name", "tokenPrefix"],
  sortColumns: ["name", "createdAt", "lastUsedAt"],
  filterColumns: ["ownerId"],
  allowedExpand: ["owner"],
  defaultSort: "createdAt",
});

/**
 * Create a new token. The plaintext `token` is returned exactly once and
 * never persisted (only its hash is stored).
 */
async function createToken(params: {
  organizationId: string;
  actorId?: string | null;
  name: string;
  scopes?: string | null;
  expiresAt?: Date | null;
}): Promise<{ token: string; record: PersonalAccessToken }> {
  const { token, hash, prefix, lastFour } = generateAccessToken();
  const rows = await drizzleClient
    .insert(personalAccessTokenTable)
    .values({
      organizationId: params.organizationId,
      ownerId: params.actorId ?? null,
      createdById: params.actorId ?? null,
      updatedById: params.actorId ?? null,
      name: params.name,
      tokenHash: hash,
      tokenPrefix: prefix,
      lastFour,
      scopes: params.scopes ?? null,
      expiresAt: params.expiresAt ?? null,
    })
    .returning();
  return { token, record: rows[0] };
}

/** Revoke a token (kept for audit; not deleted). */
async function revokeToken(params: {
  id: string;
  organizationId: string;
  actorId?: string | null;
}): Promise<PersonalAccessToken | undefined> {
  const rows = await drizzleClient
    .update(personalAccessTokenTable)
    .set({ revokedAt: new Date(), updatedById: params.actorId ?? null })
    .where(
      and(
        eq(personalAccessTokenTable.id, params.id),
        eq(personalAccessTokenTable.organizationId, params.organizationId),
      ),
    )
    .returning();
  return rows[0];
}

export { createToken, revokeToken };
