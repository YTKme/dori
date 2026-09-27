/**
 * Root
 */

/// <reference types="vite/client" />

import type { ReactNode } from "react";

import { TanStackDevtools } from "@tanstack/react-devtools";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import { Toaster } from "~/_shadcn/component/interface/sonner";
import { siteConfiguration } from "~/configuration/site";
import { ThemeProvider } from "~/context/theme";

import "../res/css/global.css";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: siteConfiguration.name },
      { name: "description", content: siteConfiguration.description },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function ProviderComponent({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="dori-theme">
      {children}
      <Toaster position="top-center" richColors />
    </ThemeProvider>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ProviderComponent>{children}</ProviderComponent>
        {import.meta.env.DEV && (
          <TanStackDevtools
            config={{ position: "bottom-right" }}
            plugins={[
              {
                name: "TanStack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        )}
        <Scripts />
      </body>
    </html>
  );
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-2">
      <h1 className="text-2xl font-semibold">404</h1>
      <p className="text-muted-foreground">Page not found.</p>
    </div>
  );
}
