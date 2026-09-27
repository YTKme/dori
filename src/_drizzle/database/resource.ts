/**
 * Generic Tenant-Scoped Resource
 *
 * A small factory that provides consistent, multi-tenant CRUD for any CRM
 * table built on the shared `baseColumns()` (i.e. having `id`,
 * `organizationId`, `ownerId`, `createdById`, `updatedById`, `createdAt`,
 * `updatedAt`, `deletedAt`).
 *
 * Filtering, sorting, pagination and counting use the stable core query
 * builder (a single source of truth for the WHERE clause). Relation
 * `expand` is layered on top via the relational-query API, hydrating the
 * current page by id and preserving order. Deletes are soft by default.
 */

import { and, asc, desc, eq, ilike, isNull, or, type SQL } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import type * as z from "zod";

import { drizzleClient } from "../client";

type AnyRecord = Record<string, any>;

type ResourceConfig = {
  /** Key under `drizzleClient.query` (e.g. "accountTable"). */
  queryKey: string;
  /** The drizzle table object. */
  table: PgTable;
  /** Zod schema validating the POST (create) body. */
  createSchema?: z.ZodTypeAny;
  /** Zod schema validating the PATCH (update) body. */
  updateSchema?: z.ZodTypeAny;
  /** Text columns (property names) matched by the `q` search term. */
  searchColumns?: string[];
  /** Property names permitted for `sort`. */
  sortColumns?: string[];
  /** Default sort property name (default "createdAt"). */
  defaultSort?: string;
  /** Default order when none supplied (default "desc"). */
  defaultOrder?: "asc" | "desc";
  /** Property names permitted as equality filters. */
  filterColumns?: string[];
  /** Relation names permitted for `expand`. */
  allowedExpand?: string[];
};

type ListParams = {
  organizationId: string;
  limit?: number;
  offset?: number;
  sort?: string;
  order?: "asc" | "desc";
  q?: string;
  filters?: Record<string, string>;
  expand?: string[];
  includeDeleted?: boolean;
};

type Actor = { organizationId: string; actorId?: string | null };

const IMMUTABLE_FIELDS = new Set([
  "id",
  "organizationId",
  "createdAt",
  "createdById",
]);

