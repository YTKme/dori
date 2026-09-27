import { createFileRoute, Link } from "@tanstack/react-router";

import { brandIcon as BrandIcon, siteConfiguration } from "~/configuration/site";
import { RegisterForm } from "~/component/register-form";

export const Route = createFileRoute("/register")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          to="/login"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <BrandIcon className="size-4" />
          </div>
          {siteConfiguration.name}
        </Link>
        <RegisterForm />
      </div>
    </div>
  );
}
