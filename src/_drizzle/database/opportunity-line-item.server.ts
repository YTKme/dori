import * as z from "zod";

import {
  optMoney,
  optOwner,
  optText,
  optUuid,
  reqMoney,
} from "../../server/validation/common";
import type {
  OpportunityLineItem,
  OpportunityLineItemCreate,
} from "../schema/opportunity-line-item";
import { opportunityLineItemTable } from "../schema/opportunity-line-item";
import { createResource } from "./resource";

const createSchema = z.object({
  opportunityId: z.string().uuid(),
  productId: optUuid(),
  priceBookEntryId: optUuid(),
  quantity: optMoney(),
  unitPrice: reqMoney(),
  discount: optMoney(),
  description: optText(),
  ownerId: optOwner(),
});

export const opportunityLineItem = createResource<
  OpportunityLineItem,
  OpportunityLineItemCreate
>({
  queryKey: "opportunityLineItemTable",
  table: opportunityLineItemTable,
  searchColumns: ["description"],
  sortColumns: ["unitPrice", "quantity", "createdAt"],
  filterColumns: ["opportunityId", "productId", "priceBookEntryId"],
  allowedExpand: ["opportunity", "product", "priceBookEntry"],
  defaultSort: "createdAt",
  createSchema,
  updateSchema: createSchema.partial(),
});
