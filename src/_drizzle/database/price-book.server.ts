import * as z from "zod";

import {
  optBool,
  optOwner,
  optText,
  reqText,
} from "../../server/validation/common";
import type { PriceBook, PriceBookCreate } from "../schema/price-book";
import { priceBookTable } from "../schema/price-book";
import { createResource } from "./resource";

const createSchema = z.object({
  name: reqText(),
  description: optText(),
  isStandard: optBool(),
  isActive: optBool(),
  ownerId: optOwner(),
});

export const priceBook = createResource<PriceBook, PriceBookCreate>({
  queryKey: "priceBookTable",
  table: priceBookTable,
  searchColumns: ["name", "description"],
  sortColumns: ["name", "createdAt", "updatedAt"],
  filterColumns: ["ownerId"],
  allowedExpand: ["owner", "entryList"],
  defaultSort: "createdAt",
  createSchema,
  updateSchema: createSchema.partial(),
});
