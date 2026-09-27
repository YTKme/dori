import { createFileRoute } from "@tanstack/react-router";
import { Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/_shadcn/component/interface/table";
import { api } from "~/library/api";

type Stage = {
  id: string;
  name: string;
  displayOrder: number;
  probability: string;
  isWon: boolean;
  isClosed: boolean;
};

export const Route = createFileRoute("/_authed/settings/stage")({
  component: StagesPage,
});

function StagesPage() {
  const [stages, setStages] = useState<Stage[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [order, setOrder] = useState("");
  const [probability, setProbability] = useState("");
  const [isWon, setIsWon] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const result = await api.list<Stage>("opportunity-stage", {
        limit: 100,
        sort: "displayOrder",
        order: "asc",
      });
      setStages(result.data);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function add(event: React.FormEvent) {
    event.preventDefault();
    try {
      await api.create("opportunity-stage", {
        name,
        displayOrder: order ? Number(order) : stages.length + 1,
        probability: probability || "0",
        isWon,
        isClosed,
      });
      setName("");
      setOrder("");
      setProbability("");
      setIsWon(false);
      setIsClosed(false);
      toast.success("Stage added.");
      load();
    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this stage?")) return;
    try {
      await api.remove("opportunity-stage", id);
      load();
    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">Pipeline Stages</h2>
        <p className="text-sm text-muted-foreground">
          Configure the stages of your sales pipeline.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Probability</TableHead>
              <TableHead>Won</TableHead>
              <TableHead>Closed</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-20 text-center text-muted-foreground">
                  Loading…
                </TableCell>
              </TableRow>
            ) : stages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-20 text-center text-muted-foreground">
                  No stages yet.
                </TableCell>
              </TableRow>
            ) : (
              stages.map((stage) => (
                <TableRow key={stage.id}>
                  <TableCell>{stage.displayOrder}</TableCell>
                  <TableCell className="font-medium">{stage.name}</TableCell>
                  <TableCell>{stage.probability}%</TableCell>
                  <TableCell>{stage.isWon ? "Yes" : "No"}</TableCell>
                  <TableCell>{stage.isClosed ? "Yes" : "No"}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Delete stage"
                      onClick={() => remove(stage.id)}
                    >
                      <Trash2Icon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add stage</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={add} className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="stage-name">Name</Label>
              <Input
                id="stage-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stage-order">Display order</Label>
              <Input
                id="stage-order"
                type="number"
                value={order}
                onChange={(event) => setOrder(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stage-prob">Probability (%)</Label>
              <Input
                id="stage-prob"
                type="number"
                step="0.01"
                value={probability}
                onChange={(event) => setProbability(event.target.value)}
              />
            </div>
            <div className="flex items-center gap-6 pt-6">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="stage-won"
                  checked={isWon}
                  onCheckedChange={(checked) => setIsWon(checked === true)}
                />
                <Label htmlFor="stage-won">Won</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="stage-closed"
                  checked={isClosed}
                  onCheckedChange={(checked) => setIsClosed(checked === true)}
                />
                <Label htmlFor="stage-closed">Closed</Label>
              </div>
            </div>
            <div className="sm:col-span-2">
              <Button type="submit">Add stage</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
