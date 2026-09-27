import * as z from "zod";

import { CAMPAIGN_MEMBER_STATUS } from "../../type/enum";
import { optEnum, optOwner, optUuid } from "../../server/validation/common";
import type {
  CampaignMember,
  CampaignMemberCreate,
} from "../schema/campaign-member";
import { campaignMemberTable } from "../schema/campaign-member";
import { createResource } from "./resource";

const createSchema = z.object({
  campaignId: z.string().uuid(),
  leadId: optUuid(),
  contactId: optUuid(),
  status: optEnum(CAMPAIGN_MEMBER_STATUS),
  ownerId: optOwner(),
});

export const campaignMember = createResource<
  CampaignMember,
  CampaignMemberCreate
>({
  queryKey: "campaignMemberTable",
  table: campaignMemberTable,
  sortColumns: ["status", "createdAt"],
  filterColumns: ["campaignId", "leadId", "contactId", "status"],
  allowedExpand: ["campaign", "lead", "contact"],
  defaultSort: "createdAt",
  createSchema,
  updateSchema: createSchema.partial(),
});
