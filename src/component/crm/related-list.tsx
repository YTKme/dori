import { Link, useNavigate } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "~/_shadcn/component/interface/button";
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
import { getResource, resourceTitle } from "./resources";
import type { RelatedListConfig } from "./types";

export function RelatedList({
  rel,
  recordId,
}: {
  rel: RelatedListConfig;
  recordId: string;
}) {
  const navigate = useNavigate();
  const resource = getResource(rel.entity);
  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .list<Record<string, any>>(rel.entity, {
        [rel.foreignKey]: recordId,
        limit: 50,
      })
      .then((result) => active && (setRows(result.data), setLoading(false)))
      .catch(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [rel.entity, rel.foreignKey, recordId]);

  if (!resource) return null;
  const columns = resource.columns.slice(0, 3);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <Button
          size="sm"
          variant="outline"
          nativeButton={false}
          render={
            <Link
              to="/$entity/new"
              params={{ entity: rel.entity }}
              search={{ [rel.foreignKey]: recordId } as never}
            />
          }
        >
          <PlusIcon /> New {resource.singular}
        </Button>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{resource.singular}</TableHead>
              {columns.map((column) => (
                <TableHead key={column.name}>{column.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="h-20 text-center text-muted-foreground">
                  Loading…
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="h-20 text-center text-muted-foreground">
                  None yet.
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
                      params: { entity: rel.entity, id: row.id },
                    })
                  }
                >
                  <TableCell className="font-medium">
                    {resourceTitle(resource, row)}
                  </TableCell>
                  {columns.map((column) => (
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
    </div>
  );
}
