/**
 * Contact Table Schema — an individual person, usually associated with
 * an account.
 */

import {
  type AnyPgColumn,
  date,
  index,
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core";

import { TABLE_PREFIX } from "../../configuration/global";
import type { LeadSource } from "../../type/enum";
import { baseColumns } from "../column";

import { accountTable } from "./account";

const contactTable = pgTable(
  `${TABLE_PREFIX}contact`,
  {
    ...baseColumns(),
    accountId: uuid("account_id").references(() => accountTable.id, {
      onDelete: "set null",
    }),
    salutation: text("salutation"),
    firstName: text("first_name"),
    lastName: text("last_name").notNull(),
    title: text("title"),
    department: text("department"),
    email: text("email"),
    phone: text("phone"),
    mobile: text("mobile"),
    fax: text("fax"),
    mailingStreet: text("mailing_street"),
    mailingCity: text("mailing_city"),
    mailingState: text("mailing_state"),
    mailingPostalCode: text("mailing_postal_code"),
    mailingCountry: text("mailing_country"),
    reportsToId: uuid("reports_to_id").references(
      (): AnyPgColumn => contactTable.id,
      { onDelete: "set null" },
    ),
    leadSource: text("lead_source").$type<LeadSource>(),
    birthdate: date("birthdate", { mode: "string" }),
    description: text("description"),
  },
  (table) => [
    index(`${TABLE_PREFIX}contact_organization_id_idx`).on(
      table.organizationId,
    ),
    index(`${TABLE_PREFIX}contact_account_id_idx`).on(table.accountId),
    index(`${TABLE_PREFIX}contact_name_idx`).on(
      table.organizationId,
      table.lastName,
    ),
  ],
);

export type Contact = typeof contactTable.$inferSelect;
export type ContactCreate = typeof contactTable.$inferInsert;
export type ContactUpdate = Partial<ContactCreate>;
export { contactTable };
