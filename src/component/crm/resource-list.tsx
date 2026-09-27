import { Link, useNavigate } from "@tanstack/react-router";
import { PlusIcon, SearchIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "~/_shadcn/component/interface/button";
import { Input } from "~/_shadcn/component/interface/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/_shadcn/component/interface/table";
import { api } from "~/library/api";
import { formatCell } from "./format";
import { resourceTitle } from "./resources";
import type { ResourceUI } from "./types";

const PAGE_SIZE = 25;

export function ResourceList({ resource }: { resource: ResourceUI }) {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [term, setTerm] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api.list<Record<string, any>>(resource.entity, {
        limit: PAGE_SIZE,
        offset,
        q: query,
      });
      setRows(result.data);
      setTotal(result.pagination.total);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [resource.entity, offset, query]);

  useEffect(() => {
    load();
  }, [load]);

  const columnCount = resource.columns.length + 1;
  const from = total === 0 ? 0 : offset + 1;
  const to = Math.min(offset + PAGE_SIZE, total);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">
          {resource.plural}
        </h1>
        <Button
          nativeButton={false}
          render={<Link to="/$entity/new" params={{ entity: resource.entity }} />}
        >
          <PlusIcon /> New {resource.singular}
        </Button>
      </div>

      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          setOffset(0);
          setQuery(term);
        }}
      >
        <Input
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder={resource.searchPlaceholder ?? "Search…"}
          className="max-w-xs"
        />
        <Button type="submit" variant="outline" aria-label="Search">
          <SearchIcon />
        </Button>
      </form>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{resource.singular}</TableHead>
              {resource.columns.map((column) => (
                <TableHead key={column.name}>{column.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columnCount} className="h-24 text-center text-muted-foreground">
                  Loading…
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columnCount} className="h-24 text-center text-muted-foreground">
                  No {resource.plural.toLowerCase()} yet.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer"
                  onClick={() =>
                    navigate({
                      to: "/$entity/$id",
                      params: { entity: resource.entity, id: row.id },
                    })
                  }
                >
                  <TableCell className="font-medium">
                    {resourceTitle(resource, row)}
                  </TableCell>
                  {resource.columns.map((column) => (
                    <TableCell key={column.name}>
                      {formatCell(row[column.name], column.type)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {from}–{to} of {total}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={offset === 0}
            onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={to >= total}
            onClick={() => setOffset(offset + PAGE_SIZE)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
