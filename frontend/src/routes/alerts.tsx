import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Clock,
  Copy,
  MessageSquare,
  Phone,
  Radio,
  Route as RouteIcon,
  Smartphone,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/PageHeader";
import { RiskBadge } from "@/components/RiskBadge";
import { alerts, DISTRICTS } from "@/data/mockData";
import { useI18n, type TranslationKey } from "@/lib/i18n";
import type { Alert, District, RiskLevel } from "@/types";

export const Route = createFileRoute("/alerts")({
  validateSearch: (search: Record<string, unknown>) => ({
    alert: typeof search["alert"] === "string" ? search["alert"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Early Warning & Alert Broadcast | Western Ghats EWS" },
      {
        name: "description",
        content:
          "Filter landslide warnings by district and severity, review incident details and copy ready-to-send bilingual SMS and WhatsApp broadcasts.",
      },
      {
        property: "og:title",
        content: "Landslide Early Warning & Broadcast Desk",
      },
      {
        property: "og:description",
        content:
          "District-wise landslide alerts with affected villages, emergency lines and pre-drafted broadcast messages.",
      },
    ],
  }),
  component: AlertsPage,
});

const SEVERITIES: (RiskLevel | "All")[] = [
  "All",
  "Critical",
  "High",
  "Moderate",
  "Low",
];

function AlertsPage() {
  const { t } = useI18n();
  const { alert: alertParam } = Route.useSearch();
  const [district, setDistrict] = useState<District | "All">("All");
  const [severity, setSeverity] = useState<RiskLevel | "All">("All");
  const [selectedId, setSelectedId] = useState<string>(
    alertParam ?? alerts[0]!.id,
  );

  const filtered = useMemo(() =>
    alerts.filter(
      (a) =>
        (district === "All" || a.district === district) &&
        (severity === "All" || a.severity === severity),
    ),
    [district, severity],
  );

  const selected =
    filtered.find((a) => a.id === selectedId) ??
    filtered[0] ??
    alerts.find((a) => a.id === selectedId)!;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        eyebrow={t("warningDesk")}
        title={t("earlyWarning")}
        description={t("alertsDescription")}
      />

      <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          {t("district")}
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value as District | "All")}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
          >
            <option value="All">{t("allDistricts")}</option>
            {DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
        <div className="flex flex-wrap gap-1.5">
          {SEVERITIES.map((s) => (
            <button
              key={s}
              onClick={() => setSeverity(s)}
              className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
                severity === s
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:bg-accent"
              }`}
            >
              {s === "All" ? t("allRiskLevels") : t(s.toLowerCase() as TranslationKey)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <ul className="space-y-3 lg:col-span-2">
          {filtered.map((a) => (
            <li key={a.id}>
              <button
                onClick={() => setSelectedId(a.id)}
                className={`w-full rounded-lg border bg-card p-4 text-left shadow-sm transition-colors hover:border-primary/50 ${
                  selected?.id === a.id ? "border-primary" : "border-border"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <RiskBadge level={a.severity} />
                  <span className="text-xs font-mono text-muted-foreground">
                    {a.id}
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold">{a.location}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {a.headline}
                </p>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="size-3" /> {a.issuedAt} · {a.status}
                </p>
              </button>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              {t("noAlertsMatch")}
            </li>
          )}
        </ul>

        <div className="lg:col-span-3">
          {selected && <AlertDetail alert={selected} />}
        </div>
      </div>
    </div>
  );
}

function AlertDetail({ alert }: { alert: Alert }) {
  const { t, lang } = useI18n();

  async function copy(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`, {
        description: "Paste into the broadcast console to dispatch.",
      });
    } catch {
      toast.error("Could not access the clipboard", {
        description: "Select the text manually and copy it.",
      });
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <RiskBadge level={alert.severity} />
            <span className="text-xs text-muted-foreground">
              {alert.id} · issued {alert.issuedAt} · {alert.status}
            </span>
          </div>
          <h2 className="mt-2 text-lg font-semibold text-foreground">
            {alert.location}
          </h2>
          <p className="text-sm font-medium text-foreground/80">
            {alert.headline}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{alert.details}</p>
        </div>

        <div className="grid gap-5 px-5 py-5 sm:grid-cols-2">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              <Users className="size-3.5" /> {t("affectedVillages")}
            </p>
            <ul className="mt-2 space-y-1 text-sm">
              {alert.affectedVillages.map((v) => (
                <li key={v}>• {v}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              <RouteIcon className="size-3.5" /> {t("roadsAtRisk")}
            </p>
            <ul className="mt-2 space-y-1 text-sm">
              {alert.roadsAtRisk.map((r) => (
                <li key={r}>• {r}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border px-5 py-5">
          <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            <Phone className="size-3.5" /> {t("emergencyLines")}
          </p>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {alert.contacts.map((c) => (
              <li
                key={c.number}
                className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm"
              >
                <span className="text-xs text-muted-foreground">{c.label}</span>
                <a
                  href={`tel:${c.number}`}
                  className="font-semibold text-primary hover:underline"
                >
                  {c.number}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card shadow-sm">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <Radio className="size-4 text-primary" />
          <div>
            <h3 className="text-sm font-semibold">{t("readyBroadcasts")}</h3>
            <p className="text-xs text-muted-foreground">
              {t("broadcastDesc")}
            </p>
          </div>
        </div>

        <div className="space-y-4 px-5 py-5">
          <MessageBlock
            icon={Smartphone}
            title="SMS — English (160-char gateway)"
            body={alert.smsEn}
            onCopy={() => copy(alert.smsEn, "English SMS")}
          />
          {alert.smsKn && (
            <MessageBlock
              icon={Smartphone}
              title="SMS — ಕನ್ನಡ (Karnataka Gateway / Kodagu)"
              body={alert.smsKn}
              onCopy={() => copy(alert.smsKn, "Kannada SMS")}
            />
          )}
          {alert.smsTa && (
            <MessageBlock
              icon={Smartphone}
              title="SMS — தமிழ் (Tamil Nadu Gateway / Nilgiris)"
              body={alert.smsTa}
              onCopy={() => copy(alert.smsTa, "Tamil SMS")}
            />
          )}
          {alert.smsMl && (
            <MessageBlock
              icon={Smartphone}
              title="SMS — മലയാളം (Kerala Gateway / Wayanad & Idukki)"
              body={alert.smsMl}
              onCopy={() => copy(alert.smsMl, "Malayalam SMS")}
            />
          )}
          <MessageBlock
            icon={MessageSquare}
            title="WhatsApp — formatted broadcast"
            body={alert.whatsapp}
            onCopy={() => copy(alert.whatsapp, "WhatsApp broadcast")}
          />
        </div>
      </section>
    </div>
  );
}

function MessageBlock({
  icon: Icon,
  title,
  body,
  onCopy,
}: {
  icon: typeof Smartphone;
  title: string;
  body: string;
  onCopy: () => void;
}) {
  const { t } = useI18n();

  return (
    <div className="rounded-md border border-border bg-muted/30">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
        <p className="flex items-center gap-1.5 text-xs font-semibold">
          <Icon className="size-3.5 text-primary" />
          {title}
          <span className="ml-1 font-normal text-muted-foreground">
            {body.length} {t("chars")}
          </span>
        </p>
        <button
          onClick={onCopy}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <Copy className="size-3.5" />
          {t("copyMessage")}
        </button>
      </div>
      <pre className="max-h-56 overflow-auto px-4 py-3 text-xs leading-relaxed whitespace-pre-wrap text-foreground/90">
        {body}
      </pre>
    </div>
  );
}
