/**
 * HTTP Helpers
 *
 * Shared utilities for the REST API: query-string parsing (pagination,
 * sorting, search, filtering, relation expansion), consistent response
 * envelopes, and a typed error class with a `handle()` wrapper that maps
 * thrown errors to the correct status code.
 */

import * as z from "zod";

const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 200;

type ListQuery = {
  limit: number;
  offset: number;
  sort?: string;
  order: "asc" | "desc";
  q?: string;
  expand: string[];
  filters: Record<string, string>;
};

const RESERVED_QUERY_KEYS = ["limit", "offset", "sort", "order", "q", "expand"];

function toInt(value: string | null, fallback: number): number {
  if (value === null) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Parse the list query-string into a normalized, bounded shape.
 * Any query parameter that is not a reserved keyword is treated as an
 * equality filter (validated later, per resource).
 */
function parseListQuery(request: Request): ListQuery {
  const url = new URL(request.url);
  const p = url.searchParams;

  const limit = clamp(toInt(p.get("limit"), DEFAULT_LIMIT), 1, MAX_LIMIT);
  const offset = Math.max(0, toInt(p.get("offset"), 0));
  const sort = p.get("sort") ?? undefined;
  const order = p.get("order") === "asc" ? "asc" : "desc";
  const q = p.get("q")?.trim() || undefined;
  const expand = (p.get("expand") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const reserved = new Set(RESERVED_QUERY_KEYS);
  const filters: Record<string, string> = {};
  for (const [key, value] of p.entries()) {
    if (!reserved.has(key)) filters[key] = value;
  }

  return { limit, offset, sort, order, q, expand, filters };
}

/** A REST error carrying an HTTP status and a machine-readable code. */
class ApiError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(
    message: string,
    status = 500,
    code = "internal_error",
    details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const apiError = {
  unauthorized: (message = "Authentication required.") =>
    new ApiError(message, 401, "unauthorized"),
  forbidden: (message = "You do not have access to this resource.") =>
    new ApiError(message, 403, "forbidden"),
  notFound: (message = "Resource not found.") =>
    new ApiError(message, 404, "not_found"),
  badRequest: (message = "Bad request.", details?: unknown) =>
    new ApiError(message, 400, "bad_request", details),
  conflict: (message = "Conflict.") => new ApiError(message, 409, "conflict"),
};

/** Single item envelope: `{ data }`. */
function jsonItem<T>(data: T, init?: ResponseInit): Response {
  return Response.json({ data }, init);
}

/** Created item envelope with 201. */
function jsonCreated<T>(data: T): Response {
  return Response.json({ data }, { status: 201 });
}

/** List envelope: `{ data, pagination }`. */
function jsonList<T>(
  data: T[],
  pagination: { total: number; limit: number; offset: number },
): Response {
  return Response.json({ data, pagination });
}

/** Error envelope: `{ error: { message, code, details? } }`. */
function jsonError(error: ApiError): Response {
  return Response.json(
    {
      error: {
        message: error.message,
        code: error.code,
        ...(error.details !== undefined ? { details: error.details } : {}),
      },
    },
    { status: error.status },
  );
}

/**
 * Wrap a route handler, mapping thrown errors to a proper response:
 *  - `ApiError` → its status/code
 *  - `ZodError` → 422 with field issues
 *  - anything else → 500 (logged)
 */
async function handle(fn: () => Promise<Response>): Promise<Response> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof ApiError) {
      return jsonError(error);
    }
    if (error instanceof z.ZodError) {
      return jsonError(
        new ApiError("Validation failed.", 422, "validation_error", error.issues),
      );
    }
    console.error("Unhandled API error:", error);
    return jsonError(new ApiError("Internal server error.", 500));
  }
}

/** Parse and validate a JSON request body with a Zod schema. */
async function parseBody<T>(request: Request, schema: z.ZodType<T>): Promise<T> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    throw apiError.badRequest("Request body must be valid JSON.");
  }
  return schema.parse(raw);
}

export {
  ApiError,
  apiError,
  DEFAULT_LIMIT,
  handle,
  jsonCreated,
  jsonError,
  jsonItem,
  jsonList,
  type ListQuery,
  MAX_LIMIT,
  parseBody,
  parseListQuery,
};
