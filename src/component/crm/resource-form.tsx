import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "~/_shadcn/component/interface/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/_shadcn/component/interface/card";
import { Checkbox } from "~/_shadcn/component/interface/checkbox";
import { Input } from "~/_shadcn/component/interface/input";
import { Label } from "~/_shadcn/component/interface/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/_shadcn/component/interface/select";
import { Textarea } from "~/_shadcn/component/interface/textarea";
import { api } from "~/library/api";
import { humanize } from "./format";
import { ReferenceSelect } from "./reference-select";
import type { FieldConfig, ResourceUI } from "./types";

type Values = Record<string, any>;

function toInputDateTime(value: unknown): string {
  if (!value) return "";
  const date = new Date(value as string);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function initialValue(field: FieldConfig, record?: Values): any {
  const raw = record?.[field.name];
  if (field.type === "boolean") return Boolean(raw);
  if (raw === null || raw === undefined) return "";
  if (field.type === "datetime") return toInputDateTime(raw);
  return raw;
}

export function ResourceForm({
  resource,
  id,
  initial,
}: {
  resource: ResourceUI;
  id?: string;
  initial?: Record<string, any>;
}) {
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [values, setValues] = useState<Values>({});
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) {
      const seed: Values = {};
      for (const field of resource.fields) {
        seed[field.name] =
          initial?.[field.name] !== undefined
            ? initial[field.name]
            : initialValue(field);
      }
      setValues(seed);
      return;
    }
    let active = true;
    api
      .get<Values>(resource.entity, id)
      .then((result) => {
        if (!active) return;
        const seed: Values = {};
        for (const field of resource.fields) {
          seed[field.name] = initialValue(field, result.data);
        }
        setValues(seed);
        setLoading(false);
      })
      .catch((error) => {
        toast.error((error as Error).message);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id, resource]);

  const sections = useMemo(() => {
    const grouped = new Map<string, FieldConfig[]>();
    for (const field of resource.fields) {
      const key = field.section ?? "Details";
      const list = grouped.get(key) ?? [];
      list.push(field);
      grouped.set(key, list);
    }
    return [...grouped.entries()];
  }, [resource]);

  function setValue(name: string, value: any) {
    setValues((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    const payload: Values = {};
    for (const field of resource.fields) {
      const value = values[field.name];
      if (field.type === "boolean") {
        payload[field.name] = Boolean(value);
      } else if (value === "" || value === null || value === undefined) {
        if (isEdit) payload[field.name] = null;
      } else {
        payload[field.name] = value;
      }
    }

    try {
      const result = isEdit
        ? await api.update<Values>(resource.entity, id as string, payload)
        : await api.create<Values>(resource.entity, payload);
      toast.success(`${resource.singular} saved.`);
      navigate({
        to: "/$entity/$id",
        params: { entity: resource.entity, id: result.data.id },
      });
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-muted-foreground">Loading…</p>;
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">
          {isEdit ? `Edit ${resource.singular}` : `New ${resource.singular}`}
        </h1>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: "/$entity", params: { entity: resource.entity } })}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>

      {sections.map(([section, fields]) => (
        <Card key={section}>
          <CardHeader>
            <CardTitle className="text-base">{section}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <FieldControl
                key={field.name}
                field={field}
                value={values[field.name]}
                onChange={(value) => setValue(field.name, value)}
              />
            ))}
          </CardContent>
        </Card>
      ))}
    </form>
  );
}

function FieldControl({
  field,
  value,
  onChange,
}: {
  field: FieldConfig;
  value: any;
  onChange: (value: any) => void;
}) {
  const id = `field-${field.name}`;

  if (field.type === "boolean") {
    return (
      <div className="flex items-center gap-2">
        <Checkbox
          id={id}
          checked={Boolean(value)}
          onCheckedChange={(checked) => onChange(checked === true)}
        />
        <Label htmlFor={id}>{field.label}</Label>
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>
        {field.label}
        {field.required ? <span className="text-destructive"> *</span> : null}
      </Label>
      {field.type === "textarea" ? (
        <Textarea
          id={id}
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          rows={4}
        />
      ) : field.type === "select" ? (
        (() => {
          const items = [
            { label: "None", value: "__none__" },
            ...(field.options?.map((option) => ({
              label: humanize(option),
              value: option,
            })) ?? []),
          ];
          return (
            <Select
              items={items}
              value={value || "__none__"}
              onValueChange={(next) =>
                onChange(next && next !== "__none__" ? next : "")
              }
            >
              <SelectTrigger id={id} className="w-full">
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent>
                {items.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        })()
      ) : field.type === "reference" ? (
        <ReferenceSelect
          entity={field.reference as string}
          value={value || null}
          onChange={(next) => onChange(next ?? "")}
        />
      ) : (
        <Input
          id={id}
          type={
            field.type === "email"
              ? "email"
              : field.type === "number" || field.type === "money"
                ? "number"
                : field.type === "date"
                  ? "date"
                  : field.type === "datetime"
                    ? "datetime-local"
                    : "text"
          }
          step={field.type === "money" ? "0.01" : undefined}
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          required={field.required}
        />
      )}
      {field.help ? (
        <p className="text-xs text-muted-foreground">{field.help}</p>
      ) : null}
    </div>
  );
}
