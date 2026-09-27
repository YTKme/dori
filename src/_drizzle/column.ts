/**
 * Shared Column Templates
 *
 * Every business (tenant-scoped) table embeds these columns so that
 * multi-tenancy, ownership and auditing are uniform and impossible to
 * forget. Exposed as functions that return *fresh* column builders on
 * each call — sharing a single builder instance across multiple
 * `pgTable` definitions is unsafe in drizzle.
 */

import { sql } from "drizzle-orm";
import { timestamp, uuid } from "drizzle-orm/pg-core";

import {
  betterauthOrganizationTable,
  betterauthUserTable,
} from "./schema/better-auth";

/** Created / updated / soft-delete timestamps. */
function auditTimestamps() {
  return {
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    deletedAt: timestamp("deleted_at"),
  };
}

/** Who created / owns / last-touched the record. */
function ownership() {
  return {
    ownerId: uuid("owner_id").references(() => betterauthUserTable.id, {
      onDelete: "set null",
    }),
    createdById: uuid("created_by_id").references(
      () => betterauthUserTable.id,
      { onDelete: "set null" },
    ),
    updatedById: uuid("updated_by_id").references(
      () => betterauthUserTable.id,
      { onDelete: "set null" },
    ),
  };
}

/**
 * The full set embedded by every tenant-scoped CRM table:
 * `id`, `organizationId` (tenant key), ownership and audit columns.
 */
function baseColumns() {
  return {
    id: uuid("id").primaryKey().default(sql`uuidv7()`),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => betterauthOrganizationTable.id, {
        onDelete: "cascade",
      }),
    ...ownership(),
    ...auditTimestamps(),
  };
}

export {
  auditTimestamps,
  baseColumns,
  ownership,
};
