/**
 * Activity Table Schema — a task, call, meeting or logged email. Related
 * parent records are referenced through typed nullable foreign keys so
 * referential integrity is preserved (as opposed to a polymorphic pair).
 */

import {
  boolean,
  date,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { TABLE_PREFIX } from "../../configuration/global";
import type {
  ActivityPriority,
  ActivityStatus,
  ActivityType,
} from "../../type/enum";
import { baseColumns } from "../column";

import { accountTable } from "./account";
import { campaignTable } from "./campaign";
import { caseTable } from "./case";
import { contactTable } from "./contact";
import { leadTable } from "./lead";
import { opportunityTable } from "./opportunity";

const activityTable = pgTable(
  `${TABLE_PREFIX}activity`,
  {
    ...baseColumns(),
    type: text("type").$type<ActivityType>().notNull().default("task"),
    subject: text("subject").notNull(),
    description: text("description"),
    status: text("status").$type<ActivityStatus>().notNull().default("open"),
    priority: text("priority")
      .$type<ActivityPriority>()
      .notNull()
      .default("normal"),
    dueDate: date("due_date", { mode: "string" }),
    activityDate: timestamp("activity_date"),
    durationMinutes: integer("duration_minutes"),
    isClosed: boolean("is_closed").notNull().default(false),
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
    campaignId: uuid("campaign_id").references(() => campaignTable.id, {
      onDelete: "cascade",
    }),
  },
  (table) => [
    index(`${TABLE_PREFIX}activity_organization_id_idx`).on(
      table.organizationId,
    ),
    index(`${TABLE_PREFIX}activity_owner_id_idx`).on(table.ownerId),
    index(`${TABLE_PREFIX}activity_due_date_idx`).on(
      table.organizationId,
      table.dueDate,
    ),
  ],
);

export type Activity = typeof activityTable.$inferSelect;
export type ActivityCreate = typeof activityTable.$inferInsert;
export type ActivityUpdate = Partial<ActivityCreate>;
export { activityTable };
