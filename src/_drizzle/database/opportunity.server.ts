import * as z from "zod";

import {
  FORECAST_CATEGORY,
  LEAD_SOURCE,
  OPPORTUNITY_TYPE,
} from "../../type/enum";
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
import type { Opportunity, OpportunityCreate } from "../schema/opportunity";
import { opportunityTable } from "../schema/opportunity";
import { createResource } from "./resource";

const createSchema = z.object({
  name: reqText(),
  accountId: optUuid(),
  stageId: optUuid(),
  amount: optMoney(),
  currencyCode: optText(),
  closeDate: optDate(),
  probability: optMoney(),
  type: optEnum(OPPORTUNITY_TYPE),
  leadSource: optEnum(LEAD_SOURCE),
  nextStep: optText(),
  forecastCategory: optEnum(FORECAST_CATEGORY),
  isClosed: optBool(),
  isWon: optBool(),
  description: optText(),
  campaignId: optUuid(),
  ownerId: optOwner(),
});

export const opportunity = createResource<Opportunity, OpportunityCreate>({
  queryKey: "opportunityTable",
  table: opportunityTable,
  searchColumns: ["name", "nextStep", "description"],
  sortColumns: [
    "name",
    "amount",
    "closeDate",
    "probability",
    "createdAt",
    "updatedAt",
  ],
  filterColumns: [
    "accountId",
    "stageId",
    "ownerId",
    "type",
    "forecastCategory",
    "campaignId",
  ],
  allowedExpand: [
    "owner",
    "account",
    "stage",
    "campaign",
    "lineItemList",
    "contactRoleList",
    "quoteList",
    "activityList",
    "noteList",
  ],
  defaultSort: "createdAt",
  createSchema,
  updateSchema: createSchema.partial(),
});
