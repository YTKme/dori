import {
  createFileRoute,
  Link,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";

import { cn } from "~/_shadcn/library/utility";

const items = [
  { to: "/settings/stage", label: "Pipeline Stages" },
  { to: "/settings/member", label: "Members" },
  { to: "/settings/token", label: "API Tokens" },
] as const;

export const Route = createFileRoute("/_authed/settings")({
  component: SettingsLayout,
});

function SettingsLayout() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <div className="flex flex-col gap-6 md:flex-row">
        <nav className="flex shrink-0 gap-1 md:w-52 md:flex-col">
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "rounded-md px-3 py-2 text-sm transition-colors",
                pathname === item.to
                  ? "bg-muted font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
