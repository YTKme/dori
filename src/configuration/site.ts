/**
 * Site Configuration
 */

import {
  Activity,
  Briefcase,
  Building2,
  Contact,
  KanbanSquare,
  LayoutDashboard,
  LifeBuoy,
  Megaphone,
  Package,
  ReceiptText,
  Settings,
  StickyNote,
  Tags,
  Target,
  UserPlus,
} from "lucide-react";

export const siteConfiguration = {
  name: "Dori",
  description: "A self-hostable, multi-tenant CRM.",
};

export type SiteConfiguration = typeof siteConfiguration;

/** Sidebar navigation, grouped by CRM area. */
export const navigation = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", link: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Sales",
    items: [
      { title: "Leads", link: "/lead", icon: UserPlus },
      { title: "Accounts", link: "/account", icon: Building2 },
      { title: "Contacts", link: "/contact", icon: Contact },
      { title: "Opportunities", link: "/opportunity", icon: Target },
      { title: "Pipeline", link: "/pipeline", icon: KanbanSquare },
    ],
  },
  {
    title: "Products",
    items: [
      { title: "Products", link: "/product", icon: Package },
      { title: "Price Books", link: "/price-book", icon: Tags },
      { title: "Quotes", link: "/quote", icon: ReceiptText },
    ],
  },
  {
    title: "Service",
    items: [{ title: "Cases", link: "/case", icon: LifeBuoy }],
  },
  {
    title: "Marketing",
    items: [{ title: "Campaigns", link: "/campaign", icon: Megaphone }],
  },
  {
    title: "Engagement",
    items: [
      { title: "Activities", link: "/activity", icon: Activity },
      { title: "Notes", link: "/note", icon: StickyNote },
    ],
  },
  {
    title: "Workspace",
    items: [
      { title: "Settings", link: "/settings", icon: Settings },
    ],
  },
] as const;

export const brandIcon = Briefcase;
