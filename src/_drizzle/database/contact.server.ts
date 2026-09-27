import * as z from "zod";

import { LEAD_SOURCE } from "../../type/enum";
import {
  address,
  optEmail,
  optEnum,
  optOwner,
  optText,
  optUuid,
  reqText,
} from "../../server/validation/common";
import type { Contact, ContactCreate } from "../schema/contact";
import { contactTable } from "../schema/contact";
import { createResource } from "./resource";

const createSchema = z.object({
  accountId: optUuid(),
  salutation: optText(),
  firstName: optText(),
  lastName: reqText(),
  title: optText(),
  department: optText(),
  email: optEmail(),
  phone: optText(),
  mobile: optText(),
  fax: optText(),
  ...address("mailing"),
  reportsToId: optUuid(),
  leadSource: optEnum(LEAD_SOURCE),
  birthdate: optText(),
  description: optText(),
  ownerId: optOwner(),
});

export const contact = createResource<Contact, ContactCreate>({
  queryKey: "contactTable",
  table: contactTable,
  searchColumns: [
    "firstName",
    "lastName",
    "email",
    "phone",
    "mobile",
    "title",
    "department",
  ],
  sortColumns: ["lastName", "firstName", "title", "createdAt", "updatedAt"],
  filterColumns: ["accountId", "ownerId", "leadSource"],
  allowedExpand: [
    "owner",
    "account",
    "opportunityContactRoleList",
    "campaignMemberList",
    "activityList",
    "noteList",
  ],
  defaultSort: "createdAt",
  createSchema,
  updateSchema: createSchema.partial(),
});
