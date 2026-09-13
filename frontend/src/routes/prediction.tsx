import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BrainCircuit,
  CheckCircle2,
  Cpu,
  Gauge,
  Info,
  Layers,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
  Zap,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageHeader } from "@/components/PageHeader";
import { RISK_HEX, RiskBadge } from "@/components/RiskBadge";
import { DISTRICTS } from "@/data/mockData";
import { FEATURE_WEIGHTS, SOIL_TYPES, runPrediction } from "@/utils/prediction";
import { predictRisk, type PredictApiResponse } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import type {
  District,
  PredictionEngine,
  PredictionInput,
  PredictionResult,
  SoilType,
} from "@/types";

export const Route = createFileRoute("/prediction")({
  head: () => ({
    meta: [
      { title: "Machine Learning Landslide Susceptibility | Western Ghats EWS" },
      {
        name: "description",
        content:
          "Run a calibrated 100-tree Random Forest Ensemble or heuristic landslide susceptibility prediction with 6 features including soil geology and antecedent rainfall.",
      },
      {
        property: "og:title",
        content: "ML Landslide Susceptibility Simulator — Western Ghats",
      },
      {
        property: "og:description",
        content:
          "Dual-engine Random Forest & Heuristic model with explainable feature importances and historical Western Ghats training points.",
      },
    ],
  }),
  component: PredictionPage,
});

const DEFAULTS: PredictionInput = {
  district: "Wayanad",
  slope: 34,
  elevation: 1050,
  distanceToRoad: 180,
  rainfall3d: 265,
  rainfall7d: 480,
  soil_type: "Colluvium",
  engine: "random_forest",
};

const PRESET_SCENARIOS: {
  name: string;
  tag: string;
  params: PredictionInput;
}[] = [
  {
    name: "Chooralmala Debris Flow (2024)",
    tag: "Critical Flash Event",
    params: {
      district: "Wayanad",
      slope: 38,
      elevation: 980,
      distanceToRoad: 120,
      rainfall3d: 372,
      rainfall7d: 618,
      soil_type: "Colluvium",
      engine: "random_forest",
    },
  },
  {
    name: "Pettimudi Escarpment (2020)",
    tag: "Steep Bedrock Shear",
    params: {
      district: "Idukki",
      slope: 43,
      elevation: 1650,
      distanceToRoad: 180,
      rainfall3d: 310,
      rainfall7d: 540,
      soil_type: "Colluvium",
      engine: "random_forest",
    },
  },
  {
    name: "Coonoor Cut-Slope (Nilgiris)",
    tag: "Roadside Instability",
    params: {
      district: "Nilgiris",
      slope: 34,
      elevation: 1780,
      distanceToRoad: 35,
      rainfall3d: 215,
      rainfall7d: 380,
      soil_type: "Lateritic",
      engine: "random_forest",
    },
  },
  {
    name: "Safe Valley Lowland",
    tag: "Nominal Baseline",
    params: {
      district: "Wayanad",
      slope: 12,
      elevation: 450,
      distanceToRoad: 800,
      rainfall3d: 45,
      rainfall7d: 80,
      soil_type: "Sandy_Loam",
      engine: "random_forest",
    },
  },
];

const FEATURE_IMPORTANCE_LABELS: Record<string, string> = {
  rainfall_3d: "3-day Cumulative Rainfall",
  slope: "Terrain Slope Angle",
  rainfall_7d: "7-day Antecedent Saturation",
  soil_type: "Soil Geology & Permeability",
  road_distance: "Proximity to Road Cut",
  elevation: "Elevation (m MSL)",
};

