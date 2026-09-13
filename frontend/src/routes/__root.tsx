import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Menu } from "lucide-react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { LanguageProvider } from "../lib/i18n";
import { AppSidebar } from "@/components/AppSidebar";
import { LanguageDropdown } from "@/components/LanguageDropdown";
import { Toaster } from "@/components/ui/sonner";
import { DecisionAgentWidget } from "@/components/DecisionAgentWidget";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Western Ghats LEWS — Landslide Early Warning System" },
      {
        name: "description",
        content:
          "Western Ghats Multi-Agent Landslide Early Warning System covering Wayanad, Idukki, Nilgiris, and Kodagu.",
      },
      { property: "og:title", content: "Western Ghats LEWS — Landslide Early Warning System" },
      {
        property: "og:description",
        content:
          "Multi-Agent AI and geospatial early warning platform for landslide disaster mitigation.",
      },
      { property: "og:image", content: "/logo.png" },
      { property: "og:type", content: "website" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/logo.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/logo.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <div className="flex min-h-screen bg-background">
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="fixed inset-y-0 left-0 w-64">
              <AppSidebar />
            </div>
          </aside>

          {mobileNavOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setMobileNavOpen(false)}
              />
              <div className="absolute inset-y-0 left-0 w-72">
                <AppSidebar onClose={() => setMobileNavOpen(false)} />
              </div>
            </div>
          )}

          <div className="flex min-w-0 flex-1 flex-col">
            <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:hidden">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileNavOpen(true)}
                  aria-label="Open navigation"
                  className="rounded-md border border-border p-2 cursor-pointer hover:bg-accent"
                >
                  <Menu className="size-4" />
                </button>
                <div className="flex items-center gap-2.5">
                  <img
                    src="/logo.png"
                    alt="Western Ghats LEWS Logo"
                    className="size-7 object-contain rounded-md"
                  />
                  <span className="text-sm font-bold tracking-tight">Western Ghats EWS</span>
                </div>
              </div>
              <LanguageDropdown variant="compact" />
            </header>
            {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
            <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
              <Outlet />
            </main>
          </div>
        </div>
        <DecisionAgentWidget />
        <Toaster position="top-right" richColors />
      </QueryClientProvider>
    </LanguageProvider>
  );
}
