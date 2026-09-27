import * as z from "zod";

import { FORECAST_CATEGORY } from "../../type/enum";
import {
  optBool,
  optEnum,
  optInt,
  optMoney,
  optOwner,
  reqText,
} from "../../server/validation/common";
import type {
  OpportunityStage,
  OpportunityStageCreate,
} from "../schema/opportunity-stage";
import { opportunityStageTable } from "../schema/opportunity-stage";
import { createResource } from "./resource";

const createSchema = z.object({
  name: reqText(),
  displayOrder: optInt(),
  probability: optMoney(),
  isWon: optBool(),
  isClosed: optBool(),
  forecastCategory: optEnum(FORECAST_CATEGORY),
  ownerId: optOwner(),
});

export const opportunityStage = createResource<
  OpportunityStage,
  OpportunityStageCreate
>({
  queryKey: "opportunityStageTable",
  table: opportunityStageTable,
  searchColumns: ["name"],
  sortColumns: ["displayOrder", "name", "probability", "createdAt"],
  filterColumns: ["ownerId"],
  allowedExpand: ["opportunityList"],
  defaultSort: "displayOrder",
  defaultOrder: "asc",
  createSchema,
  updateSchema: createSchema.partial(),
});
