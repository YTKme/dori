import * as z from "zod";

import { QUOTE_STATUS } from "../../type/enum";
import {
  address,
  optDate,
  optEnum,
  optMoney,
  optOwner,
  optText,
  optUuid,
  reqText,
} from "../../server/validation/common";
import type { Quote, QuoteCreate } from "../schema/quote";
import { quoteTable } from "../schema/quote";
import { createResource } from "./resource";

const createSchema = z.object({
  name: reqText(),
  quoteNumber: optText(),
  opportunityId: optUuid(),
  accountId: optUuid(),
  contactId: optUuid(),
  status: optEnum(QUOTE_STATUS),
  expirationDate: optDate(),
  subtotal: optMoney(),
  discount: optMoney(),
  tax: optMoney(),
  shipping: optMoney(),
  grandTotal: optMoney(),
  currencyCode: optText(),
  ...address("billing"),
  ...address("shipping"),
  description: optText(),
  ownerId: optOwner(),
});

export const quote = createResource<Quote, QuoteCreate>({
  queryKey: "quoteTable",
  table: quoteTable,
  searchColumns: ["name", "quoteNumber", "description"],
  sortColumns: [
    "name",
    "status",
    "grandTotal",
    "expirationDate",
    "createdAt",
    "updatedAt",
  ],
  filterColumns: [
    "opportunityId",
    "accountId",
    "contactId",
    "status",
    "ownerId",
  ],
  allowedExpand: ["owner", "opportunity", "account", "contact", "lineItemList"],
  defaultSort: "createdAt",
  createSchema,
  updateSchema: createSchema.partial(),
});
