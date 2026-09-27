import { Link } from "@tanstack/react-router";
import { Building2, ChevronsUpDown, Plus } from "lucide-react";

import { authClient } from "~/_betterauth/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/_shadcn/component/interface/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/_shadcn/component/interface/sidebar";

export function OrgSwitcher() {
  const { isMobile } = useSidebar();
  const active = authClient.useActiveOrganization();
  const list = authClient.useListOrganizations();
  const activeOrg = active.data;
  const organizations = list.data ?? [];

  async function select(id: string) {
    if (id === activeOrg?.id) return;
    await authClient.organization.setActive({ organizationId: id });
    window.location.reload();
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />
            }
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Building2 className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {activeOrg?.name ?? "Select organization"}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                Workspace
              </span>
            </div>
            <ChevronsUpDown className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Organizations
            </DropdownMenuLabel>
            {organizations.map((org) => (
              <DropdownMenuItem
                key={org.id}
                onClick={() => select(org.id)}
                className="cursor-pointer gap-2"
              >
                <Building2 className="size-4" />
                <span className="truncate">{org.name}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              render={<Link to="/onboarding" />}
              className="cursor-pointer gap-2"
            >
              <Plus className="size-4" /> Create organization
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
