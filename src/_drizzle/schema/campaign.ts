/**
 * Campaign Table Schema — a marketing campaign.
 */

import {
  type AnyPgColumn,
  boolean,
  date,
  index,
  numeric,
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core";

import { TABLE_PREFIX } from "../../configuration/global";
import type { CampaignStatus, CampaignType } from "../../type/enum";
import { baseColumns } from "../column";

const campaignTable = pgTable(
  `${TABLE_PREFIX}campaign`,
  {
    ...baseColumns(),
    name: text("name").notNull(),
    type: text("type").$type<CampaignType>(),
    status: text("status")
      .$type<CampaignStatus>()
      .notNull()
      .default("planned"),
    startDate: date("start_date", { mode: "string" }),
    endDate: date("end_date", { mode: "string" }),
    budgetedCost: numeric("budgeted_cost", { precision: 15, scale: 2 }),
    actualCost: numeric("actual_cost", { precision: 15, scale: 2 }),
    expectedRevenue: numeric("expected_revenue", { precision: 15, scale: 2 }),
    expectedResponse: numeric("expected_response", { precision: 5, scale: 2 }),
    isActive: boolean("is_active").notNull().default(true),
    parentCampaignId: uuid("parent_campaign_id").references(
      (): AnyPgColumn => campaignTable.id,
      { onDelete: "set null" },
    ),
    description: text("description"),
  },
  (table) => [
    index(`${TABLE_PREFIX}campaign_organization_id_idx`).on(
      table.organizationId,
    ),
    index(`${TABLE_PREFIX}campaign_status_idx`).on(
      table.organizationId,
      table.status,
    ),
  ],
);

export type Campaign = typeof campaignTable.$inferSelect;
export type CampaignCreate = typeof campaignTable.$inferInsert;
export type CampaignUpdate = Partial<CampaignCreate>;
export { campaignTable };
