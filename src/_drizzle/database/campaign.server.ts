import * as z from "zod";

import { CAMPAIGN_STATUS, CAMPAIGN_TYPE } from "../../type/enum";
import {
  optBool,
  optDate,
  optEnum,
  optMoney,
  optOwner,
  optText,
  optUuid,
  reqText,
} from "../../server/validation/common";
import type { Campaign, CampaignCreate } from "../schema/campaign";
import { campaignTable } from "../schema/campaign";
import { createResource } from "./resource";

const createSchema = z.object({
  name: reqText(),
  type: optEnum(CAMPAIGN_TYPE),
  status: optEnum(CAMPAIGN_STATUS),
  startDate: optDate(),
  endDate: optDate(),
  budgetedCost: optMoney(),
  actualCost: optMoney(),
  expectedRevenue: optMoney(),
  expectedResponse: optMoney(),
  isActive: optBool(),
  parentCampaignId: optUuid(),
  description: optText(),
  ownerId: optOwner(),
});

export const campaign = createResource<Campaign, CampaignCreate>({
  queryKey: "campaignTable",
  table: campaignTable,
  searchColumns: ["name", "description"],
  sortColumns: ["name", "status", "startDate", "endDate", "createdAt"],
  filterColumns: ["status", "type", "ownerId", "parentCampaignId"],
  allowedExpand: ["owner", "memberList", "opportunityList"],
  defaultSort: "createdAt",
  createSchema,
  updateSchema: createSchema.partial(),
});
