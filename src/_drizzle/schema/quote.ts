/**
 * Quote Table Schema — a formal price quotation for an opportunity.
 */

import {
  date,
  index,
  numeric,
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core";

import { TABLE_PREFIX } from "../../configuration/global";
import type { QuoteStatus } from "../../type/enum";
import { baseColumns } from "../column";

import { accountTable } from "./account";
import { contactTable } from "./contact";
import { opportunityTable } from "./opportunity";

const quoteTable = pgTable(
  `${TABLE_PREFIX}quote`,
  {
    ...baseColumns(),
    name: text("name").notNull(),
    quoteNumber: text("quote_number"),
    opportunityId: uuid("opportunity_id").references(
      () => opportunityTable.id,
      { onDelete: "set null" },
    ),
    accountId: uuid("account_id").references(() => accountTable.id, {
      onDelete: "set null",
    }),
    contactId: uuid("contact_id").references(() => contactTable.id, {
      onDelete: "set null",
    }),
    status: text("status").$type<QuoteStatus>().notNull().default("draft"),
    expirationDate: date("expiration_date", { mode: "string" }),
    subtotal: numeric("subtotal", { precision: 15, scale: 2 }).default("0"),
    discount: numeric("discount", { precision: 15, scale: 2 }).default("0"),
    tax: numeric("tax", { precision: 15, scale: 2 }).default("0"),
    shipping: numeric("shipping", { precision: 15, scale: 2 }).default("0"),
    grandTotal: numeric("grand_total", { precision: 15, scale: 2 }).default(
      "0",
    ),
    currencyCode: text("currency_code").notNull().default("USD"),
    billingStreet: text("billing_street"),
    billingCity: text("billing_city"),
    billingState: text("billing_state"),
    billingPostalCode: text("billing_postal_code"),
    billingCountry: text("billing_country"),
    shippingStreet: text("shipping_street"),
    shippingCity: text("shipping_city"),
    shippingState: text("shipping_state"),
    shippingPostalCode: text("shipping_postal_code"),
    shippingCountry: text("shipping_country"),
    description: text("description"),
  },
  (table) => [
    index(`${TABLE_PREFIX}quote_organization_id_idx`).on(
      table.organizationId,
    ),
    index(`${TABLE_PREFIX}quote_opportunity_id_idx`).on(table.opportunityId),
    index(`${TABLE_PREFIX}quote_account_id_idx`).on(table.accountId),
  ],
);

export type Quote = typeof quoteTable.$inferSelect;
export type QuoteCreate = typeof quoteTable.$inferInsert;
export type QuoteUpdate = Partial<QuoteCreate>;
export { quoteTable };
