import * as z from "zod";

import {
  CASE_ORIGIN,
  CASE_PRIORITY,
  CASE_STATUS,
  CASE_TYPE,
} from "../../type/enum";
import {
  optBool,
  optEnum,
  optOwner,
  optText,
  optUuid,
  reqText,
} from "../../server/validation/common";
import type { Case, CaseCreate } from "../schema/case";
import { caseTable } from "../schema/case";
import { createResource } from "./resource";

const createSchema = z.object({
  caseNumber: optText(),
  subject: reqText(),
  description: optText(),
  status: optEnum(CASE_STATUS),
  priority: optEnum(CASE_PRIORITY),
  origin: optEnum(CASE_ORIGIN),
  type: optEnum(CASE_TYPE),
  reason: optText(),
  accountId: optUuid(),
  contactId: optUuid(),
  parentCaseId: optUuid(),
  isClosed: optBool(),
  ownerId: optOwner(),
});

export const supportCase = createResource<Case, CaseCreate>({
  queryKey: "caseTable",
  table: caseTable,
  searchColumns: ["subject", "description", "caseNumber", "reason"],
  sortColumns: ["subject", "status", "priority", "createdAt", "updatedAt"],
  filterColumns: [
    "status",
    "priority",
    "origin",
    "type",
    "accountId",
    "contactId",
    "ownerId",
    "parentCaseId",
  ],
  allowedExpand: [
    "owner",
    "account",
    "contact",
    "commentList",
    "activityList",
    "noteList",
  ],
  defaultSort: "createdAt",
  createSchema,
  updateSchema: createSchema.partial(),
});
