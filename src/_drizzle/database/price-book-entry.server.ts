import * as z from "zod";

import {
  optBool,
  optOwner,
  optText,
  reqMoney,
} from "../../server/validation/common";
import type {
  PriceBookEntry,
  PriceBookEntryCreate,
} from "../schema/price-book-entry";
import { priceBookEntryTable } from "../schema/price-book-entry";
import { createResource } from "./resource";

const createSchema = z.object({
  priceBookId: z.string().uuid(),
  productId: z.string().uuid(),
  unitPrice: reqMoney(),
  currencyCode: optText(),
  isActive: optBool(),
  ownerId: optOwner(),
});

export const priceBookEntry = createResource<
  PriceBookEntry,
  PriceBookEntryCreate
>({
  queryKey: "priceBookEntryTable",
  table: priceBookEntryTable,
  sortColumns: ["unitPrice", "createdAt", "updatedAt"],
  filterColumns: ["priceBookId", "productId", "ownerId"],
  allowedExpand: ["priceBook", "product"],
  defaultSort: "createdAt",
  createSchema,
  updateSchema: createSchema.partial(),
});
