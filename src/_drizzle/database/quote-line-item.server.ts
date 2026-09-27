import * as z from "zod";

import {
  optMoney,
  optOwner,
  optText,
  optUuid,
  reqMoney,
} from "../../server/validation/common";
import type {
  QuoteLineItem,
  QuoteLineItemCreate,
} from "../schema/quote-line-item";
import { quoteLineItemTable } from "../schema/quote-line-item";
import { createResource } from "./resource";

const createSchema = z.object({
  quoteId: z.string().uuid(),
  productId: optUuid(),
  quantity: optMoney(),
  unitPrice: reqMoney(),
  discount: optMoney(),
  description: optText(),
  ownerId: optOwner(),
});

export const quoteLineItem = createResource<
  QuoteLineItem,
  QuoteLineItemCreate
>({
  queryKey: "quoteLineItemTable",
  table: quoteLineItemTable,
  searchColumns: ["description"],
  sortColumns: ["unitPrice", "quantity", "createdAt"],
  filterColumns: ["quoteId", "productId"],
  allowedExpand: ["quote", "product"],
  defaultSort: "createdAt",
  createSchema,
  updateSchema: createSchema.partial(),
});
