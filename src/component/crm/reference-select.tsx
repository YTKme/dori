import { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/_shadcn/component/interface/select";
import { api } from "~/library/api";
import { getResource, resourceTitle } from "./resources";

const NONE = "__none__";

export function ReferenceSelect({
  entity,
  value,
  onChange,
  placeholder,
}: {
  entity: string;
  value: string | null | undefined;
  onChange: (value: string | null) => void;
  placeholder?: string;
}) {
  const [options, setOptions] = useState<Record<string, any>[]>([]);
  const resource = getResource(entity);

  useEffect(() => {
    let active = true;
    api
      .list<Record<string, any>>(entity, { limit: 100 })
      .then((result) => {
        if (active) setOptions(result.data);
      })
      .catch(() => {
        if (active) setOptions([]);
      });
    return () => {
      active = false;
    };
  }, [entity]);

  function label(option: Record<string, any>): string {
    if (resource) return resourceTitle(resource, option);
    return option.name ?? option.subject ?? option.id;
  }

  const items = [
    { label: "None", value: NONE },
    ...options.map((option) => ({ label: label(option), value: option.id })),
  ];

  return (
    <Select
      items={items}
      value={value ?? NONE}
      onValueChange={(next) => onChange(next && next !== NONE ? next : null)}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder ?? "Select…"} />
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
}
