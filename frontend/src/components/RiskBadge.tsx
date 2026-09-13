import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/types";
import { useI18n, type TranslationKey } from "@/lib/i18n";

export const RISK_HEX: Record<RiskLevel, string> = {
  Low: "#16a34a",
  Moderate: "#eab308",
  High: "#ea580c",
  Critical: "#dc2626",
};

const STYLES: Record<RiskLevel, string> = {
  Low: "bg-risk-low/12 text-risk-low border-risk-low/30",
  Moderate: "bg-risk-moderate/15 text-amber-700 border-risk-moderate/40",
  High: "bg-risk-high/12 text-risk-high border-risk-high/30",
  Critical: "bg-risk-critical/12 text-risk-critical border-risk-critical/30",
};

export function RiskBadge({
  level,
  className,
}: {
  level: RiskLevel;
  className?: string;
}) {
  const { t } = useI18n();
  const key = level.toLowerCase() as TranslationKey;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase",
        STYLES[level],
        className,
      )}
    >
      <span
        className="size-1.5 rounded-full"
        style={{ backgroundColor: RISK_HEX[level] }}
      />
      {t(key) || level}
    </span>
  );
}
