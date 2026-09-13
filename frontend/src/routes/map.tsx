import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense, useMemo, useState } from "react";
import { CloudRain, Mountain, Route as RouteIcon, Search, Users } from "lucide-react";

import { PageHeader } from "@/components/PageHeader";
import { RISK_HEX, RiskBadge } from "@/components/RiskBadge";
import { hotspots } from "@/data/mockData";
import { useI18n, type TranslationKey } from "@/lib/i18n";
import type { Hotspot, RiskLevel } from "@/types";

const RiskMap = lazy(() => import("@/components/RiskMap"));

const LEVELS: (RiskLevel | "All")[] = [
  "All",
  "Critical",
  "High",
  "Moderate",
  "Low",
];

export const Route = createFileRoute("/map")({
  validateSearch: (search: Record<string, unknown>) => ({
    hotspot:
      typeof search["hotspot"] === "string" ? search["hotspot"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Live Risk Map | Western Ghats Hyperlocal EWS" },
      {
        name: "description",
        content:
          "Interactive landslide risk map of Western Ghats hotspots across Wayanad, Idukki and the Nilgiris with elevation, slope and rainfall detail.",
      },
      { property: "og:title", content: "Live Landslide Risk Map — Western Ghats" },
      {
        property: "og:description",
        content:
          "Colour-coded landslide risk markers with village-level detail for Western Ghats hill districts.",
      },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const { t } = useI18n();
  const { hotspot: hotspotParam } = Route.useSearch();
  const [level, setLevel] = useState<RiskLevel | "All">("All");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(
    hotspotParam ?? hotspots[0]!.id,
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return hotspots.filter((h) => {
      const matchesLevel = level === "All" || h.risk === level;
      const matchesQuery =
        !q ||
        h.name.toLowerCase().includes(q) ||
        h.district.toLowerCase().includes(q) ||
        h.villages.some((v) => v.toLowerCase().includes(q)) ||
        h.criticalRoads.some((r) => r.toLowerCase().includes(q));
      return matchesLevel && matchesQuery;
    });
  }, [level, query]);

  const selected =
    filtered.find((h) => h.id === selectedId) ??
    hotspots.find((h) => h.id === selectedId) ??
    null;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        eyebrow={t("geospatialMonitoring")}
        title={t("liveRiskMap")}
        description={t("mapDescription")}
      />

      <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchHotspotsPlaceholder")}
            className="w-full rounded-md border border-input bg-background py-2 pr-3 pl-9 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
                level === l
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:bg-accent"
              }`}
            >
              {l !== "All" && (
                <span
                  className="mr-1.5 inline-block size-1.5 rounded-full align-middle"
                  style={{ backgroundColor: RISK_HEX[l as RiskLevel] }}
                />
              )}
              {l === "All" ? t("allRiskLevels") : t(l.toLowerCase() as TranslationKey)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm lg:col-span-2">
          <div className="h-[520px] w-full">
            <ClientOnly
              fallback={
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  Loading terrain map…
                </div>
              }
            >
              <Suspense
                fallback={
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    Loading terrain map…
                  </div>
                }
              >
                <RiskMap
                  hotspots={filtered}
                  selected={selected}
                  onSelect={(h) => setSelectedId(h.id)}
                />
              </Suspense>
            </ClientOnly>
          </div>
          <div className="flex flex-wrap items-center gap-4 border-t border-border px-4 py-3 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{t("legend")}</span>
            {(["Low", "Moderate", "High", "Critical"] as RiskLevel[]).map(
              (l) => (
                <span key={l} className="flex items-center gap-1.5">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: RISK_HEX[l] }}
                  />
                  {t(l.toLowerCase() as TranslationKey)}
                </span>
              ),
            )}
            <span className="flex items-center gap-1.5 border-l border-border pl-3 text-amber-600 font-medium">
              <span className="size-2.5 rounded-sm border border-amber-600 bg-amber-600/30" />
              Sentinel-1/2 Change Scars
            </span>
            <span className="ml-auto">
              {filtered.length} of {hotspots.length} {t("hotspotsShown")}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {selected ? <DetailPanel hotspot={selected} /> : null}

          <div className="rounded-lg border border-border bg-card shadow-sm">
            <p className="border-b border-border px-4 py-3 text-sm font-semibold">
              {t("monitoredHotspots")}
            </p>
            <ul className="max-h-72 divide-y divide-border overflow-y-auto">
              {filtered.map((h) => (
                <li key={h.id}>
                  <button
                    onClick={() => setSelectedId(h.id)}
                    className={`flex w-full items-center justify-between gap-2 px-4 py-3 text-left hover:bg-accent ${
                      selected?.id === h.id ? "bg-accent" : ""
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">
                        {h.name}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {h.district} · {h.probability}%
                      </span>
                    </span>
                    <RiskBadge level={h.risk} />
                  </button>
                </li>
              ))}
              {filtered.length === 0 && (
                <li className="px-4 py-6 text-center text-sm text-muted-foreground">
                  {t("noHotspotsMatch")}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailPanel({ hotspot }: { hotspot: Hotspot }) {
  const { t } = useI18n();

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      <div className="border-b border-border px-4 py-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              {hotspot.name}
            </h2>
            <p className="text-xs text-muted-foreground">
              {hotspot.district} district, {hotspot.state} · {hotspot.id}
            </p>
          </div>
          <RiskBadge level={hotspot.risk} />
        </div>
        <p className="mt-3 text-sm">
          <span className="text-2xl font-semibold tabular-nums">
            {hotspot.probability}%
          </span>{" "}
          <span className="text-xs text-muted-foreground">
            {t("modelledFailureProbability")}
          </span>
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-px bg-border">
        <Stat icon={Mountain} label={t("elevation")} value={`${hotspot.elevation} m`} />
        <Stat icon={Mountain} label={t("slope")} value={`${hotspot.slope}°`} />
        <Stat
          icon={CloudRain}
          label={t("rainfall3d")}
          value={`${hotspot.rainfall3d} mm`}
        />
        <Stat
          icon={CloudRain}
          label={t("rainfall7d")}
          value={`${hotspot.rainfall7d} mm`}
        />
        <Stat
          icon={CloudRain}
          label={t("soilMoisture")}
          value={`${hotspot.soilMoisture}%`}
        />
        <Stat
          icon={Users}
          label={t("population")}
          value={hotspot.population.toLocaleString("en-IN")}
        />
      </dl>

      <div className="space-y-3 px-4 py-4">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            <RouteIcon className="size-3.5" /> {t("criticalRoads")}
          </p>
          <ul className="mt-1.5 space-y-1">
            {hotspot.criticalRoads.map((r) => (
              <li key={r} className="text-sm text-foreground">
                • {r}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {t("villagesInZone")}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {hotspot.villages.map((v) => (
              <span
                key={v}
                className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium"
              >
                {v}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mountain;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-card px-4 py-3">
      <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </dt>
      <dd className="mt-0.5 text-sm font-semibold tabular-nums text-foreground">
        {value}
      </dd>
    </div>
  );
}
