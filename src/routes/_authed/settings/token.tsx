import { createFileRoute } from "@tanstack/react-router";
import { CopyIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "~/_shadcn/component/interface/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/_shadcn/component/interface/card";
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
import { formatDate } from "~/component/crm/format";
import { api } from "~/library/api";

type Token = {
  id: string;
  name: string;
  tokenPrefix: string;
  lastFour: string | null;
  expiresAt: string | null;
  lastUsedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
};

export const Route = createFileRoute("/_authed/settings/token")({
  component: TokensPage,
});

function TokensPage() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [created, setCreated] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const result = await api.list<Token>("token", { limit: 100 });
      setTokens(result.data);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function create(event: React.FormEvent) {
    event.preventDefault();
    try {
      const result = await api.create<{ token: string; record: Token }>(
        "token",
        { name },
      );
      setCreated(result.data.token);
      setName("");
      toast.success("Token created.");
      load();
    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  async function revoke(id: string) {
    if (!window.confirm("Revoke this token?")) return;
    try {
      await api.remove("token", id);
      load();
    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">API Tokens</h2>
        <p className="text-sm text-muted-foreground">
          Personal access tokens authenticate REST API requests with a{" "}
          <span className="font-mono">Authorization: Bearer</span> header.
        </p>
      </div>

      {created && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="text-base">Copy your new token</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              This is the only time the token is shown. Store it securely.
            </p>
            <div className="flex items-center gap-2">
              <Input readOnly value={created} className="font-mono" />
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard?.writeText(created);
                  toast.success("Copied to clipboard.");
                }}
              >
                <CopyIcon /> Copy
              </Button>
            </div>
            <div>
              <Button variant="ghost" size="sm" onClick={() => setCreated(null)}>
                Done
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Token</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last used</TableHead>
              <TableHead>Status</TableHead>
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
            ) : tokens.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-20 text-center text-muted-foreground">
                  No tokens yet.
                </TableCell>
              </TableRow>
            ) : (
              tokens.map((token) => (
                <TableRow key={token.id}>
                  <TableCell className="font-medium">{token.name}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {token.tokenPrefix}…{token.lastFour}
                  </TableCell>
                  <TableCell>{formatDate(token.createdAt)}</TableCell>
                  <TableCell>
                    {token.lastUsedAt ? formatDate(token.lastUsedAt) : "Never"}
                  </TableCell>
                  <TableCell>{token.revokedAt ? "Revoked" : "Active"}</TableCell>
                  <TableCell className="text-right">
                    {!token.revokedAt && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Revoke token"
                        onClick={() => revoke(token.id)}
                      >
                        <Trash2Icon />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Create token</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={create} className="flex items-end gap-3">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="token-name">Name</Label>
              <Input
                id="token-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Zapier integration"
                required
              />
            </div>
            <Button type="submit">Create</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
