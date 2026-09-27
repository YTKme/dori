import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/_shadcn/component/interface/select";
import { formatMoney } from "~/component/crm/format";
import { api } from "~/library/api";

export const Route = createFileRoute("/_authed/pipeline")({
  component: Pipeline,
});

type Stage = { id: string; name: string };
type Opp = {
  id: string;
  name: string;
  amount: string | null;
  stageId: string | null;
  account?: { name?: string } | null;
};

function Pipeline() {
  const [stages, setStages] = useState<Stage[]>([]);
  const [opps, setOpps] = useState<Opp[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const [stageResult, oppResult] = await Promise.all([
        api.list<Stage>("opportunity-stage", {
          limit: 100,
          sort: "displayOrder",
          order: "asc",
        }),
        api.list<Opp>("opportunity", { limit: 200, expand: "account" }),
      ]);
      setStages(stageResult.data);
      setOpps(oppResult.data);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function move(oppId: string, stageId: string) {
    setOpps((previous) =>
      previous.map((opp) => (opp.id === oppId ? { ...opp, stageId } : opp)),
    );
    try {
      await api.update("opportunity", oppId, { stageId });
    } catch (error) {
      toast.error((error as Error).message);
      load();
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">Pipeline</h1>

      {loading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : stages.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          No pipeline stages yet.{" "}
          <Link to="/settings/stage" className="underline underline-offset-4">
            Create stages
          </Link>
          .
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => {
            const items = opps.filter((opp) => opp.stageId === stage.id);
            const total = items.reduce(
              (sum, opp) => sum + Number(opp.amount ?? 0),
              0,
            );
            return (
              <div
                key={stage.id}
                className="flex w-72 shrink-0 flex-col gap-2"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  const id = event.dataTransfer.getData("text/plain");
                  if (id) move(id, stage.id);
                }}
              >
                <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
                  <span className="font-medium">{stage.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {items.length} · {formatMoney(total)}
                  </span>
                </div>
                <div className="flex min-h-16 flex-col gap-2">
                  {items.map((opp) => (
                    <div
                      key={opp.id}
                      draggable
                      onDragStart={(event) =>
                        event.dataTransfer.setData("text/plain", opp.id)
                      }
                      className="flex flex-col gap-2 rounded-lg border bg-card p-3 shadow-sm"
                    >
                      <Link
                        to="/$entity/$id"
                        params={{ entity: "opportunity", id: opp.id }}
                        className="font-medium hover:underline"
                      >
                        {opp.name}
                      </Link>
                      <div className="text-sm text-muted-foreground">
                        {opp.account?.name ?? "—"}
                      </div>
                      <div className="text-sm font-medium tabular-nums">
                        {formatMoney(opp.amount)}
                      </div>
                      <Select
                        items={stages.map((s) => ({ label: s.name, value: s.id }))}
                        value={opp.stageId ?? undefined}
                        onValueChange={(next) => {
                          if (next) move(opp.id, next);
                        }}
                      >
                        <SelectTrigger size="sm" className="w-full" aria-label="Move to stage">
                          <SelectValue placeholder="Move to…" />
                        </SelectTrigger>
                        <SelectContent>
                          {stages.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
