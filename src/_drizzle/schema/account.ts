/**
 * Account Table Schema — a company / organization the tenant does
 * business with (Salesforce "Account"). Distinct from the auth
 * `betterauth_account` (OAuth) table.
 */

import {
  type AnyPgColumn,
  index,
  integer,
  numeric,
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core";

import { TABLE_PREFIX } from "../../configuration/global";
import type { AccountType, Rating } from "../../type/enum";
import { baseColumns } from "../column";

const accountTable = pgTable(
  `${TABLE_PREFIX}account`,
  {
    ...baseColumns(),
    name: text("name").notNull(),
    type: text("type").$type<AccountType>(),
    industry: text("industry"),
    website: text("website"),
    phone: text("phone"),
    email: text("email"),
    fax: text("fax"),
    annualRevenue: numeric("annual_revenue", { precision: 15, scale: 2 }),
    numberOfEmployees: integer("number_of_employees"),
    rating: text("rating").$type<Rating>(),
    ownership: text("ownership"),
    tickerSymbol: text("ticker_symbol"),
    description: text("description"),
    parentAccountId: uuid("parent_account_id").references(
      (): AnyPgColumn => accountTable.id,
      { onDelete: "set null" },
    ),
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
  },
  (table) => [
    index(`${TABLE_PREFIX}account_organization_id_idx`).on(
      table.organizationId,
    ),
    index(`${TABLE_PREFIX}account_name_idx`).on(
      table.organizationId,
      table.name,
    ),
  ],
);

export type Account = typeof accountTable.$inferSelect;
export type AccountCreate = typeof accountTable.$inferInsert;
export type AccountUpdate = Partial<AccountCreate>;
export { accountTable };
