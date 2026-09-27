import * as z from "zod";

import { ACCOUNT_TYPE, RATING } from "../../type/enum";
import {
  address,
  optEmail,
  optEnum,
  optInt,
  optMoney,
  optOwner,
  optText,
  optUuid,
  reqText,
} from "../../server/validation/common";
import type { Account, AccountCreate } from "../schema/account";
import { accountTable } from "../schema/account";
import { createResource } from "./resource";

const createSchema = z.object({
  name: reqText(),
  type: optEnum(ACCOUNT_TYPE),
  industry: optText(),
  website: optText(),
  phone: optText(),
  email: optEmail(),
  fax: optText(),
  annualRevenue: optMoney(),
  numberOfEmployees: optInt(),
  rating: optEnum(RATING),
  ownership: optText(),
  tickerSymbol: optText(),
  description: optText(),
  parentAccountId: optUuid(),
  ...address("billing"),
  ...address("shipping"),
  ownerId: optOwner(),
});

export const account = createResource<Account, AccountCreate>({
  queryKey: "accountTable",
  table: accountTable,
  searchColumns: ["name", "website", "phone", "email", "industry"],
  sortColumns: [
    "name",
    "type",
    "rating",
    "industry",
    "annualRevenue",
    "createdAt",
    "updatedAt",
  ],
  filterColumns: ["type", "rating", "industry", "ownerId", "parentAccountId"],
  allowedExpand: [
    "owner",
    "contactList",
    "opportunityList",
    "caseList",
    "quoteList",
    "activityList",
    "noteList",
  ],
  defaultSort: "createdAt",
  createSchema,
  updateSchema: createSchema.partial(),
});
