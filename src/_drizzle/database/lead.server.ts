import * as z from "zod";

import { LEAD_SOURCE, LEAD_STATUS, RATING } from "../../type/enum";
import {
  optEmail,
  optEnum,
  optInt,
  optMoney,
  optOwner,
  optText,
  reqText,
} from "../../server/validation/common";
import type { Lead, LeadCreate } from "../schema/lead";
import { leadTable } from "../schema/lead";
import { createResource } from "./resource";

const createSchema = z.object({
  salutation: optText(),
  firstName: optText(),
  lastName: reqText(),
  company: reqText(),
  title: optText(),
  email: optEmail(),
  phone: optText(),
  mobile: optText(),
  website: optText(),
  leadSource: optEnum(LEAD_SOURCE),
  status: optEnum(LEAD_STATUS),
  rating: optEnum(RATING),
  industry: optText(),
  annualRevenue: optMoney(),
  numberOfEmployees: optInt(),
  street: optText(),
  city: optText(),
  state: optText(),
  postalCode: optText(),
  country: optText(),
  description: optText(),
  ownerId: optOwner(),
});

export const lead = createResource<Lead, LeadCreate>({
  queryKey: "leadTable",
  table: leadTable,
  searchColumns: [
    "firstName",
    "lastName",
    "company",
    "email",
    "phone",
    "title",
  ],
  sortColumns: [
    "lastName",
    "company",
    "status",
    "rating",
    "createdAt",
    "updatedAt",
  ],
  filterColumns: ["status", "rating", "leadSource", "industry", "ownerId"],
  allowedExpand: [
    "owner",
    "convertedAccount",
    "convertedContact",
    "convertedOpportunity",
    "campaignMemberList",
    "activityList",
    "noteList",
  ],
  defaultSort: "createdAt",
  createSchema,
  updateSchema: createSchema.partial(),
});
