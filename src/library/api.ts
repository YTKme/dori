/**
 * Browser API client for the REST endpoints under `/api/v1`.
 *
 * Requests are same-origin and authenticated by the session cookie.
 */

type ListResult<T> = {
  data: T[];
  pagination: { total: number; limit: number; offset: number };
};

type ItemResult<T> = { data: T };

type QueryParams = Record<string, string | number | boolean | undefined | null>;

function queryString(params?: QueryParams): string {
  if (!params) return "";
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/v1${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...init?.headers,
    },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      body?.error?.message ?? `Request failed with status ${response.status}`;
    throw new Error(message);
  }
  return body as T;
}

export const api = {
  list: <T>(entity: string, params?: QueryParams) =>
    apiFetch<ListResult<T>>(`/${entity}${queryString(params)}`),
  get: <T>(entity: string, id: string, params?: QueryParams) =>
    apiFetch<ItemResult<T>>(`/${entity}/${id}${queryString(params)}`),
  create: <T>(entity: string, body: unknown) =>
    apiFetch<ItemResult<T>>(`/${entity}`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  update: <T>(entity: string, id: string, body: unknown) =>
    apiFetch<ItemResult<T>>(`/${entity}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  remove: <T>(entity: string, id: string) =>
    apiFetch<ItemResult<T>>(`/${entity}/${id}`, { method: "DELETE" }),
  post: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: "POST", body: JSON.stringify(body) }),
};

export type { ItemResult, ListResult, QueryParams };
