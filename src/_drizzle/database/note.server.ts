import * as z from "zod";

import {
  optOwner,
  optText,
  optUuid,
  reqText,
} from "../../server/validation/common";
import type { Note, NoteCreate } from "../schema/note";
import { noteTable } from "../schema/note";
import { createResource } from "./resource";

const createSchema = z.object({
  title: optText(),
  body: reqText(),
  accountId: optUuid(),
  contactId: optUuid(),
  leadId: optUuid(),
  opportunityId: optUuid(),
  caseId: optUuid(),
  ownerId: optOwner(),
});

export const note = createResource<Note, NoteCreate>({
  queryKey: "noteTable",
  table: noteTable,
  searchColumns: ["title", "body"],
  sortColumns: ["title", "createdAt", "updatedAt"],
  filterColumns: [
    "ownerId",
    "accountId",
    "contactId",
    "leadId",
    "opportunityId",
    "caseId",
  ],
  allowedExpand: ["owner", "account", "contact", "lead", "opportunity", "case"],
  defaultSort: "createdAt",
  createSchema,
  updateSchema: createSchema.partial(),
});
