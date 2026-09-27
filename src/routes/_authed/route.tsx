/**
 * Authenticated Layout
 *
 * Requires a session and an active organization (tenant). Without a
 * session the user is sent to /login; with a session but no active
 * organization, to /onboarding.
 */

import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { Separator } from "~/_shadcn/component/interface/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/_shadcn/component/interface/sidebar";
import { AppSidebar } from "~/component/app-sidebar";
import { ThemeToggle } from "~/component/theme-toggle";
import { getCurrentSessionFn } from "~/server/authentication/session";

export const Route = createFileRoute("/_authed")({
  beforeLoad: async () => {
    const auth = await getCurrentSessionFn();
    if (!auth) {
      throw redirect({ to: "/login" });
    }
    const activeOrganizationId = (
      auth.session as { activeOrganizationId?: string | null }
    ).activeOrganizationId;
    if (!activeOrganizationId) {
      throw redirect({ to: "/onboarding" });
    }
    return { auth };
  },
  component: AuthedLayout,
});

function AuthedLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
