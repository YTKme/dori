import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/_shadcn/component/interface/card";
import { api } from "~/library/api";

const KPIS = [
  { entity: "lead", label: "Leads" },
  { entity: "account", label: "Accounts" },
  { entity: "contact", label: "Contacts" },
  { entity: "opportunity", label: "Opportunities" },
  { entity: "case", label: "Cases" },
  { entity: "quote", label: "Quotes" },
];

export const Route = createFileRoute("/_authed/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all(
      KPIS.map(async (kpi) => {
        const result = await api.list(kpi.entity, { limit: 1 });
        return [kpi.entity, result.pagination.total] as const;
      }),
    )
      .then((entries) => {
        if (active) {
          setCounts(Object.fromEntries(entries));
          setLoading(false);
        }
      })
      .catch(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Your CRM at a glance.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {KPIS.map((kpi) => (
          <Card key={kpi.entity}>
            <CardHeader>
              <CardDescription>{kpi.label}</CardDescription>
              <CardTitle className="text-3xl tabular-nums">
                {loading ? "—" : (counts[kpi.entity] ?? 0)}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
