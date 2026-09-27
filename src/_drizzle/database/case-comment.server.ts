import * as z from "zod";

import { optBool, optOwner, reqText } from "../../server/validation/common";
import type { CaseComment, CaseCommentCreate } from "../schema/case-comment";
import { caseCommentTable } from "../schema/case-comment";
import { createResource } from "./resource";

const createSchema = z.object({
  caseId: z.string().uuid(),
  body: reqText(),
  isPublic: optBool(),
  ownerId: optOwner(),
});

export const caseComment = createResource<CaseComment, CaseCommentCreate>({
  queryKey: "caseCommentTable",
  table: caseCommentTable,
  searchColumns: ["body"],
  sortColumns: ["createdAt"],
  filterColumns: ["caseId", "ownerId", "isPublic"],
  allowedExpand: ["case"],
  defaultSort: "createdAt",
  createSchema,
  updateSchema: createSchema.partial(),
});
