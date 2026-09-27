/**
 * Opportunity Contact Role Table Schema — junction linking contacts to
 * an opportunity with their role in the deal.
 */

import { boolean, index, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { TABLE_PREFIX } from "../../configuration/global";
import { baseColumns } from "../column";

import { contactTable } from "./contact";
import { opportunityTable } from "./opportunity";

const opportunityContactRoleTable = pgTable(
  `${TABLE_PREFIX}opportunity_contact_role`,
  {
    ...baseColumns(),
    opportunityId: uuid("opportunity_id")
      .notNull()
      .references(() => opportunityTable.id, { onDelete: "cascade" }),
    contactId: uuid("contact_id")
      .notNull()
      .references(() => contactTable.id, { onDelete: "cascade" }),
    role: text("role"),
    isPrimary: boolean("is_primary").notNull().default(false),
  },
  (table) => [
    index(`${TABLE_PREFIX}opp_contact_role_organization_id_idx`).on(
      table.organizationId,
    ),
    index(`${TABLE_PREFIX}opp_contact_role_opportunity_id_idx`).on(
      table.opportunityId,
    ),
    index(`${TABLE_PREFIX}opp_contact_role_contact_id_idx`).on(
      table.contactId,
    ),
  ],
);

export type OpportunityContactRole =
  typeof opportunityContactRoleTable.$inferSelect;
export type OpportunityContactRoleCreate =
  typeof opportunityContactRoleTable.$inferInsert;
export type OpportunityContactRoleUpdate =
  Partial<OpportunityContactRoleCreate>;
export { opportunityContactRoleTable };
