import type { ReactNode } from "react";

import { Badge } from "~/_shadcn/component/interface/badge";
import type { ColumnType } from "./types";

/** "new_business" → "New Business". */
export function humanize(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function formatDate(value: unknown): string {
  if (!value) return "—";
  const date = new Date(value as string);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
}

export function formatDateTime(value: unknown): string {
  if (!value) return "—";
  const date = new Date(value as string);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
}

export function formatMoney(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  const amount = Number(value);
  if (Number.isNaN(amount)) return String(value);
  return amount.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
  });
}

const EMPTY = <span className="text-muted-foreground">—</span>;

export function formatCell(value: unknown, type?: ColumnType): ReactNode {
  if (value === null || value === undefined || value === "") return EMPTY;
  switch (type) {
    case "badge":
      return <Badge variant="secondary">{humanize(String(value))}</Badge>;
    case "date":
      return formatDate(value);
    case "datetime":
      return formatDateTime(value);
    case "money":
      return formatMoney(value);
    case "boolean":
      return value ? "Yes" : "No";
    default:
      return String(value);
  }
}
