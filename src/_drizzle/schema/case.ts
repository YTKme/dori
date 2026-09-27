/**
 * Case Table Schema — a customer service / support ticket.
 */

import {
  type AnyPgColumn,
  boolean,
  index,
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core";

import { TABLE_PREFIX } from "../../configuration/global";
import type {
  CaseOrigin,
  CasePriority,
  CaseStatus,
  CaseType,
} from "../../type/enum";
import { baseColumns } from "../column";

import { accountTable } from "./account";
import { contactTable } from "./contact";

const caseTable = pgTable(
  `${TABLE_PREFIX}case`,
  {
    ...baseColumns(),
    caseNumber: text("case_number"),
    subject: text("subject").notNull(),
    description: text("description"),
    status: text("status").$type<CaseStatus>().notNull().default("new"),
    priority: text("priority")
      .$type<CasePriority>()
      .notNull()
      .default("medium"),
    origin: text("origin").$type<CaseOrigin>(),
    type: text("type").$type<CaseType>(),
    reason: text("reason"),
    accountId: uuid("account_id").references(() => accountTable.id, {
      onDelete: "set null",
    }),
    contactId: uuid("contact_id").references(() => contactTable.id, {
      onDelete: "set null",
    }),
    parentCaseId: uuid("parent_case_id").references(
      (): AnyPgColumn => caseTable.id,
      { onDelete: "set null" },
    ),
    isClosed: boolean("is_closed").notNull().default(false),
  },
  (table) => [
    index(`${TABLE_PREFIX}case_organization_id_idx`).on(table.organizationId),
    index(`${TABLE_PREFIX}case_status_idx`).on(
      table.organizationId,
      table.status,
    ),
    index(`${TABLE_PREFIX}case_account_id_idx`).on(table.accountId),
  ],
);

export type Case = typeof caseTable.$inferSelect;
export type CaseCreate = typeof caseTable.$inferInsert;
export type CaseUpdate = Partial<CaseCreate>;
export { caseTable };
