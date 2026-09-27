/**
 * Price Book Entry Table Schema — the price of a product within a
 * particular price book.
 */

import { boolean, index, numeric, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { TABLE_PREFIX } from "../../configuration/global";
import { baseColumns } from "../column";

import { priceBookTable } from "./price-book";
import { productTable } from "./product";

const priceBookEntryTable = pgTable(
  `${TABLE_PREFIX}price_book_entry`,
  {
    ...baseColumns(),
    priceBookId: uuid("price_book_id")
      .notNull()
      .references(() => priceBookTable.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => productTable.id, { onDelete: "cascade" }),
    unitPrice: numeric("unit_price", { precision: 15, scale: 2 }).notNull(),
    currencyCode: text("currency_code").notNull().default("USD"),
    isActive: boolean("is_active").notNull().default(true),
  },
  (table) => [
    index(`${TABLE_PREFIX}price_book_entry_organization_id_idx`).on(
      table.organizationId,
    ),
    index(`${TABLE_PREFIX}price_book_entry_price_book_id_idx`).on(
      table.priceBookId,
    ),
    index(`${TABLE_PREFIX}price_book_entry_product_id_idx`).on(
      table.productId,
    ),
  ],
);

export type PriceBookEntry = typeof priceBookEntryTable.$inferSelect;
export type PriceBookEntryCreate = typeof priceBookEntryTable.$inferInsert;
export type PriceBookEntryUpdate = Partial<PriceBookEntryCreate>;
export { priceBookEntryTable };
