/**
 * CRM Resource UI configuration types.
 *
 * A single declarative config per entity drives the generic list, form
 * and detail views, so ~a dozen entities share one implementation.
 */

import type { LucideIcon } from "lucide-react";

export type FieldType =
  | "text"
  | "textarea"
  | "email"
  | "number"
  | "money"
  | "date"
  | "datetime"
  | "boolean"
  | "select"
  | "reference";

export interface FieldConfig {
  name: string;
  label: string;
  type?: FieldType;
  /** Options for `select`. */
  options?: readonly string[];
  /** Related entity (API path) for `reference` fields. */
  reference?: string;
  required?: boolean;
  placeholder?: string;
  help?: string;
  /** Group heading the field is shown under. */
  section?: string;
}

export type ColumnType =
  | "text"
  | "badge"
  | "date"
  | "datetime"
  | "boolean"
  | "money"
  | "number";

export interface ColumnConfig {
  name: string;
  label: string;
  type?: ColumnType;
}

export interface RelatedListConfig {
  /** Related entity API path. */
  entity: string;
  label: string;
  /** Field on the related entity that references this record's id. */
  foreignKey: string;
}

export interface ResourceUI {
  /** API path segment and registry key (e.g. "account"). */
  entity: string;
  singular: string;
  plural: string;
  icon?: LucideIcon;
  /** Field used as the record's title. */
  titleField: string;
  /** Optional custom title derivation. */
  getTitle?: (record: Record<string, any>) => string;
  columns: ColumnConfig[];
  fields: FieldConfig[];
  searchPlaceholder?: string;
  /** Relations to expand on the detail view. */
  detailExpand?: string[];
  related?: RelatedListConfig[];
}
