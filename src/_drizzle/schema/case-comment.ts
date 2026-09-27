/**
 * Case Comment Table Schema — a comment / note on a case.
 */

import { boolean, index, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { TABLE_PREFIX } from "../../configuration/global";
import { baseColumns } from "../column";

import { caseTable } from "./case";

const caseCommentTable = pgTable(
  `${TABLE_PREFIX}case_comment`,
  {
    ...baseColumns(),
    caseId: uuid("case_id")
      .notNull()
      .references(() => caseTable.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    isPublic: boolean("is_public").notNull().default(true),
  },
  (table) => [
    index(`${TABLE_PREFIX}case_comment_organization_id_idx`).on(
      table.organizationId,
    ),
    index(`${TABLE_PREFIX}case_comment_case_id_idx`).on(table.caseId),
  ],
);

export type CaseComment = typeof caseCommentTable.$inferSelect;
export type CaseCommentCreate = typeof caseCommentTable.$inferInsert;
export type CaseCommentUpdate = Partial<CaseCommentCreate>;
export { caseCommentTable };
