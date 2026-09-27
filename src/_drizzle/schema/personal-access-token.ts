/**
 * Personal Access Token Table Schema — org-scoped API tokens for
 * programmatic REST access. Only the SHA-256 hash of the token is
 * stored; the plaintext is shown once at creation time. The token
 * resolves to its `organizationId` (tenant) and `ownerId` (acting user).
 */

import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { TABLE_PREFIX } from "../../configuration/global";
import { baseColumns } from "../column";

const personalAccessTokenTable = pgTable(
  `${TABLE_PREFIX}personal_access_token`,
  {
    ...baseColumns(),
    name: text("name").notNull(),
    tokenHash: text("token_hash").notNull().unique(),
    tokenPrefix: text("token_prefix").notNull(),
    lastFour: text("last_four"),
    // Comma-separated scopes; null means full access for the owner.
    scopes: text("scopes"),
    expiresAt: timestamp("expires_at"),
    lastUsedAt: timestamp("last_used_at"),
    revokedAt: timestamp("revoked_at"),
  },
  (table) => [
    index(`${TABLE_PREFIX}pat_organization_id_idx`).on(table.organizationId),
    index(`${TABLE_PREFIX}pat_owner_id_idx`).on(table.ownerId),
    index(`${TABLE_PREFIX}pat_token_hash_idx`).on(table.tokenHash),
  ],
);

export type PersonalAccessToken =
  typeof personalAccessTokenTable.$inferSelect;
export type PersonalAccessTokenCreate =
  typeof personalAccessTokenTable.$inferInsert;
export type PersonalAccessTokenUpdate =
  Partial<PersonalAccessTokenCreate>;
export { personalAccessTokenTable };
