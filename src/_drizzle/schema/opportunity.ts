/**
 * Opportunity Table Schema — a potential sale (deal) linked to an
 * account and progressing through pipeline stages.
 */

import {
  boolean,
  date,
  index,
  numeric,
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core";

import { TABLE_PREFIX } from "../../configuration/global";
import type {
  ForecastCategory,
  LeadSource,
  OpportunityType,
} from "../../type/enum";
import { baseColumns } from "../column";

import { accountTable } from "./account";
import { campaignTable } from "./campaign";
import { opportunityStageTable } from "./opportunity-stage";

const opportunityTable = pgTable(
  `${TABLE_PREFIX}opportunity`,
  {
    ...baseColumns(),
    name: text("name").notNull(),
    accountId: uuid("account_id").references(() => accountTable.id, {
      onDelete: "set null",
    }),
    stageId: uuid("stage_id").references(() => opportunityStageTable.id, {
      onDelete: "set null",
    }),
    amount: numeric("amount", { precision: 15, scale: 2 }),
    currencyCode: text("currency_code").notNull().default("USD"),
    closeDate: date("close_date", { mode: "string" }),
    probability: numeric("probability", { precision: 5, scale: 2 }),
    type: text("type").$type<OpportunityType>(),
    leadSource: text("lead_source").$type<LeadSource>(),
    nextStep: text("next_step"),
    forecastCategory: text("forecast_category").$type<ForecastCategory>(),
    isClosed: boolean("is_closed").notNull().default(false),
    isWon: boolean("is_won").notNull().default(false),
    description: text("description"),
    campaignId: uuid("campaign_id").references(() => campaignTable.id, {
      onDelete: "set null",
    }),
  },
  (table) => [
    index(`${TABLE_PREFIX}opportunity_organization_id_idx`).on(
      table.organizationId,
    ),
    index(`${TABLE_PREFIX}opportunity_account_id_idx`).on(table.accountId),
    index(`${TABLE_PREFIX}opportunity_stage_id_idx`).on(table.stageId),
  ],
);

export type Opportunity = typeof opportunityTable.$inferSelect;
export type OpportunityCreate = typeof opportunityTable.$inferInsert;
export type OpportunityUpdate = Partial<OpportunityCreate>;
export { opportunityTable };
