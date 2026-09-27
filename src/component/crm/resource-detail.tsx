import { Link, useNavigate } from "@tanstack/react-router";
import { PencilIcon, Trash2Icon } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "~/_shadcn/component/interface/button";
import { Card, CardContent } from "~/_shadcn/component/interface/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/_shadcn/component/interface/tabs";
import { api } from "~/library/api";
import { formatCell } from "./format";
import { RelatedList } from "./related-list";
import { getResource, resourceTitle } from "./resources";
import type { FieldConfig, ResourceUI } from "./types";

function renderField(
  record: Record<string, any>,
  field: FieldConfig,
): ReactNode {
  if (field.type === "reference") {
    const relationName = field.name.replace(/Id$/, "");
    const related = record[relationName];
    if (related && typeof related === "object") {
      const relatedResource = field.reference
        ? getResource(field.reference)
        : undefined;
      return relatedResource
        ? resourceTitle(relatedResource, related)
        : (related.name ?? related.id);
    }
    return record[field.name] ? (
      <span className="font-mono text-xs">{record[field.name]}</span>
    ) : (
      <span className="text-muted-foreground">—</span>
    );
  }

  const columnType =
    field.type === "select"
      ? "badge"
      : field.type === "money"
        ? "money"
        : field.type === "date"
          ? "date"
          : field.type === "datetime"
            ? "datetime"
            : field.type === "boolean"
              ? "boolean"
              : field.type === "number"
                ? "number"
                : "text";
  return formatCell(record[field.name], columnType);
}

export function ResourceDetail({
  resource,
  id,
}: {
  resource: ResourceUI;
  id: string;
}) {
  const navigate = useNavigate();
  const [record, setRecord] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .get<Record<string, any>>(resource.entity, id, {
        expand: resource.detailExpand?.join(","),
      })
      .then((result) => active && (setRecord(result.data), setLoading(false)))
      .catch((error) => {
        toast.error((error as Error).message);
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [resource, id]);

  async function handleDelete() {
    if (!window.confirm(`Delete this ${resource.singular.toLowerCase()}?`)) {
      return;
    }
    try {
      await api.remove(resource.entity, id);
      toast.success(`${resource.singular} deleted.`);
      navigate({ to: "/$entity", params: { entity: resource.entity } });
    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  if (loading) return <p className="text-muted-foreground">Loading…</p>;
  if (!record) return <p className="text-muted-foreground">Not found.</p>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {resourceTitle(resource, record)}
          </h1>
          <p className="text-muted-foreground">{resource.singular}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            nativeButton={false}
            render={
              <Link
                to="/$entity/$id/edit"
                params={{ entity: resource.entity, id }}
              />
            }
          >
            <PencilIcon /> Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2Icon /> Delete
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          {resource.related?.map((rel) => (
            <TabsTrigger key={rel.entity} value={rel.entity}>
              {rel.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="details">
          <Card>
            <CardContent className="grid gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-3">
              {resource.fields.map((field) => (
                <div key={field.name} className="flex flex-col gap-1">
                  <dt className="text-xs text-muted-foreground">
                    {field.label}
                  </dt>
                  <dd className="text-sm">{renderField(record, field)}</dd>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        {resource.related?.map((rel) => (
          <TabsContent key={rel.entity} value={rel.entity}>
            <RelatedList rel={rel} recordId={id} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
