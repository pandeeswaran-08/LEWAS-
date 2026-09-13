import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  CloudRain,
  Gauge,
  Mountain,
  ShieldAlert,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { MetricCard } from "@/components/MetricCard";
import { PageHeader } from "@/components/PageHeader";
import { RiskBadge } from "@/components/RiskBadge";
import { alerts, DISTRICTS, hotspots, rainfallTrend } from "@/data/mockData";
import { classifyRisk, runPrediction } from "@/utils/prediction";
import { useI18n } from "@/lib/i18n";
import type { District, PredictionResult } from "@/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Landslide Risk Dashboard | Western Ghats Hyperlocal EWS" },
      {
        name: "description",
        content:
          "Live landslide risk overview for Wayanad, Idukki and the Nilgiris: critical alerts, high-risk zones, active warnings and model confidence.",
      },
      {
        property: "og:title",
        content: "Landslide Risk Dashboard | Western Ghats Hyperlocal EWS",
      },
      {
        property: "og:description",
        content:
          "Hyperlocal landslide early warning dashboard for Western Ghats hotspots with AI risk prediction.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { t, lang, tDistrict, tAlertHeadline, tAlertLocation } = useI18n();
  const criticalAlerts = alerts.filter((a) => a.severity === "Critical").length;
  const highRiskZones = hotspots.filter(
    (h) => h.risk === "High" || h.risk === "Critical",
  ).length;
  const activeWarnings = alerts.filter((a) => a.status === "Active").length;
  const avgConfidence = Math.round(
    alerts.reduce((s, a) => s + a.confidence, 0) / alerts.length,
  );

  const dateStr =
    lang === "ta"
      ? "12 செப்டம்பர் 2026, 06:10 IST"
      : lang === "ml"
        ? "12 സെപ്റ്റംബർ 2026, 06:10 IST"
        : lang === "kn"
          ? "12 ಸೆಪ್ಟೆಂಬರ್ 2026, 06:10 IST"
          : "12 Sep 2026, 06:10 IST";

  const highRiskHint =
    lang === "ta"
      ? `மொத்த ${hotspots.length} கண்காணிக்கப்படும் வலயங்களில்`
      : lang === "ml"
        ? `ആകെ ${hotspots.length} നിരീക്ഷണ കേന്ദ്രങ്ങളിൽ`
        : lang === "kn"
          ? `ಒಟ್ಟು ${hotspots.length} ವೀಕ್ಷಿಸಲಾದ ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳಲ್ಲಿ`
          : `of ${hotspots.length} ${t("highRiskZonesHint")}`;

  const localizedRainfallTrend = useMemo(() => {
    const monthMap: Record<string, Record<string, string>> = {
      Sep: { en: "Sep", ta: "செப்", ml: "സെപ്റ്റം", kn: "ಸೆಪ್ಟೆಂ" },
    };
    return rainfallTrend.map((item) => {
      const parts = item.day.split(" ");
      const m = parts[0] || "Sep";
      const d = parts[1] || "";
      const localizedMonth = monthMap[m]?.[lang] || m;
      return {
        ...item,
        localizedDay: `${localizedMonth} ${d}`,
      };
    });
  }, [lang]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        eyebrow={`${t("situationOverview")} · ${dateStr}`}
        title={t("dashboard")}
        description={t("dashboardDescription")}
        actions={
          <Link
            to="/alerts"
            search={{ alert: undefined }}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <AlertTriangle className="size-4" />
            {t("reviewWarnings")}
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label={t("criticalAlerts")}
          value={criticalAlerts}
          icon={ShieldAlert}
          tone="critical"
          hint={t("criticalAlertsHint")}
        />
        <MetricCard
          label={t("highRiskZones")}
          value={highRiskZones}
          icon={Mountain}
          tone="high"
          hint={highRiskHint}
        />
        <MetricCard
          label={t("activeWarnings")}
          value={activeWarnings}
          icon={Activity}
          tone="moderate"
          hint={t("activeWarningsHint")}
        />
        <MetricCard
          label={t("avgConfidence")}
          value={avgConfidence}
          unit="%"
          icon={Gauge}
          tone="low"
          hint={t("avgConfidenceHint")}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-lg border border-border bg-card shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                {t("recentAlerts")}
              </h2>
              <p className="text-xs text-muted-foreground">
                {t("recentAlertsDesc")}
              </p>
            </div>
            <Link
              to="/alerts"
              search={{ alert: undefined }}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              {t("viewAll")} <ArrowRight className="size-3" />
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {alerts.slice(0, 5).map((alert) => (
              <li key={alert.id} className="px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <RiskBadge level={alert.severity} />
                      <span className="text-xs font-mono text-muted-foreground">
                        {alert.id}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm font-semibold text-foreground">
                      {tAlertLocation(alert.id, alert.location)}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {tAlertHeadline(alert.id, alert.headline)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {alert.issuedAt} · {tDistrict(alert.district)} · {t("modelConfidence")}{" "}
                      {alert.confidence}%
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Link
                      to="/alerts"
                      search={{ alert: alert.id }}
                      className="rounded-md border border-border px-2.5 py-1.5 text-xs font-medium hover:bg-accent"
                    >
                      {t("details")}
                    </Link>
                    <Link
                      to="/map"
                      search={{ hotspot: alert.hotspotId }}
                      className="rounded-md border border-border px-2.5 py-1.5 text-xs font-medium hover:bg-accent"
                    >
                      {t("locate")}
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <QuickPrediction />
      </div>

      <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <CloudRain className="size-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">
              {t("rainfallTrendTitle")}
            </h2>
          </div>
          <p className="text-xs text-muted-foreground">
            {t("rainfallTrendSubtitle")}
          </p>
        </div>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={localizedRainfallTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
              <XAxis dataKey="localizedDay" fontSize={12} stroke="currentColor" />
              <YAxis fontSize={12} stroke="currentColor" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="wayanad"
                name={tDistrict("Wayanad")}
                stroke="#dc2626"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="idukki"
                name={tDistrict("Idukki")}
                stroke="#ea580c"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="nilgiris"
                name={tDistrict("Nilgiris")}
                stroke="#2563eb"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="kodagu"
                name={tDistrict("Kodagu")}
                stroke="#10b981"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

function QuickPrediction() {
  const { t, lang, tDistrict, tFactor, tHotspotName } = useI18n();
  const [district, setDistrict] = useState<District>("Wayanad");
  const [rain3, setRain3] = useState(240);
  const [rain7, setRain7] = useState(420);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const reference = useMemo(
    () => hotspots.find((h) => h.district === district)!,
    [district],
  );

  function predict() {
    setResult(
      runPrediction({
        district,
        slope: reference.slope,
        elevation: reference.elevation,
        distanceToRoad: 220,
        rainfall3d: rain3,
        rainfall7d: rain7,
      }),
    );
  }

  const thresholdText = useMemo(() => {
    const riskLevel = classifyRisk(Math.min(99, Math.round(rain3 / 4)));
    const localizedRisk = t(riskLevel.toLowerCase() as any);
    if (lang === "ta") {
      return `வரம்பு குறிப்பு: ${rain3} மி.மீ / 3 நாள் மழையின் அடிப்படையில் மட்டும் ${localizedRisk} அபாயமாக வகைப்படுத்தப்படுகிறது.`;
    }
    if (lang === "ml") {
      return `പരിധി റഫറൻസ്: ${rain3} മി.മീ / 3 ദിവസത്തെ മഴ മാത്രം അടിസ്ഥാനമാക്കി ${localizedRisk} അപകടമായി വർഗ്ഗീകരിക്കുന്നു.`;
    }
    if (lang === "kn") {
      return `ಮಿತಿ ಉಲ್ಲೇಖ: ${rain3} ಮಿ.ಮೀ / ೩ ದಿನಗಳ ಮಳೆಯು ಪ್ರತ್ಯೇಕವಾಗಿ ${localizedRisk} ಅಪಾಯವೆಂದು ವರ್ಗೀಕರಿಸುತ್ತದೆ.`;
    }
    return `Threshold reference: ${rain3} mm / 3 days classifies as ${localizedRisk} on rainfall alone.`;
  }, [rain3, lang, t]);

  return (
    <section className="rounded-lg border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <BrainCircuit className="size-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">
            {t("quickAIPrediction")}
          </h2>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {t("quickPredictionDesc")}
        </p>
      </div>

      <div className="space-y-4 px-5 py-4">
        <Field label={t("district")}>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value as District)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {tDistrict(d)}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t("rainfall3d")}>
          <input
            type="number"
            value={rain3}
            onChange={(e) => setRain3(Number(e.target.value))}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm tabular-nums"
          >
          </input>
        </Field>
        <Field label={t("rainfall7d")}>
          <input
            type="number"
            value={rain7}
            onChange={(e) => setRain7(Number(e.target.value))}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm tabular-nums"
          >
          </input>
        </Field>

        <button
          onClick={predict}
          className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 cursor-pointer"
        >
          {t("predictRisk")}
        </button>

        {result && (
          <div className="rounded-md border border-border bg-muted/40 p-4">
            <div className="flex items-baseline justify-between">
              <p className="text-3xl font-semibold tabular-nums text-foreground">
                {result.probability}%
              </p>
              <RiskBadge level={result.riskClass} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("modelConfidence")} {result.confidence}% · {t("terrain")}{" "}
              {reference.slope}° / {reference.elevation} m ({tHotspotName(reference.name)})
            </p>
            <p className="mt-2 text-xs text-foreground/80">
              {t("dominantFactor")}: {tFactor(result.factors[0]!.factor)} (
              {result.factors[0]!.contribution}%)
            </p>
            <Link
              to="/prediction"
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              {t("openFullReport")} <ArrowRight className="size-3" />
            </Link>
          </div>
        )}

        {!result && (
          <p className="text-xs text-muted-foreground">
            {thresholdText}
          </p>
        )}
      </div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
