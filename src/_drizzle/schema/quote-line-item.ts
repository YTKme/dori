/**
 * Quote Line Item Table Schema — a product line on a quote.
 */

import { index, numeric, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { TABLE_PREFIX } from "../../configuration/global";
import { baseColumns } from "../column";

import { productTable } from "./product";
import { quoteTable } from "./quote";

const quoteLineItemTable = pgTable(
  `${TABLE_PREFIX}quote_line_item`,
  {
    ...baseColumns(),
    quoteId: uuid("quote_id")
      .notNull()
      .references(() => quoteTable.id, { onDelete: "cascade" }),
    productId: uuid("product_id").references(() => productTable.id, {
      onDelete: "set null",
    }),
    quantity: numeric("quantity", { precision: 15, scale: 2 })
      .notNull()
      .default("1"),
    unitPrice: numeric("unit_price", { precision: 15, scale: 2 }).notNull(),
    discount: numeric("discount", { precision: 5, scale: 2 }).default("0"),
    description: text("description"),
  },
  (table) => [
    index(`${TABLE_PREFIX}quote_line_item_organization_id_idx`).on(
      table.organizationId,
    ),
    index(`${TABLE_PREFIX}quote_line_item_quote_id_idx`).on(table.quoteId),
  ],
);

export type QuoteLineItem = typeof quoteLineItemTable.$inferSelect;
export type QuoteLineItemCreate = typeof quoteLineItemTable.$inferInsert;
export type QuoteLineItemUpdate = Partial<QuoteLineItemCreate>;
export { quoteLineItemTable };
