/**
 * Price Book Table Schema — a named collection of product prices.
 */

import { boolean, index, pgTable, text } from "drizzle-orm/pg-core";

import { TABLE_PREFIX } from "../../configuration/global";
import { baseColumns } from "../column";

const priceBookTable = pgTable(
  `${TABLE_PREFIX}price_book`,
  {
    ...baseColumns(),
    name: text("name").notNull(),
    description: text("description"),
    isStandard: boolean("is_standard").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
  },
  (table) => [
    index(`${TABLE_PREFIX}price_book_organization_id_idx`).on(
      table.organizationId,
    ),
  ],
);

export type PriceBook = typeof priceBookTable.$inferSelect;
export type PriceBookCreate = typeof priceBookTable.$inferInsert;
export type PriceBookUpdate = Partial<PriceBookCreate>;
export { priceBookTable };
