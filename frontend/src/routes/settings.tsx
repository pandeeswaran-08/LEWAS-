import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  BatteryLow,
  Globe,
  RadioTower,
  RotateCcw,
  Save,
  SlidersHorizontal,
  Sparkles,
  Wifi,
  WifiOff,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/PageHeader";
import { sensorNodes } from "@/data/mockData";
import { THRESHOLDS } from "@/utils/prediction";
import { useI18n } from "@/lib/i18n";
import { LanguageDropdown } from "@/components/LanguageDropdown";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "System Settings & Thresholds | Western Ghats EWS" },
      {
        name: "description",
        content:
          "System information, telemetry health, sensor battery status and configurable rainfall and slope hazard thresholds for the landslide warning system.",
      },
      {
        property: "og:title",
        content: "System Settings & Risk Thresholds — Western Ghats EWS",
      },
      {
        property: "og:description",
        content:
          "Tune rainfall triggers and slope hazard cutoffs and review sensor telemetry health.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { t, lang } = useI18n();
  const [rain3, setRain3] = useState<number>(THRESHOLDS.rainfall3d);
  const [rain7, setRain7] = useState<number>(THRESHOLDS.rainfall7d);
  const [slopeWatch, setSlopeWatch] = useState(22);
  const [slopeHazard, setSlopeHazard] = useState<number>(THRESHOLDS.slope);
  const [confidenceGate, setConfidenceGate] = useState(80);
  const [sensorFilter, setSensorFilter] = useState<"all" | "online" | "attention">("all");

  const online = sensorNodes.filter((n) => n.status === "Online").length;
  const lowBattery = sensorNodes.filter((n) => n.battery < 40).length;
  const degradedOrOffline = sensorNodes.filter((n) => n.status !== "Online").length;

  const filteredNodes = sensorNodes.filter((n) => {
    if (sensorFilter === "online") return n.status === "Online";
    if (sensorFilter === "attention") return n.status !== "Online" || n.battery < 40;
    return true;
  });

  const applyPreset = (preset: "monsoon" | "imd" | "sensitive") => {
    if (preset === "monsoon") {
      setRain3(200);
      setRain7(380);
      setSlopeWatch(20);
      setSlopeHazard(28);
      setConfidenceGate(75);
      toast.info("Applied Monsoon Severe Preset", {
        description: "Lowered thresholds for aggressive early warnings during active monsoon spells.",
      });
    } else if (preset === "sensitive") {
      setRain3(160);
      setRain7(320);
      setSlopeWatch(18);
      setSlopeHazard(25);
      setConfidenceGate(70);
      toast.info("Applied High Sensitivity Preset", {
        description: "Maximized watch triggers for continuous micro-slip detection.",
      });
    } else {
      setRain3(THRESHOLDS.rainfall3d);
      setRain7(THRESHOLDS.rainfall7d);
      setSlopeWatch(22);
      setSlopeHazard(THRESHOLDS.slope);
      setConfidenceGate(80);
      toast.info("Restored IMD Standard Calibration", {
        description: "Standard thresholds calibrated against 50+ Western Ghats historical landslides.",
      });
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      {/* ── Page Header ── */}
      <PageHeader
        eyebrow={t("administration")}
        title={t("systemSettings")}
        description="Configure telemetry sensors, operational warning gates, and multilingual locale dispatch settings."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => applyPreset("imd")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/80 px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground shadow-xs cursor-pointer"
              title="Reset sliders to calibrated default thresholds"
            >
              <RotateCcw className="size-3.5" />
              <span>Reset Defaults</span>
            </button>
            <button
              onClick={() =>
                toast.success(t("saveConfig"), {
                  description: `Rainfall trigger ${rain3} mm / 3 d · slope hazard ${slopeHazard}° · gate ${confidenceGate}%`,
                })
              }
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-primary/25 cursor-pointer"
            >
              <Save className="size-3.5" />
              {t("saveConfig")}
            </button>
          </div>
        }
      />

      {/* ── 1. Language Preference Card (Simple Dropdown) ── */}
      <section className="rounded-2xl border border-border/80 bg-card/90 shadow-sm backdrop-blur-xs transition-all overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 bg-muted/20 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary shadow-xs">
              <Globe className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-foreground">{t("selectLanguage")}</h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  <Sparkles className="size-2.5" /> 4 Locales
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Regional dialect & emergency broadcast language selector
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="rounded-md bg-muted/70 px-2 py-0.5 text-[11px] font-medium text-muted-foreground border border-border/60">
              🇬🇧 English
            </span>
            <span className="rounded-md bg-muted/70 px-2 py-0.5 text-[11px] font-medium text-muted-foreground border border-border/60">
              🇮🇳 தமிழ்
            </span>
            <span className="rounded-md bg-muted/70 px-2 py-0.5 text-[11px] font-medium text-muted-foreground border border-border/60">
              🇮🇳 മലയാളം
            </span>
            <span className="rounded-md bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary border border-primary/25">
              🇮🇳 ಕನ್ನಡ
            </span>
          </div>
        </div>

        <div className="p-6">
          <LanguageDropdown variant="settings" showToast={true} />
        </div>
      </section>

      {/* ── 2. Grid: System Information & Telemetry Sensors ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* System Information Card */}
        <section className="rounded-2xl border border-border/80 bg-card/90 shadow-sm backdrop-blur-xs flex flex-col justify-between overflow-hidden">
          <div>
            <div className="flex items-center justify-between border-b border-border/70 px-5 py-4 bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-card p-1 border border-border shadow-xs">
                  <img src="/logo.png" alt="LEWS Logo" className="size-full object-contain rounded-lg" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold leading-tight text-foreground">{t("systemInformation")}</h2>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Architecture & Sensing Engine</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Core
              </span>
            </div>

            <dl className="divide-y divide-border/60 text-xs">
              {[
                { label: "Deployment", value: "Western Ghats LEWS (Prototype)", badge: "v0.9.4" },
                { label: "Model Engine", value: "Dual: Random Forest + Heuristic v2.4", badge: "100 Trees" },
                { label: "Sentinel API", value: "Copernicus Hub Connected", badge: "SAR / MSI" },
                { label: "Earth Observation", value: "GEE & ESA InSAR Sentinel-1", code: true },
                { label: "Districts Monitored", value: "Wayanad, Idukki, Nilgiris, Kodagu", highlight: true },
                { label: "Decision Agent LLM", value: "Groq Cloud LPU (LLaMA 3.3 70B)", badge: "Fast" },
                { label: "Telemetry Polling", value: "Every 15 minutes automated cycle" },
                { label: "Rainfall Source", value: "IMD AWS + District Sensors (Mocked)" },
                { label: "Elevation & DEM", value: "Cartosat-1 30m / SRTM 1-ArcSec" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-muted/15"
                >
                  <dt className="text-muted-foreground font-medium">{item.label}</dt>
                  <dd className="text-right flex items-center gap-1.5">
                    <span className={cn("font-medium text-foreground", item.highlight && "text-primary font-semibold")}>
                      {item.value}
                    </span>
                    {item.badge && (
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground border border-border/50">
                        {item.badge}
                      </span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="border-t border-border/60 bg-muted/10 p-4 text-[11px] text-muted-foreground flex items-center justify-between">
            <span className="flex items-center gap-1">
              <ShieldCheck className="size-3.5 text-primary" />
              SDRF / NDRF Verified
            </span>
            <span className="font-mono text-[10px]">BUILD-2026.09-WG</span>
          </div>
        </section>

        {/* Telemetry Sensors Card */}
        <section className="rounded-2xl border border-border/80 bg-card/90 shadow-sm backdrop-blur-xs lg:col-span-2 flex flex-col justify-between overflow-hidden">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 px-5 py-4 bg-muted/20">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <RadioTower className="size-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">{t("telemetrySensors")}</h2>
                  <p className="text-[11px] text-muted-foreground">Real-time IoT gateway node health & battery status</p>
                </div>
              </div>

              {/* Status pills & Filter buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => setSensorFilter("all")}
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer",
                    sensorFilter === "all"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted"
                  )}
                >
                  All ({sensorNodes.length})
                </button>
                <button
                  onClick={() => setSensorFilter("online")}
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer",
                    sensorFilter === "online"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-muted/60 text-emerald-600 dark:text-emerald-400 hover:bg-muted"
                  )}
                >
                  Online ({online})
                </button>
                <button
                  onClick={() => setSensorFilter("attention")}
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer",
                    sensorFilter === "attention"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "bg-muted/60 text-amber-600 dark:text-amber-400 hover:bg-muted"
                  )}
                >
                  Needs Attention ({degradedOrOffline + lowBattery})
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-muted/40 text-[11px] tracking-wide text-muted-foreground uppercase border-b border-border/60">
                  <tr>
                    <th className="px-5 py-2.5 text-left font-semibold">Node ID</th>
                    <th className="px-4 py-2.5 text-left font-semibold">Deployment Site</th>
                    <th className="px-4 py-2.5 text-left font-semibold">Battery Meter</th>
                    <th className="px-4 py-2.5 text-left font-semibold">Signal</th>
                    <th className="px-4 py-2.5 text-left font-semibold">Last Telemetry</th>
                    <th className="px-5 py-2.5 text-right font-semibold">Health Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredNodes.map((n) => (
                    <tr key={n.id} className="transition-colors hover:bg-muted/20">
                      <td className="px-5 py-3 font-mono font-semibold text-foreground">
                        <span className="rounded bg-muted/80 px-1.5 py-0.5 border border-border/60">
                          {n.id}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">{n.site}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-20 overflow-hidden rounded-full bg-muted border border-border/40">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${n.battery}%`,
                                backgroundColor:
                                  n.battery < 25
                                    ? "#ef4444"
                                    : n.battery < 50
                                    ? "#f59e0b"
                                    : "#10b981",
                              }}
                            />
                          </div>
                          <span className="font-semibold tabular-nums text-foreground">
                            {n.battery}%
                          </span>
                          {n.battery < 40 && (
                            <BatteryLow className="size-3.5 text-amber-500 shrink-0" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        <span className="inline-flex items-center gap-1 font-medium">
                          {n.signal === "Good" ? (
                            <Wifi className="size-3 text-emerald-500" />
                          ) : (
                            <WifiOff className="size-3 text-amber-500" />
                          )}
                          {n.signal}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{n.lastSeen}</td>
                      <td className="px-5 py-3 text-right">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border",
                            n.status === "Online"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25"
                              : n.status === "Degraded"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25"
                              : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/25"
                          )}
                        >
                          <span
                            className={cn(
                              "size-1.5 rounded-full",
                              n.status === "Online"
                                ? "bg-emerald-500"
                                : n.status === "Degraded"
                                ? "bg-amber-500"
                                : "bg-red-500"
                            )}
                          />
                          {n.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredNodes.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted-foreground">
                        No sensor nodes match this filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-t border-border/60 bg-muted/10 px-5 py-3 text-xs text-muted-foreground flex items-center justify-between flex-wrap gap-2">
            <span>
              Telemetry nodes auto-refresh every <strong>60 seconds</strong> over LoRaWAN & GSM gateways.
            </span>
            <span className="font-medium text-foreground">
              Total Monitored Nodes: {sensorNodes.length}
            </span>
          </div>
        </section>
      </div>

      {/* ── 3. Risk Thresholds Card (With Presets & Interactive Sliders) ── */}
      <section className="rounded-2xl border border-border/80 bg-card/90 shadow-sm backdrop-blur-xs overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 px-6 py-4 bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary shadow-xs">
              <SlidersHorizontal className="size-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">{t("riskThresholds")}</h2>
              <p className="text-xs text-muted-foreground">
                Trigger values used to escalate automated warnings and siren broadcasts
              </p>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground font-medium mr-1 hidden sm:inline">Presets:</span>
            <button
              onClick={() => applyPreset("monsoon")}
              className="rounded-lg border border-border/80 bg-background/80 px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-accent hover:border-primary/40 transition-colors shadow-xs cursor-pointer"
            >
              🌧️ Severe Monsoon
            </button>
            <button
              onClick={() => applyPreset("sensitive")}
              className="rounded-lg border border-border/80 bg-background/80 px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-accent hover:border-primary/40 transition-colors shadow-xs cursor-pointer"
            >
              ⚡ High Sensitivity
            </button>
            <button
              onClick={() => applyPreset("imd")}
              className="rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors shadow-xs cursor-pointer"
            >
              ⚖️ IMD Standard
            </button>
          </div>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          <ThresholdSlider
            label="Rainfall trigger — 3-Day Cumulative"
            unit="mm"
            value={rain3}
            min={80}
            max={500}
            step={10}
            onChange={setRain3}
            recommended={200}
            note="Red-alert grade cumulative precipitation over 72 hours"
          />
          <ThresholdSlider
            label="Rainfall trigger — 7-Day Antecedent"
            unit="mm"
            value={rain7}
            min={150}
            max={900}
            step={10}
            onChange={setRain7}
            recommended={400}
            note="Critical regolith moisture saturation build-up cutoff"
          />
          <ThresholdSlider
            label="Slope Watch Cutoff"
            unit="°"
            value={slopeWatch}
            min={10}
            max={40}
            step={1}
            onChange={setSlopeWatch}
            recommended={22}
            note="Below this threshold, slope sectors are classified as low risk"
          />
          <ThresholdSlider
            label="Slope Hazard Initiation Cutoff"
            unit="°"
            value={slopeHazard}
            min={15}
            max={55}
            step={1}
            onChange={setSlopeHazard}
            recommended={28}
            note="Debris-flow failure initiation gradient for Western Ghats terrain"
          />
          <div className="md:col-span-2">
            <ThresholdSlider
              label="Minimum Sensor Confidence for Auto-Broadcast"
              unit="%"
              value={confidenceGate}
              min={50}
              max={99}
              step={1}
              onChange={setConfidenceGate}
              recommended={75}
              note="When confidence falls below this gate, the Decision Agent holds dispatch for manual Collector/Officer authorization"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function ThresholdSlider({
  label,
  unit,
  value,
  min,
  max,
  step,
  onChange,
  recommended,
  note,
}: {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  recommended?: number;
  note: string;
}) {
  const percentage = Math.round(((value - min) / (max - min)) * 100);

  return (
    <div className="rounded-xl border border-border/70 bg-card/60 p-4 transition-all hover:border-border hover:bg-card/90">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-foreground">{label}</span>
        <div className="flex items-center gap-1.5">
          {recommended !== undefined && (
            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground font-medium">
              Rec: {recommended}{unit}
            </span>
          )}
          <span className="rounded-md bg-primary/15 border border-primary/25 px-2 py-0.5 text-xs font-bold tabular-nums text-primary">
            {value} {unit}
          </span>
        </div>
      </div>

      <div className="mt-3.5 space-y-1.5">
        <div className="relative flex items-center">
          <input
            type="range"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onChange(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${percentage}%, hsl(var(--muted)) ${percentage}%, hsl(var(--muted)) 100%)`,
            }}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>

        <div className="flex justify-between text-[10px] font-medium text-muted-foreground/70">
          <span>{min} {unit}</span>
          <span className="text-foreground/60">{note}</span>
          <span>{max} {unit}</span>
        </div>
      </div>
    </div>
  );
}
