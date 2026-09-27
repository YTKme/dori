/**
 * Lead Table Schema — an unqualified prospect that can be converted into
 * an account, contact and (optionally) an opportunity.
 */

import {
  boolean,
  date,
  index,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { TABLE_PREFIX } from "../../configuration/global";
import type { LeadSource, LeadStatus, Rating } from "../../type/enum";
import { baseColumns } from "../column";

import { accountTable } from "./account";
import { contactTable } from "./contact";
import { opportunityTable } from "./opportunity";

const leadTable = pgTable(
  `${TABLE_PREFIX}lead`,
  {
    ...baseColumns(),
    salutation: text("salutation"),
    firstName: text("first_name"),
    lastName: text("last_name").notNull(),
    company: text("company").notNull(),
    title: text("title"),
    email: text("email"),
    phone: text("phone"),
    mobile: text("mobile"),
    website: text("website"),
    leadSource: text("lead_source").$type<LeadSource>(),
    status: text("status").$type<LeadStatus>().notNull().default("new"),
    rating: text("rating").$type<Rating>(),
    industry: text("industry"),
    annualRevenue: numeric("annual_revenue", { precision: 15, scale: 2 }),
    numberOfEmployees: integer("number_of_employees"),
    street: text("street"),
    city: text("city"),
    state: text("state"),
    postalCode: text("postal_code"),
    country: text("country"),
    description: text("description"),
    isConverted: boolean("is_converted").notNull().default(false),
    convertedAt: timestamp("converted_at"),
    convertedAccountId: uuid("converted_account_id").references(
      () => accountTable.id,
      { onDelete: "set null" },
    ),
    convertedContactId: uuid("converted_contact_id").references(
      () => contactTable.id,
      { onDelete: "set null" },
    ),
    convertedOpportunityId: uuid("converted_opportunity_id").references(
      () => opportunityTable.id,
      { onDelete: "set null" },
    ),
  },
  (table) => [
    index(`${TABLE_PREFIX}lead_organization_id_idx`).on(table.organizationId),
    index(`${TABLE_PREFIX}lead_status_idx`).on(
      table.organizationId,
      table.status,
    ),
  ],
);

export type Lead = typeof leadTable.$inferSelect;
export type LeadCreate = typeof leadTable.$inferInsert;
export type LeadUpdate = Partial<LeadCreate>;
export { leadTable };