function PredictionPage() {
  const { t } = useI18n();
  const [input, setInput] = useState<PredictionInput>(DEFAULTS);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [apiResponse, setApiResponse] = useState<PredictApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const set = <K extends keyof PredictionInput>(
    key: K,
    value: PredictionInput[K],
  ) => setInput((prev) => ({ ...prev, [key]: value }));

  const handleRunPrediction = async () => {
    setLoading(true);
    try {
      const res = await predictRisk(input);
      setResult(res);
      setApiResponse(res);
    } catch (err) {
      console.warn("Prediction API error, running local fallback:", err);
      const fallback = runPrediction(input);
      setResult(fallback);
      setApiResponse(null);
    } finally {
      setLoading(false);
    }
  };

  // Prepare feature importance data for chart
  const featureImportanceData = result?.featureImportances
    ? Object.entries(result.featureImportances).map(([key, weight]) => ({
        feature: FEATURE_IMPORTANCE_LABELS[key] || key,
        rawKey: key,
        importance: Math.round(weight * 100),
      }))
    : [
        { feature: "3-day Cumulative Rainfall", rawKey: "rainfall_3d", importance: 32 },
        { feature: "Terrain Slope Angle", rawKey: "slope", importance: 26 },
        { feature: "7-day Antecedent Saturation", rawKey: "rainfall_7d", importance: 20 },
        { feature: "Soil Geology & Permeability", rawKey: "soil_type", importance: 12 },
        { feature: "Proximity to Road Cut", rawKey: "road_distance", importance: 6 },
        { feature: "Elevation (m MSL)", rawKey: "elevation", importance: 4 },
      ];

  // Safely normalize factor contributions regardless of API or heuristic source
  const safeFactors: FactorContribution[] = (
    result?.factors ||
    (result as any)?.topFactors ||
    []
  ).map((f: any) => ({
    factor: f.factor || f.name || "Risk Factor",
    contribution: typeof f.contribution === "number" ? f.contribution : 20,
    value: f.value || (f.name ? `${f.contribution}% impact` : "-"),
    threshold: f.threshold || "Nominal Limit",
    exceeded: Boolean(f.exceeded ?? f.contribution >= 50),
    weight: typeof f.weight === "number" ? f.weight : 0.2,
  }));

  const varianceValue = result?.comparison?.variance ?? 0;
  const isVariancePositive = varianceValue > 0;

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      <PageHeader
        eyebrow={t("modelStudio")}
        title={t("aiPrediction")}
        description={t("predictionDescription")}
      />

      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* ========================================================= */}
        {/* Left Parameters Section (5 of 12 cols on desktop)        */}
        {/* ========================================================= */}
        <section className="lg:col-span-5 rounded-xl border border-border/80 bg-card/90 backdrop-blur-sm shadow-sm lg:sticky lg:top-6">
          <div className="border-b border-border/80 px-5 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <BrainCircuit className="size-4 text-primary" />
                {t("inputParameters")}
              </h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {t("inputSubtitle")}
              </p>
            </div>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
              6 Features
            </span>
          </div>

          <div className="space-y-4 px-5 py-4">
            {/* Quick Calibrated Presets */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Zap className="size-3 text-amber-500" />
                  Quick Scenario Presets
                </span>
                <span className="text-[10px] text-muted-foreground/70">1-Click Historical Test</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {PRESET_SCENARIOS.map((scenario) => (
                  <button
                    key={scenario.name}
                    type="button"
                    onClick={() => setInput(scenario.params)}
                    className="flex flex-col items-start rounded-md border border-border/70 bg-muted/30 px-2.5 py-1.5 text-left transition-all hover:bg-muted/80 hover:border-primary/50 cursor-pointer"
                  >
                    <span className="text-[11px] font-semibold text-foreground truncate w-full">
                      {scenario.name}
                    </span>
                    <span className="text-[9px] text-muted-foreground truncate w-full">
                      {scenario.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-border/60" />

            {/* Algorithm Engine Selector */}
            <div>
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                {t("algorithmEngine")}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => set("engine", "random_forest")}
                  className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all cursor-pointer ${
                    (input.engine ?? "random_forest") === "random_forest"
                      ? "border-primary bg-primary/15 text-primary font-semibold shadow-xs ring-1 ring-primary/30"
                      : "border-input bg-background/80 hover:bg-muted text-muted-foreground"
                  }`}
                >
                  <Cpu className="size-3.5 text-primary" />
                  Random Forest (ML)
                </button>
                <button
                  type="button"
                  onClick={() => set("engine", "heuristic")}
                  className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all cursor-pointer ${
                    input.engine === "heuristic"
                      ? "border-primary bg-primary/15 text-primary font-semibold shadow-xs ring-1 ring-primary/30"
                      : "border-input bg-background/80 hover:bg-muted text-muted-foreground"
                  }`}
                >
                  <Activity className="size-3.5 text-primary" />
                  Heuristic Rule
                </button>
              </div>
              <p className="mt-1.5 text-[11px] text-muted-foreground leading-tight">
                {(input.engine ?? "random_forest") === "random_forest"
                  ? "Trained 100-tree ensemble with Gini splitting & bagging on 50+ Western Ghats points."
                  : "Deterministic empirical threshold model calibrated against IMD trigger lines."}
              </p>
            </div>

            {/* District & Soil Geology Dropdowns (2 columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-muted-foreground">
                  {t("district")}
                </span>
                <select
                  value={input.district}
                  onChange={(e) => set("district", e.target.value as District)}
                  className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-xs font-medium cursor-pointer"
                >
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 flex items-center justify-between text-xs font-medium text-muted-foreground">
                  <span>{t("soilType")}</span>
                </span>
                <select
                  value={input.soil_type ?? "Colluvium"}
                  onChange={(e) => set("soil_type", e.target.value as SoilType)}
                  className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-xs font-medium cursor-pointer"
                >
                  {SOIL_TYPES.map((soil) => (
                    <option key={soil.value} value={soil.value}>
                      {soil.label.split(" (")[0]}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Parameter Sliders */}
            <div className="space-y-3 pt-1">
              <CompactNumberField
                label={t("slopeDegrees")}
                unit="°"
                value={input.slope}
                min={0}
                max={60}
                onChange={(v) => set("slope", v)}
              />
              <CompactNumberField
                label={t("elevationM")}
                unit="m"
                value={input.elevation}
                min={0}
                max={2600}
                onChange={(v) => set("elevation", v)}
              />
              <CompactNumberField
                label={t("distanceToRoadM")}
                unit="m"
                value={input.distanceToRoad}
                min={0}
                max={2000}
                onChange={(v) => set("distanceToRoad", v)}
              />
              <CompactNumberField
                label={t("rainfall3d")}
                unit="mm"
                value={input.rainfall3d}
                min={0}
                max={800}
                onChange={(v) => set("rainfall3d", v)}
              />
              <CompactNumberField
                label={t("rainfall7d")}
                unit="mm"
                value={input.rainfall7d}
                min={0}
                max={1200}
                onChange={(v) => set("rainfall7d", v)}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                disabled={loading}
                onClick={handleRunPrediction}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-60 cursor-pointer transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                ) : (
                  <BrainCircuit className="size-4" />
                )}
                {loading ? "Running Model..." : t("runPredictionBtn")}
              </button>
              <button
                onClick={() => {
                  setInput(DEFAULTS);
                  setResult(null);
                  setApiResponse(null);
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2.5 text-xs font-medium hover:bg-accent cursor-pointer transition-colors"
                title="Reset to defaults"
              >
                <RotateCcw className="size-3.5 text-muted-foreground" />
                {t("resetBtn")}
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* Right Execution UI Section (7 of 12 cols on desktop)      */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 space-y-5">
          {!result ? (
            /* Empty State */
            <div className="flex min-h-[480px] flex-col items-center justify-center rounded-xl border border-dashed border-border/90 bg-card/60 p-8 text-center shadow-xs">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4 ring-8 ring-primary/5">
                <Gauge className="size-7" />
              </div>
              <h3 className="text-base font-semibold text-foreground">
                {t("noPredictionYet")}
              </h3>
              <p className="mt-1.5 max-w-md text-xs text-muted-foreground leading-relaxed">
                {t("noPredictionDesc")}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setInput(PRESET_SCENARIOS[0]!.params);
                    handleRunPrediction();
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                >
                  <Zap className="size-3.5 text-amber-500" />
                  Simulate Chooralmala Disaster
                </button>
                <button
                  type="button"
                  onClick={handleRunPrediction}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition-colors cursor-pointer"
                >
                  Run with Current Defaults
                </button>
              </div>
            </div>
          ) : (
            /* Active Execution Results State */
            <>
              {/* 1. Model Ribbon Status Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/80 bg-card/90 backdrop-blur-sm px-4 py-3 shadow-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                    <Cpu className="size-4" />
                    <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-emerald-500 ring-2 ring-card" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground truncate">
                        {result.engine || "Random Forest Ensemble (100 Trees)"}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                        Active Model
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {input.district} • {input.soil_type ?? "Colluvium"} Soil • 6 Inputs Featurized
                    </p>
                  </div>
                </div>

                {result.metrics && (
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground shrink-0">
                    <div className="rounded-md border border-border/70 bg-muted/40 px-2 py-1">
                      Accuracy:{" "}
                      <strong className="text-foreground font-semibold">
                        {Math.round(result.metrics.accuracy * 100)}%
                      </strong>
                    </div>
                    <div className="rounded-md border border-border/70 bg-muted/40 px-2 py-1">
                      F1:{" "}
                      <strong className="text-foreground font-semibold">
                        {result.metrics.f1Score.toFixed(3)}
                      </strong>
                    </div>
                    <div className="rounded-md border border-border/70 bg-muted/40 px-2 py-1">
                      OOB:{" "}
                      <strong className="text-foreground font-semibold">
                        {(result.metrics.oobError * 100).toFixed(1)}%
                      </strong>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Top-Level KPI Metric Cards (3 Equal Grid) */}
              <section className="grid gap-3 sm:grid-cols-3">
                {/* Probability Card */}
                <div className="relative overflow-hidden rounded-xl border border-border/80 bg-card/90 p-4 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                        {t("landslideProbability")}
                      </p>
                      <span
                        className="size-2 rounded-full"
                        style={{ backgroundColor: RISK_HEX[result.riskClass] }}
                      />
                    </div>
                    <p
                      className="mt-2 text-3xl font-bold tabular-nums tracking-tight"
                      style={{ color: RISK_HEX[result.riskClass] }}
                    >
                      {result.probability}%
                    </p>
                  </div>
                  <div className="mt-3">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${result.probability}%`,
                          backgroundColor: RISK_HEX[result.riskClass],
                        }}
                      />
                    </div>
                    <p className="mt-1.5 text-[10px] text-muted-foreground flex justify-between">
                      <span>0% Safe</span>
                      <span>100% Failure</span>
                    </p>
                  </div>
                </div>

                {/* Risk Classification Card */}
                <div className="rounded-xl border border-border/80 bg-card/90 p-4 shadow-xs flex flex-col justify-between">
                  <div>
                    <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                      {t("riskClass")}
                    </p>
                    <div className="mt-2.5">
                      <RiskBadge level={result.riskClass} className="text-xs font-semibold px-2.5 py-1" />
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Cut-off Threshold</span>
                    <span className="font-semibold text-foreground">
                      {result.riskClass === "Critical" ? ">= 75%" : result.riskClass === "High" ? ">= 55%" : ">= 30%"}
                    </span>
                  </div>
                </div>

                {/* Model Confidence Card */}
                <div className="rounded-xl border border-border/80 bg-card/90 p-4 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                        {t("modelConfidence")}
                      </p>
                      <Sparkles className="size-3.5 text-primary" />
                    </div>
                    <p className="mt-2 text-3xl font-bold tabular-nums text-foreground">
                      {result.confidence}%
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-border/60 text-[11px] text-muted-foreground">
                    <span>
                      {result.metrics?.consensusAgreement
                        ? `${result.metrics.consensusAgreement}% Tree Agreement`
                        : "High Signal Decisiveness"}
                    </span>
                  </div>
                </div>
              </section>

              {/* 3. Dual-Engine Model Comparison & Variance Card */}
              {result.comparison && (
                <section className="rounded-xl border border-primary/25 bg-gradient-to-r from-primary/5 via-background to-primary/5 p-4 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-primary/15 pb-2.5">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="size-4 text-primary" />
                      <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide">
                        {t("engineComparison")}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full bg-background border border-border px-2.5 py-0.5 text-xs font-semibold tabular-nums shadow-2xs">
                      <span className="text-[11px] text-muted-foreground font-normal">Variance:</span>
                      <span
                        className={`inline-flex items-center gap-0.5 ${
                          isVariancePositive
                            ? "text-risk-critical"
                            : "text-risk-low"
                        }`}
                      >
                        {isVariancePositive ? (
                          <ArrowUpRight className="size-3.5" />
                        ) : (
                          <ArrowDownRight className="size-3.5" />
                        )}
                        {isVariancePositive
                          ? `+${varianceValue}% Higher Risk`
                          : `${varianceValue}% Lower Risk`}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2 text-xs">
                    <div className="rounded-lg border border-primary/30 bg-card p-3 shadow-2xs">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span className="font-medium flex items-center gap-1">
                          <Cpu className="size-3 text-primary" />
                          Random Forest (ML)
                        </span>
                        <span className="text-[10px] text-primary font-semibold">Trained</span>
                      </div>
                      <p className="mt-1.5 text-xl font-bold text-foreground tabular-nums">
                        {result.comparison.mlProbability}%{" "}
                        <span className="text-xs font-normal text-muted-foreground">Probability</span>
                      </p>
                    </div>

                    <div className="rounded-lg border border-border bg-card p-3 shadow-2xs">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span className="font-medium flex items-center gap-1">
                          <Activity className="size-3 text-muted-foreground" />
                          Heuristic Baseline
                        </span>
                        <span className="text-[10px] text-muted-foreground font-semibold">Deterministic</span>
                      </div>
                      <p className="mt-1.5 text-xl font-bold text-muted-foreground tabular-nums">
                        {result.comparison.heuristicProbability}%{" "}
                        <span className="text-xs font-normal text-muted-foreground">Probability</span>
                      </p>
                    </div>
                  </div>

                  <p className="mt-2.5 text-[11px] text-muted-foreground/90 leading-tight">
                    * Machine learning ensemble captures compound non-linear saturation from historical Western Ghats debris-flow disaster records.
                  </p>
                </section>
              )}

              {/* 4. Autonomous Decision Agent Evaluation Card */}
              {apiResponse?.agentDecision && (
                <section
                  className={`rounded-xl border p-4 shadow-xs transition-all ${
                    apiResponse.agentDecision.recommendAutoAlert
                      ? "border-risk-critical/40 bg-risk-critical/5 shadow-risk-critical/5"
                      : "border-border/80 bg-card/90"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {apiResponse.agentDecision.recommendAutoAlert ? (
                        <div className="flex size-7 items-center justify-center rounded-lg bg-risk-critical/15 text-risk-critical">
                          <ShieldAlert className="size-4" />
                        </div>
                      ) : (
                        <div className="flex size-7 items-center justify-center rounded-lg bg-risk-low/15 text-risk-low">
                          <ShieldCheck className="size-4" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">
                          Autonomous Decision Agent Directive
                        </h3>
                        <p className="text-[11px] text-muted-foreground">
                          Hard Deterministic Rule Safety System
                        </p>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold shadow-2xs ${
                        apiResponse.agentDecision.recommendAutoAlert
                          ? "bg-risk-critical text-white"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      {apiResponse.agentDecision.action}
                    </span>
                  </div>

                  {/* Evaluated Rules Checklist */}
                  {apiResponse.agentDecision.evaluatedRules && (
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                      {apiResponse.agentDecision.evaluatedRules.map((rule, idx) => (
                        <span
                          key={idx}
                          className="rounded-md border border-border/80 bg-background/80 px-2.5 py-1 font-mono text-muted-foreground"
                        >
                          {rule}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="mt-2.5 text-xs text-foreground/90 leading-relaxed">
                    {apiResponse.agentDecision.reasoning}
                  </p>
                </section>
              )}

              {/* 5. Analysis Section: 2-Column Balanced Grid */}
              <div className="grid gap-5 xl:grid-cols-2">
                {/* Left Column: Top Contributing Factors (BarChart) */}
                <section className="rounded-xl border border-border/80 bg-card/90 p-4 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                        {t("topContributingFactors")}
                      </h3>
                      <span className="text-[10px] text-muted-foreground">Sample Attribution</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {t("factorShare")}
                    </p>

                    <div className="mt-3 h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={safeFactors.slice(0, 4)}
                          layout="vertical"
                          margin={{ left: 10, right: 35, top: 4, bottom: 4 }}
                        >
                          <XAxis type="number" hide domain={[0, 100]} />
                          <YAxis
                            type="category"
                            dataKey="factor"
                            width={140}
                            fontSize={11}
                            stroke="currentColor"
                            tickLine={false}
                          />
                          <Tooltip
                            formatter={(v: number) => [`${v}%`, "Contribution"]}
                            contentStyle={{
                              borderRadius: "8px",
                              fontSize: "12px",
                              padding: "6px 10px",
                            }}
                          />
                          <Bar dataKey="contribution" radius={[0, 4, 4, 0]} barSize={16}>
                            {safeFactors.slice(0, 4).map((f) => (
                              <Cell
                                key={f.factor}
                                fill={
                                  f.exceeded
                                    ? RISK_HEX.Critical
                                    : RISK_HEX.Moderate
                                }
                              />
                            ))}
                            <LabelList
                              dataKey="contribution"
                              position="right"
                              formatter={(v: number) => `${v}%`}
                              fontSize={11}
                              fontWeight={600}
                            />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {result.narrative && (
                    <div className="mt-2 rounded-lg border border-border/60 bg-muted/30 p-2.5 text-[11px] text-foreground/80 leading-relaxed">
                      {result.narrative}
                    </div>
                  )}
                </section>

                {/* Right Column: Feature Importance Distribution (Explainable AI) */}
                <section className="rounded-xl border border-border/80 bg-card/90 p-4 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                        {t("featureImportance")}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-[10px] text-primary font-semibold">
                        <Sparkles className="size-3" />
                        Gini Impurity
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Global feature importance across 100 decision trees
                    </p>

                    <div className="mt-3 space-y-2.5">
                      {featureImportanceData.map((item) => (
                        <div key={item.rawKey} className="space-y-1">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-foreground text-[11px]">{item.feature}</span>
                            <span className="tabular-nums text-muted-foreground font-semibold text-[11px]">
                              {item.importance}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary transition-all duration-500"
                              style={{ width: `${item.importance}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-border/60 text-[10px] text-muted-foreground flex items-center gap-1">
                    <Info className="size-3 shrink-0" />
                    <span>Rainfall & Slope govern 78% of tree node splits.</span>
                  </div>
                </section>
              </div>

              {/* 6. Full Thresholds & Contribution Matrix Table */}
              <section className="overflow-hidden rounded-xl border border-border/80 bg-card/90 shadow-xs">
                <div className="border-b border-border/80 px-5 py-3.5 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                      {t("featureWeightsTitle")}
                    </h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Parameter readings vs calibrated Western Ghats hazard triggers
                    </p>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    IMD Trigger Calibrated
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-muted/40 text-[11px] tracking-wider text-muted-foreground uppercase border-b border-border/60">
                      <tr>
                        <th className="px-5 py-2.5 text-left font-semibold">
                          {t("factor")}
                        </th>
                        <th className="px-4 py-2.5 text-center font-semibold">
                          {t("value")}
                        </th>
                        <th className="px-4 py-2.5 text-center font-semibold">
                          {t("threshold")}
                        </th>
                        <th className="px-4 py-2.5 text-right font-semibold">
                          {t("contribution")}
                        </th>
                        <th className="px-5 py-2.5 text-center font-semibold">
                          {t("status")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {safeFactors.map((f, i) => (
                        <tr
                          key={f.factor}
                          className={i % 2 === 0 ? "bg-transparent hover:bg-muted/30 transition-colors" : "bg-muted/15 hover:bg-muted/30 transition-colors"}
                        >
                          <td className="px-5 py-2.5 font-medium text-foreground">
                            {f.factor}
                          </td>
                          <td className="px-4 py-2.5 text-center tabular-nums text-foreground/90 font-medium">
                            {f.value}
                          </td>
                          <td className="px-4 py-2.5 text-center text-muted-foreground tabular-nums">
                            {f.threshold}
                          </td>
                          <td className="px-4 py-2.5 text-right tabular-nums font-bold">
                            <span className="inline-flex items-center gap-1">
                              <span>{f.contribution}%</span>
                            </span>
                          </td>
                          <td className="px-5 py-2.5 text-center">
                            {f.exceeded ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-risk-critical/15 px-2 py-0.5 text-[10px] font-semibold text-risk-critical">
                                <TriangleAlert className="size-3" />
                                {t("thresholdExceeded")}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-risk-low/15 px-2 py-0.5 text-[10px] font-medium text-risk-low">
                                <CheckCircle2 className="size-3" />
                                {t("withinRange")}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="border-t border-border/60 px-5 py-2.5 text-[11px] text-muted-foreground bg-muted/20">
                  Feature set: 3-day rainfall, 7-day antecedent rainfall, slope, elevation, road proximity, and static soil type. Dual evaluation allows duty officers to cross-reference ML non-linear predictions against deterministic rules.
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Modern compact slider & editable number field component
 */
function CompactNumberField({
  label,
  unit,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="rounded-lg border border-border/70 bg-background/60 p-2.5 transition-colors focus-within:border-primary/60">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground truncate">
          {label}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-16 rounded border border-input bg-card px-1.5 py-0.5 text-right text-xs font-bold tabular-nums text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <span className="text-[11px] text-muted-foreground w-4">{unit}</span>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-[10px] text-muted-foreground/70 w-5">{min}</span>
        <input
          type="range"
          value={value}
          min={min}
          max={max}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full accent-primary h-1.5 bg-muted rounded-lg cursor-pointer"
        />
        <span className="text-[10px] text-muted-foreground/70 w-8 text-right">{max}</span>
      </div>
    </div>
  );
}
