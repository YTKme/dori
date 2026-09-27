import * as z from "zod";

import {
  ACTIVITY_PRIORITY,
  ACTIVITY_STATUS,
  ACTIVITY_TYPE,
} from "../../type/enum";
import {
  optBool,
  optDate,
  optEnum,
  optInt,
  optOwner,
  optText,
  optTimestamp,
  optUuid,
  reqText,
} from "../../server/validation/common";
import type { Activity, ActivityCreate } from "../schema/activity";
import { activityTable } from "../schema/activity";
import { createResource } from "./resource";

const createSchema = z.object({
  type: optEnum(ACTIVITY_TYPE),
  subject: reqText(),
  description: optText(),
  status: optEnum(ACTIVITY_STATUS),
  priority: optEnum(ACTIVITY_PRIORITY),
  dueDate: optDate(),
  activityDate: optTimestamp(),
  durationMinutes: optInt(),
  isClosed: optBool(),
  accountId: optUuid(),
  contactId: optUuid(),
  leadId: optUuid(),
  opportunityId: optUuid(),
  caseId: optUuid(),
  campaignId: optUuid(),
  ownerId: optOwner(),
});

export const activity = createResource<Activity, ActivityCreate>({
  queryKey: "activityTable",
  table: activityTable,
  searchColumns: ["subject", "description"],
  sortColumns: [
    "subject",
    "type",
    "status",
    "priority",
    "dueDate",
    "activityDate",
    "createdAt",
    "updatedAt",
  ],
  filterColumns: [
    "type",
    "status",
    "priority",
    "ownerId",
    "accountId",
    "contactId",
    "leadId",
    "opportunityId",
    "caseId",
    "campaignId",
  ],
  allowedExpand: [
    "owner",
    "account",
    "contact",
    "lead",
    "opportunity",
    "case",
    "campaign",
  ],
  defaultSort: "dueDate",
  defaultOrder: "asc",
  createSchema,
  updateSchema: createSchema.partial(),
});
