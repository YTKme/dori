/**
 * Opportunity Line Item Table Schema — a product line on an opportunity.
 */

import { index, numeric, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { TABLE_PREFIX } from "../../configuration/global";
import { baseColumns } from "../column";

import { opportunityTable } from "./opportunity";
import { priceBookEntryTable } from "./price-book-entry";
import { productTable } from "./product";

const opportunityLineItemTable = pgTable(
  `${TABLE_PREFIX}opportunity_line_item`,
  {
    ...baseColumns(),
    opportunityId: uuid("opportunity_id")
      .notNull()
      .references(() => opportunityTable.id, { onDelete: "cascade" }),
    productId: uuid("product_id").references(() => productTable.id, {
      onDelete: "set null",
    }),
    priceBookEntryId: uuid("price_book_entry_id").references(
      () => priceBookEntryTable.id,
      { onDelete: "set null" },
    ),
    quantity: numeric("quantity", { precision: 15, scale: 2 })
      .notNull()
      .default("1"),
    unitPrice: numeric("unit_price", { precision: 15, scale: 2 }).notNull(),
    discount: numeric("discount", { precision: 5, scale: 2 }).default("0"),
    description: text("description"),
  },
  (table) => [
    index(`${TABLE_PREFIX}opp_line_item_organization_id_idx`).on(
      table.organizationId,
    ),
    index(`${TABLE_PREFIX}opp_line_item_opportunity_id_idx`).on(
      table.opportunityId,
    ),
  ],
);

export type OpportunityLineItem =
  typeof opportunityLineItemTable.$inferSelect;
export type OpportunityLineItemCreate =
  typeof opportunityLineItemTable.$inferInsert;
export type OpportunityLineItemUpdate =
  Partial<OpportunityLineItemCreate>;
export { opportunityLineItemTable };
