import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  BrainCircuit,
  LayoutDashboard,
  Map as MapIcon,
  Settings,
  ShieldAlert,
  ShieldCheck,
  X,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LanguageDropdown } from "@/components/LanguageDropdown";

export function AppSidebar({ onClose }: { onClose?: () => void }) {
  const { t } = useI18n();

  const NAV = [
    { to: "/lewas",      label: "LEWAS",           icon: ShieldCheck },
    { to: "/",           label: t("dashboard"),    icon: LayoutDashboard },
    { to: "/map",        label: t("liveRiskMap"),  icon: MapIcon },
    { to: "/prediction", label: t("aiPrediction"), icon: BrainCircuit },
    { to: "/alerts",     label: t("earlyWarning"), icon: AlertTriangle },
    { to: "/settings",   label: t("settings"),     icon: Settings },
  ] as const;

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {/* ── Brand header with Official LEWS Logo ── */}
      <div className="flex items-center justify-between border-b border-sidebar-border px-4 py-3.5">
        <Link to="/" className="flex items-center gap-3 min-w-0 flex-1 group">
          <div className="relative flex size-10 shrink-0 items-center justify-center rounded-xl bg-card p-0.5 border border-sidebar-border shadow-xs transition-transform group-hover:scale-105">
            <img
              src="/logo.png"
              alt="Western Ghats LEWS Logo"
              className="size-full object-contain rounded-lg"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm leading-tight font-bold tracking-tight text-sidebar-foreground group-hover:text-primary transition-colors">
              {t("systemBrand")}
            </p>
            <p className="text-[11px] leading-tight text-sidebar-foreground/60 truncate mt-0.5">
              {t("systemSubtitle")}
            </p>
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="rounded p-1 text-sidebar-foreground/70 hover:bg-sidebar-accent lg:hidden cursor-pointer"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* ── Nav links ── */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            onClick={onClose}
            activeOptions={{ exact: to === "/" }}
            activeProps={{
              className:
                "bg-sidebar-accent text-sidebar-accent-foreground border-l-sidebar-primary",
            }}
            inactiveProps={{
              className:
                "text-sidebar-foreground/70 border-l-transparent hover:bg-sidebar-accent/60",
            }}
            className="flex items-center gap-3 rounded-r-md border-l-2 px-3 py-2.5 text-sm font-medium transition-colors"
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* ── Enhanced Language Dropdown Switcher ── */}
      <div className="border-t border-sidebar-border px-4 py-3">
        <LanguageDropdown variant="sidebar" />
      </div>

      {/* ── Footer ── */}
      <div className="border-t border-sidebar-border px-5 py-4 text-xs text-sidebar-foreground/50">
        <p className="font-medium text-sidebar-foreground/70">
          {t("prototypeBuild")}
        </p>
        <p className="mt-1">{t("mockTelemetry")}</p>
      </div>
    </div>
  );
}
