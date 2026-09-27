import * as z from "zod";

import {
  optBool,
  optOwner,
  optText,
  reqText,
} from "../../server/validation/common";
import type {
  OpportunityContactRole,
  OpportunityContactRoleCreate,
} from "../schema/opportunity-contact-role";
import { opportunityContactRoleTable } from "../schema/opportunity-contact-role";
import { createResource } from "./resource";

const createSchema = z.object({
  opportunityId: z.string().uuid(),
  contactId: z.string().uuid(),
  role: optText(),
  isPrimary: optBool(),
  ownerId: optOwner(),
});

export const opportunityContactRole = createResource<
  OpportunityContactRole,
  OpportunityContactRoleCreate
>({
  queryKey: "opportunityContactRoleTable",
  table: opportunityContactRoleTable,
  sortColumns: ["createdAt", "role"],
  filterColumns: ["opportunityId", "contactId", "ownerId", "isPrimary"],
  allowedExpand: ["opportunity", "contact"],
  defaultSort: "createdAt",
  createSchema,
  updateSchema: createSchema.partial(),
});
