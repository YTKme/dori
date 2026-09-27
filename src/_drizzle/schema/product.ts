/**
 * Product Table Schema — a sellable product or service.
 */

import { boolean, index, pgTable, text } from "drizzle-orm/pg-core";

import { TABLE_PREFIX } from "../../configuration/global";
import { baseColumns } from "../column";

const productTable = pgTable(
  `${TABLE_PREFIX}product`,
  {
    ...baseColumns(),
    name: text("name").notNull(),
    productCode: text("product_code"),
    description: text("description"),
    family: text("family"),
    isActive: boolean("is_active").notNull().default(true),
  },
  (table) => [
    index(`${TABLE_PREFIX}product_organization_id_idx`).on(
      table.organizationId,
    ),
    index(`${TABLE_PREFIX}product_code_idx`).on(
      table.organizationId,
      table.productCode,
    ),
  ],
);

export type Product = typeof productTable.$inferSelect;
export type ProductCreate = typeof productTable.$inferInsert;
export type ProductUpdate = Partial<ProductCreate>;
export { productTable };
