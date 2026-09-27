/**
 * Campaign Member Table Schema — junction linking a lead or contact to a
 * campaign along with their response status.
 */

import { index, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { TABLE_PREFIX } from "../../configuration/global";
import type { CampaignMemberStatus } from "../../type/enum";
import { baseColumns } from "../column";

import { campaignTable } from "./campaign";
import { contactTable } from "./contact";
import { leadTable } from "./lead";

const campaignMemberTable = pgTable(
  `${TABLE_PREFIX}campaign_member`,
  {
    ...baseColumns(),
    campaignId: uuid("campaign_id")
      .notNull()
      .references(() => campaignTable.id, { onDelete: "cascade" }),
    leadId: uuid("lead_id").references(() => leadTable.id, {
      onDelete: "cascade",
    }),
    contactId: uuid("contact_id").references(() => contactTable.id, {
      onDelete: "cascade",
    }),
    status: text("status")
      .$type<CampaignMemberStatus>()
      .notNull()
      .default("sent"),
  },
  (table) => [
    index(`${TABLE_PREFIX}campaign_member_organization_id_idx`).on(
      table.organizationId,
    ),
    index(`${TABLE_PREFIX}campaign_member_campaign_id_idx`).on(
      table.campaignId,
    ),
  ],
);

export type CampaignMember = typeof campaignMemberTable.$inferSelect;
export type CampaignMemberCreate = typeof campaignMemberTable.$inferInsert;
export type CampaignMemberUpdate = Partial<CampaignMemberCreate>;
export { campaignMemberTable };
