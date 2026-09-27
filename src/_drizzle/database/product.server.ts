import * as z from "zod";

import {
  optBool,
  optOwner,
  optText,
  reqText,
} from "../../server/validation/common";
import type { Product, ProductCreate } from "../schema/product";
import { productTable } from "../schema/product";
import { createResource } from "./resource";

const createSchema = z.object({
  name: reqText(),
  productCode: optText(),
  description: optText(),
  family: optText(),
  isActive: optBool(),
  ownerId: optOwner(),
});

export const product = createResource<Product, ProductCreate>({
  queryKey: "productTable",
  table: productTable,
  searchColumns: ["name", "productCode", "family", "description"],
  sortColumns: ["name", "productCode", "family", "createdAt", "updatedAt"],
  filterColumns: ["family", "ownerId"],
  allowedExpand: ["owner", "priceBookEntryList"],
  defaultSort: "createdAt",
  createSchema,
  updateSchema: createSchema.partial(),
});
