import {
  createFileRoute,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { authClient } from "~/_betterauth/auth-client";
import { Button } from "~/_shadcn/component/interface/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/_shadcn/component/interface/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "~/_shadcn/component/interface/field";
import { Input } from "~/_shadcn/component/interface/input";
import { getCurrentSessionFn } from "~/server/authentication/session";

export const Route = createFileRoute("/onboarding")({
  beforeLoad: async () => {
    const auth = await getCurrentSessionFn();
    if (!auth) {
      throw redirect({ to: "/login" });
    }
    const activeOrganizationId = (
      auth.session as { activeOrganizationId?: string | null }
    ).activeOrganizationId;
    if (activeOrganizationId) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: Onboarding,
});

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function Onboarding() {
  const navigate = useNavigate();
  const list = authClient.useListOrganizations();
  const organizations = list.data ?? [];
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);

  async function activate(id: string) {
    await authClient.organization.setActive({ organizationId: id });
    navigate({ to: "/dashboard" });
  }

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    const finalSlug = slug.trim() || slugify(name);
    const result = await authClient.organization.create({
      name: name.trim(),
      slug: finalSlug,
    });
    if (result.error || !result.data) {
      setLoading(false);
      toast.error(result.error?.message ?? "Could not create organization.");
      return;
    }
    await authClient.organization.setActive({ organizationId: result.data.id });
    setLoading(false);
    toast.success("Workspace ready.");
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        {organizations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Choose a workspace</CardTitle>
              <CardDescription>
                Select an organization to continue.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {organizations.map((org) => (
                <Button
                  key={org.id}
                  variant="outline"
                  className="justify-start"
                  onClick={() => activate(org.id)}
                >
                  <Building2 className="size-4" />
                  {org.name}
                </Button>
              ))}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Create an organization</CardTitle>
            <CardDescription>
              Your CRM data lives inside an organization (a tenant).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="org-name">Organization name</FieldLabel>
                  <Input
                    id="org-name"
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                      setSlug(slugify(event.target.value));
                    }}
                    autoFocus
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="org-slug">Slug</FieldLabel>
                  <Input
                    id="org-slug"
                    value={slug}
                    onChange={(event) => setSlug(slugify(event.target.value))}
                    required
                  />
                  <FieldDescription>
                    A unique identifier used in URLs.
                  </FieldDescription>
                </Field>
                <Field>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Creating…" : "Create workspace"}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
