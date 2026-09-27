/**
 * Shared Zod validation helpers for API request bodies.
 *
 * Server-managed columns (id, organizationId, createdById, updatedById,
 * timestamps) are never accepted from clients — the data-access layer sets
 * them — so entity schemas only describe user-editable fields.
 */

import * as z from "zod";

const MAX_TEXT = 20000;

/** Required, trimmed, non-empty text. */
const reqText = () => z.string().trim().min(1).max(MAX_TEXT);

/** Optional text; `null` clears the value. */
const optText = () => z.string().max(MAX_TEXT).nullish();

const optEmail = () => z.string().email().max(320).nullish();

const optUuid = () => z.string().uuid().nullish();

const optBool = () => z.boolean().optional();

/** Integer count; accepts numeric strings. */
const optInt = () => z.coerce.number().int().nullish();

/** Numeric/decimal stored as string; accepts number or string. */
const optMoney = () =>
  z.union([z.number(), z.string()]).transform((v) => String(v)).nullish();

const reqMoney = () =>
  z.union([z.number(), z.string()]).transform((v) => String(v));

/** Calendar date as `YYYY-MM-DD` string. */
const optDate = () =>
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD").nullish();

/** Timestamp; accepts ISO strings or Date. */
const optTimestamp = () => z.coerce.date().nullish();

const optEnum = <T extends readonly [string, ...string[]]>(values: T) =>
  z.enum(values).nullish();

const reqEnum = <T extends readonly [string, ...string[]]>(values: T) =>
  z.enum(values);

/** Record owner (re)assignment. */
const optOwner = () => z.string().uuid().nullish();

/** A group of address columns sharing a prefix (billing/shipping/mailing). */
function address(prefix: string): Record<string, z.ZodTypeAny> {
  return {
    [`${prefix}Street`]: optText(),
    [`${prefix}City`]: optText(),
    [`${prefix}State`]: optText(),
    [`${prefix}PostalCode`]: optText(),
    [`${prefix}Country`]: optText(),
  };
}

export {
  address,
  optBool,
  optDate,
  optEmail,
  optEnum,
  optInt,
  optMoney,
  optOwner,
  optTimestamp,
  optText,
  optUuid,
  reqEnum,
  reqMoney,
  reqText,
};
