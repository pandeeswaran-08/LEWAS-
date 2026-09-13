import * as React from "react";
import { Globe, Check, ChevronDown, Sparkles } from "lucide-react";
import { useI18n, LANGUAGES, type Lang } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface LanguageDropdownProps {
  variant?: "sidebar" | "settings" | "compact" | "header";
  showToast?: boolean;
  className?: string;
}

const LANGUAGE_DETAILS: Record<
  Lang,
  {
    flag: string;
    sublabel: string;
    badge: string;
    region: string;
  }
> = {
  en: {
    flag: "🇬🇧",
    sublabel: "English",
    badge: "EN",
    region: "Global / Default",
  },
  ta: {
    flag: "🇮🇳",
    sublabel: "தமிழ்நாடு (Nilgiris & Valparai)",
    badge: "TA",
    region: "Tamil Nadu",
  },
  ml: {
    flag: "🇮🇳",
    sublabel: "കേരളം (Wayanad & Idukki)",
    badge: "ML",
    region: "Kerala",
  },
  kn: {
    flag: "🇮🇳",
    sublabel: "ಕರ್ನಾಟಕ (Kodagu / Coorg)",
    badge: "KN",
    region: "Karnataka",
  },
};

export function LanguageDropdown({
  variant = "sidebar",
  showToast = false,
  className,
}: LanguageDropdownProps) {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = React.useState(false);

  const fallbackLang = {
    code: "en" as const,
    label: "English",
    nativeLabel: "English",
  };
  const activeLang = LANGUAGES.find((l) => l.code === lang) ?? fallbackLang;
  const activeMeta = LANGUAGE_DETAILS[lang] ?? LANGUAGE_DETAILS.en;

  const handleSelect = (code: Lang) => {
    if (code === lang) return;
    setLang(code);
    const selected = LANGUAGES.find((l) => l.code === code);
    if (showToast && selected) {
      toast.success(t("language"), {
        description: `Locale switched to ${selected.nativeLabel} (${selected.label})`,
      });
    }
  };

  // Compact variant for Floating Decision Widget or Mobile Header
  if (variant === "compact" || variant === "header") {
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger
          className={cn(
            "group inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/80 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-sm transition-all hover:bg-accent hover:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/40 shadow-xs cursor-pointer",
            open && "border-primary/60 bg-accent/80 ring-1 ring-primary/30",
            className
          )}
          aria-label="Select interface language"
        >
          <span className="text-sm leading-none">{activeMeta.flag}</span>
          <span className="text-[11px] font-semibold tracking-wide text-foreground">
            {activeMeta.badge}
          </span>
          <ChevronDown
            className={cn(
              "size-3 text-muted-foreground transition-transform duration-200",
              open && "rotate-180 text-primary"
            )}
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-56 rounded-xl border border-border/70 bg-popover/95 p-1.5 shadow-xl backdrop-blur-md animate-in fade-in-0 zoom-in-95 z-50"
        >
          <div className="px-2 py-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Globe className="size-3 text-primary" />
              {t("selectLanguage")}
            </p>
          </div>
          <DropdownMenuSeparator className="my-1 bg-border/60" />

          {LANGUAGES.map((l) => {
            const meta = LANGUAGE_DETAILS[l.code];
            const isSelected = l.code === lang;

            return (
              <DropdownMenuItem
                key={l.code}
                onClick={() => handleSelect(l.code)}
                className={cn(
                  "group relative flex items-center justify-between rounded-lg px-2.5 py-2 text-xs transition-all cursor-pointer",
                  isSelected
                    ? "bg-primary/10 font-semibold text-primary"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{meta.flag}</span>
                  <div className="flex flex-col text-left">
                    <span className="font-medium text-xs leading-none">
                      {l.nativeLabel}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">
                      {l.label}
                    </span>
                  </div>
                </div>
                {isSelected && (
                  <div className="flex items-center text-primary">
                    <Check className="size-3.5" />
                  </div>
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Settings variant: Clean, simple dropdown with active locale details
  if (variant === "settings") {
    return (
      <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4", className)}>
        <div className="flex items-center gap-3.5">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/25 text-2xl shadow-xs shrink-0">
            {activeMeta.flag}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm text-foreground">{activeLang.nativeLabel}</span>
              <span className="text-xs text-muted-foreground font-medium">({activeLang.label})</span>
              <span className="rounded-md bg-primary/15 border border-primary/25 px-2 py-0.5 text-[10px] font-bold text-primary tracking-wide">
                {activeMeta.badge}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {activeMeta.sublabel} • <span className="text-foreground/80 font-medium">{activeMeta.region}</span>
            </p>
          </div>
        </div>

        <div className="w-full sm:w-72 shrink-0">
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger
              className={cn(
                "w-full flex items-center justify-between rounded-xl border border-border/80 bg-background/90 px-3.5 py-2.5 text-xs font-medium text-foreground shadow-xs transition-all duration-200 hover:bg-accent/70 hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/25 cursor-pointer group",
                open && "border-primary/70 bg-accent ring-2 ring-primary/20"
              )}
              aria-label="Select system language"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-base shrink-0">{activeMeta.flag}</span>
                <span className="font-semibold truncate text-foreground">
                  {activeLang.nativeLabel}
                </span>
                <span className="text-[11px] text-muted-foreground truncate">
                  ({activeLang.label})
                </span>
              </div>
              <ChevronDown
                className={cn(
                  "size-4 text-muted-foreground transition-transform duration-200 shrink-0 ml-2 group-hover:text-foreground",
                  open && "rotate-180 text-primary"
                )}
              />
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={6}
              className="w-72 rounded-xl border border-border/80 bg-popover/98 p-1.5 shadow-2xl backdrop-blur-md z-50 animate-in fade-in-0 zoom-in-95"
            >
              <div className="px-2.5 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Globe className="size-3 text-primary" />
                  {t("selectLanguage")}
                </p>
              </div>
              <DropdownMenuSeparator className="my-1 bg-border/60" />

              {LANGUAGES.map((l) => {
                const meta = LANGUAGE_DETAILS[l.code];
                const isSelected = l.code === lang;

                return (
                  <DropdownMenuItem
                    key={l.code}
                    onClick={() => handleSelect(l.code)}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-2.5 py-2.5 text-xs transition-colors cursor-pointer",
                      isSelected
                        ? "bg-primary/10 text-primary font-semibold"
                        : "hover:bg-accent hover:text-accent-foreground text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xl shrink-0">{meta.flag}</span>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-xs leading-tight">
                          {l.nativeLabel}
                        </span>
                        <span className="text-[10px] text-muted-foreground mt-0.5 truncate">
                          {l.label} • {meta.region}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span
                        className={cn(
                          "rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wider",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {meta.badge}
                      </span>
                      {isSelected && <Check className="size-3.5 text-primary shrink-0" />}
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }

  // Default: Sidebar variant — Sleek modern card trigger with popover menu
  return (
    <div className={cn("w-full", className)}>
      <label
        htmlFor="sidebar-language-dropdown"
        className="flex items-center gap-2 mb-2 text-[11px] font-medium uppercase tracking-wider text-sidebar-foreground/70"
      >
        <Globe className="size-3.5 text-primary/80 shrink-0" />
        <span>{t("language")}</span>
      </label>

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger
          id="sidebar-language-dropdown"
          className={cn(
            "w-full flex items-center justify-between rounded-xl border border-sidebar-border/80 bg-sidebar-accent/40 p-2.5 text-left text-xs font-medium text-sidebar-foreground shadow-xs transition-all duration-200 hover:bg-sidebar-accent hover:border-sidebar-primary/40 focus:outline-none focus:ring-1 focus:ring-sidebar-primary cursor-pointer group",
            open && "border-sidebar-primary/60 bg-sidebar-accent ring-1 ring-sidebar-primary/30"
          )}
          aria-label="Change language"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-lg leading-none shrink-0 drop-shadow-xs">
              {activeMeta.flag}
            </span>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-xs truncate leading-tight text-sidebar-foreground">
                {activeLang.nativeLabel}
              </span>
              <span className="text-[10px] text-sidebar-foreground/60 truncate mt-0.5">
                {activeLang.label} • {activeMeta.region}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            <span className="rounded bg-sidebar-border/70 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-sidebar-foreground/80">
              {activeMeta.badge}
            </span>
            <ChevronDown
              className={cn(
                "size-3.5 text-sidebar-foreground/50 transition-transform duration-200 group-hover:text-sidebar-foreground",
                open && "rotate-180 text-sidebar-primary"
              )}
            />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          side="top"
          sideOffset={8}
          className="w-60 rounded-xl border border-sidebar-border bg-popover/98 p-1.5 shadow-2xl backdrop-blur-lg animate-in fade-in-0 zoom-in-95 z-50"
        >
          <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Globe className="size-3 text-primary" />
              {t("selectLanguage")}
            </span>
            <span className="text-[9px] text-muted-foreground/80 font-normal">
              Western Ghats LEWS
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="my-1 bg-border/50" />

          {LANGUAGES.map((l) => {
            const meta = LANGUAGE_DETAILS[l.code];
            const isSelected = l.code === lang;

            return (
              <DropdownMenuItem
                key={l.code}
                onClick={() => handleSelect(l.code)}
                className={cn(
                  "group relative flex items-center justify-between rounded-lg px-2.5 py-2.5 text-xs transition-all cursor-pointer",
                  isSelected
                    ? "bg-primary/10 font-semibold text-primary"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xl leading-none">{meta.flag}</span>
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-xs leading-none">
                      {l.nativeLabel}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-1 truncate">
                      {l.label} • {meta.sublabel}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wider",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {meta.badge}
                  </span>
                  {isSelected && <Check className="size-4 text-primary" />}
                </div>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
