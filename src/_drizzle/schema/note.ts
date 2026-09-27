/**
 * Note Table Schema — a free-form note attached to a CRM record.
 */

import { index, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { TABLE_PREFIX } from "../../configuration/global";
import { baseColumns } from "../column";

import { accountTable } from "./account";
import { caseTable } from "./case";
import { contactTable } from "./contact";
import { leadTable } from "./lead";
import { opportunityTable } from "./opportunity";

const noteTable = pgTable(
  `${TABLE_PREFIX}note`,
  {
    ...baseColumns(),
    title: text("title"),
    body: text("body").notNull(),
    accountId: uuid("account_id").references(() => accountTable.id, {
      onDelete: "cascade",
    }),
    contactId: uuid("contact_id").references(() => contactTable.id, {
      onDelete: "cascade",
    }),
    leadId: uuid("lead_id").references(() => leadTable.id, {
      onDelete: "cascade",
    }),
    opportunityId: uuid("opportunity_id").references(
      () => opportunityTable.id,
      { onDelete: "cascade" },
    ),
    caseId: uuid("case_id").references(() => caseTable.id, {
      onDelete: "cascade",
    }),
  },
  (table) => [
    index(`${TABLE_PREFIX}note_organization_id_idx`).on(table.organizationId),
  ],
);

export type Note = typeof noteTable.$inferSelect;
export type NoteCreate = typeof noteTable.$inferInsert;
export type NoteUpdate = Partial<NoteCreate>;
export { noteTable };
