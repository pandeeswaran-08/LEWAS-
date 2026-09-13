import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  unit,
  hint,
  icon: Icon,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  unit?: string;
  hint?: string;
  icon: LucideIcon;
  tone?: "neutral" | "critical" | "high" | "moderate" | "low";
}) {
  const tones = {
    neutral: "text-primary bg-primary/10",
    critical: "text-risk-critical bg-risk-critical/12",
    high: "text-risk-high bg-risk-high/12",
    moderate: "text-amber-600 bg-risk-moderate/15",
    low: "text-risk-low bg-risk-low/12",
  } as const;

  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold tracking-[0.1em] text-muted-foreground uppercase">
          {label}
        </p>
        <span
          className={cn(
            "flex size-8 items-center justify-center rounded-md",
            tones[tone],
          )}
        >
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground tabular-nums">
        {value}
        {unit && (
          <span className="ml-1 text-base font-medium text-muted-foreground">
            {unit}
          </span>
        )}
      </p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
