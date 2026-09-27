/**
 * REST Handler Helpers
 *
 * Per-method helpers used by the API route files. They are invoked from
 * *inside* each route's inline `server.handlers` closures so the TanStack
 * Start compiler can strip the server-only imports (data-access, auth,
 * database) from the client bundle.
 *
 * Every handler resolves the tenant via `requireOrganization` first, then
 * delegates to the tenant-scoped resource. Errors are normalized by
 * `handle()`.
 */

import type { ZodTypeAny } from "zod";

import {
  apiError,
  handle,
  jsonCreated,
  jsonItem,
  jsonList,
  parseBody,
  parseListQuery,
} from "./http";
import { requireOrganization } from "./tenancy.server";
import * as uuid from "./uuid";

type AnyResource = {
  list: (params: any) => Promise<{ data: any[]; total: number }>;
  retrieveById: (params: any) => Promise<any>;
  create: (params: any) => Promise<any>;
  updateById: (params: any) => Promise<any>;
  deleteById: (params: any) => Promise<any>;
  createSchema?: ZodTypeAny;
  updateSchema?: ZodTypeAny;
};

function expandParam(request: Request): string[] {
  return (new URL(request.url).searchParams.get("expand") ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function handleList(resource: AnyResource, request: Request): Promise<Response> {
  return handle(async () => {
    const ctx = await requireOrganization(request);
    const query = parseListQuery(request);
    const { data, total } = await resource.list({
      organizationId: ctx.organizationId,
      limit: query.limit,
      offset: query.offset,
      sort: query.sort,
      order: query.order,
      q: query.q,
      filters: query.filters,
      expand: query.expand,
    });
    return jsonList(data, {
      total,
      limit: query.limit,
      offset: query.offset,
    });
  });
}

function handleCreate(
  resource: AnyResource,
  request: Request,
): Promise<Response> {
  return handle(async () => {
    const ctx = await requireOrganization(request);
    if (!resource.createSchema) throw apiError.badRequest("Create is not supported.");
    const body = await parseBody(request, resource.createSchema);
    const created = await resource.create({
      data: body as Record<string, unknown>,
      organizationId: ctx.organizationId,
      actorId: ctx.userId,
    });
    return jsonCreated(created);
  });
}

function handleGet(
  resource: AnyResource,
  request: Request,
  id: string,
): Promise<Response> {
  return handle(async () => {
    const ctx = await requireOrganization(request);
    if (!uuid.isValid(id)) throw apiError.badRequest("Invalid identifier.");
    const row = await resource.retrieveById({
      id,
      organizationId: ctx.organizationId,
      expand: expandParam(request),
    });
    if (!row) throw apiError.notFound();
    return jsonItem(row);
  });
}

function handleUpdate(
  resource: AnyResource,
  request: Request,
  id: string,
): Promise<Response> {
  return handle(async () => {
    const ctx = await requireOrganization(request);
    if (!uuid.isValid(id)) throw apiError.badRequest("Invalid identifier.");
    if (!resource.updateSchema) throw apiError.badRequest("Update is not supported.");
    const body = await parseBody(request, resource.updateSchema);
    const row = await resource.updateById({
      id,
      data: body as Record<string, unknown>,
      organizationId: ctx.organizationId,
      actorId: ctx.userId,
    });
    if (!row) throw apiError.notFound();
    return jsonItem(row);
  });
}

function handleDelete(
  resource: AnyResource,
  request: Request,
  id: string,
): Promise<Response> {
  return handle(async () => {
    const ctx = await requireOrganization(request);
    if (!uuid.isValid(id)) throw apiError.badRequest("Invalid identifier.");
    const hard = new URL(request.url).searchParams.get("hard") === "true";
    const row = await resource.deleteById({
      id,
      organizationId: ctx.organizationId,
      actorId: ctx.userId,
      hard,
    });
    if (!row) throw apiError.notFound();
    return jsonItem(row);
  });
}

export {
  type AnyResource,
  handleCreate,
  handleDelete,
  handleGet,
  handleList,
  handleUpdate,
};
