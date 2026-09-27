import { createFileRoute } from "@tanstack/react-router";
import { Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { authClient } from "~/_betterauth/auth-client";
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

export const Route = createFileRoute("/_authed/settings/member")({
  component: MembersPage,
});

function MembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  async function load() {
    setLoading(true);
    try {
      const response: any = await authClient.organization.getFullOrganization();
      const org = response?.data ?? response;
      setMembers(org?.members ?? []);
      setInvitations(
        (org?.invitations ?? []).filter(
          (invitation: any) => invitation.status === "pending",
        ),
      );
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function invite(event: React.FormEvent) {
    event.preventDefault();
    try {
      const result: any = await authClient.organization.inviteMember({
        email,
        role: "member",
      });
      if (result?.error) throw new Error(result.error.message);
      toast.success("Invitation created.");
      setEmail("");
      load();
    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  async function remove(memberId: string) {
    if (!window.confirm("Remove this member?")) return;
    try {
      await authClient.organization.removeMember({ memberIdOrEmail: memberId });
      load();
    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">Members</h2>
        <p className="text-sm text-muted-foreground">
          People with access to this organization.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-20 text-center text-muted-foreground">
                  Loading…
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">
                    {member.user?.name ?? "—"}
                  </TableCell>
                  <TableCell>{member.user?.email ?? "—"}</TableCell>
                  <TableCell className="capitalize">{member.role}</TableCell>
                  <TableCell className="text-right">
                    {member.role !== "owner" && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Remove member"
                        onClick={() => remove(member.id)}
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

      {invitations.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-medium">Pending invitations</h3>
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableBody>
                {invitations.map((invitation) => (
                  <TableRow key={invitation.id}>
                    <TableCell>{invitation.email}</TableCell>
                    <TableCell className="capitalize">
                      {invitation.role}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Invite a member</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={invite} className="flex items-end gap-3">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="invite-email">Email</Label>
              <Input
                id="invite-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <Button type="submit">Invite</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
