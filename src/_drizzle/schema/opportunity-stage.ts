/**
 * Opportunity Stage Table Schema — the (per-organization, configurable)
 * stages of the sales pipeline.
 */

import {
  boolean,
  index,
  integer,
  numeric,
  pgTable,
  text,
} from "drizzle-orm/pg-core";

import { TABLE_PREFIX } from "../../configuration/global";
import type { ForecastCategory } from "../../type/enum";
import { baseColumns } from "../column";

const opportunityStageTable = pgTable(
  `${TABLE_PREFIX}opportunity_stage`,
  {
    ...baseColumns(),
    name: text("name").notNull(),
    displayOrder: integer("display_order").notNull().default(0),
    probability: numeric("probability", { precision: 5, scale: 2 })
      .notNull()
      .default("0"),
    isWon: boolean("is_won").notNull().default(false),
    isClosed: boolean("is_closed").notNull().default(false),
    forecastCategory: text("forecast_category").$type<ForecastCategory>(),
  },
  (table) => [
    index(`${TABLE_PREFIX}opportunity_stage_organization_id_idx`).on(
      table.organizationId,
    ),
    index(`${TABLE_PREFIX}opportunity_stage_order_idx`).on(
      table.organizationId,
      table.displayOrder,
    ),
  ],
);

export type OpportunityStage = typeof opportunityStageTable.$inferSelect;
export type OpportunityStageCreate =
  typeof opportunityStageTable.$inferInsert;
export type OpportunityStageUpdate = Partial<OpportunityStageCreate>;
export { opportunityStageTable };