function createResource<TSelect extends AnyRecord, TInsert extends AnyRecord>(
  config: ResourceConfig,
) {
  const table = config.table;
  // Column accessor: base columns exist on every business table but are
  // not part of the generic `PgTable` type, so index through a cast.
  const cols = config.table as AnyRecord;
  const defaultSort = config.defaultSort ?? "createdAt";
  const defaultOrder = config.defaultOrder ?? "desc";

  function whereClause(params: {
    organizationId: string;
    q?: string;
    filters?: Record<string, string>;
    includeDeleted?: boolean;
  }): SQL {
    const clauses: SQL[] = [eq(cols.organizationId, params.organizationId)];

    if (!params.includeDeleted) {
      clauses.push(isNull(cols.deletedAt));
    }

    if (params.q && config.searchColumns?.length) {
      const matches = config.searchColumns
        .filter((column) => cols[column])
        .map((column) => ilike(cols[column], `%${params.q}%`));
      const orClause = or(...matches);
      if (orClause) clauses.push(orClause);
    }

    if (params.filters) {
      for (const [key, value] of Object.entries(params.filters)) {
        if (config.filterColumns?.includes(key) && cols[key]) {
          clauses.push(eq(cols[key], value));
        }
      }
    }

    return and(...clauses) as SQL;
  }

  function orderExpression(sort?: string, order?: "asc" | "desc") {
    const key =
      sort && config.sortColumns?.includes(sort) ? sort : defaultSort;
    const column = cols[key] ?? cols.createdAt;
    return (order ?? defaultOrder) === "asc" ? asc(column) : desc(column);
  }

  function withClause(expand?: string[]): Record<string, true> | undefined {
    if (!expand?.length || !config.allowedExpand?.length) return undefined;
    const entries = expand
      .filter((name) => config.allowedExpand?.includes(name))
      .map((name) => [name, true] as const);
    return entries.length ? Object.fromEntries(entries) : undefined;
  }

  async function list(
    params: ListParams,
  ): Promise<{ data: TSelect[]; total: number }> {
    const where = whereClause(params);
    const total = await drizzleClient.$count(table, where);

    const orderBy = orderExpression(params.sort, params.order);
    const limit = params.limit ?? 25;
    const offset = params.offset ?? 0;
    const withObject = withClause(params.expand);

    if (!withObject) {
      const data = (await drizzleClient
        .select()
        .from(table)
        .where(where)
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset)) as TSelect[];
      return { data, total };
    }

    // Expand: fetch the ordered page of ids, then hydrate with relations.
    const idRows = (await drizzleClient
      .select({ id: cols.id })
      .from(table)
      .where(where)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset)) as { id: string }[];
    const ids = idRows.map((row) => row.id);
    if (!ids.length) return { data: [], total };

    const query = (drizzleClient.query as AnyRecord)[config.queryKey];
    const hydrated = (await query.findMany({
      where: { id: { in: ids } },
      with: withObject,
    })) as TSelect[];

    const byId = new Map(hydrated.map((row) => [row.id, row]));
    const data = ids
      .map((id) => byId.get(id))
      .filter((row): row is TSelect => Boolean(row));
    return { data, total };
  }

  async function retrieveById(params: {
    id: string;
    organizationId: string;
    expand?: string[];
    includeDeleted?: boolean;
  }): Promise<TSelect | undefined> {
    const where: AnyRecord = {
      id: params.id,
      organizationId: params.organizationId,
    };
    if (!params.includeDeleted) where.deletedAt = { isNull: true };

    const query = (drizzleClient.query as AnyRecord)[config.queryKey];
    const row = await query.findFirst({
      where,
      with: withClause(params.expand),
    });
    return row as TSelect | undefined;
  }

  async function create(params: {
    data: TInsert;
    organizationId: string;
    actorId?: string | null;
  }): Promise<TSelect> {
    const values: AnyRecord = {
      ...params.data,
      organizationId: params.organizationId,
      ownerId: params.data.ownerId ?? params.actorId ?? null,
      createdById: params.actorId ?? null,
      updatedById: params.actorId ?? null,
    };
    const rows = (await drizzleClient
      .insert(table)
      .values(values)
      .returning()) as TSelect[];
    return rows[0];
  }

  async function updateById(params: {
    id: string;
    data: Partial<TInsert>;
    organizationId: string;
    actorId?: string | null;
  }): Promise<TSelect | undefined> {
    const values: AnyRecord = { updatedById: params.actorId ?? null };
    for (const [key, value] of Object.entries(params.data)) {
      if (!IMMUTABLE_FIELDS.has(key)) values[key] = value;
    }

    const rows = (await drizzleClient
      .update(table)
      .set(values)
      .where(
        and(
          eq(cols.id, params.id),
          eq(cols.organizationId, params.organizationId),
          isNull(cols.deletedAt),
        ),
      )
      .returning()) as TSelect[];
    return rows[0];
  }

  async function deleteById(params: {
    id: string;
    organizationId: string;
    actorId?: string | null;
    hard?: boolean;
  }): Promise<TSelect | undefined> {
    if (params.hard) {
      const rows = (await drizzleClient
        .delete(table)
        .where(
          and(
            eq(cols.id, params.id),
            eq(cols.organizationId, params.organizationId),
          ),
        )
        .returning()) as TSelect[];
      return rows[0];
    }

    const rows = (await drizzleClient
      .update(table)
      .set({ deletedAt: new Date(), updatedById: params.actorId ?? null })
      .where(
        and(
          eq(cols.id, params.id),
          eq(cols.organizationId, params.organizationId),
          isNull(cols.deletedAt),
        ),
      )
      .returning()) as TSelect[];
    return rows[0];
  }

  async function restoreById(params: {
    id: string;
    organizationId: string;
  }): Promise<TSelect | undefined> {
    const rows = (await drizzleClient
      .update(table)
      .set({ deletedAt: null })
      .where(
        and(
          eq(cols.id, params.id),
          eq(cols.organizationId, params.organizationId),
        ),
      )
      .returning()) as TSelect[];
    return rows[0];
  }

  return {
    config,
    createSchema: config.createSchema,
    updateSchema: config.updateSchema,
    create,
    deleteById,
    list,
    restoreById,
    retrieveById,
    updateById,
  };
}

type Resource = ReturnType<typeof createResource>;

export { createResource, type ListParams, type Resource, type ResourceConfig };
