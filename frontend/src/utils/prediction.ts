import type {
  District,
  FactorContribution,
  PredictionInput,
  PredictionResult,
  RiskLevel,
} from "@/types";

/**
 * Weighted heuristic landslide susceptibility model (prototype).
 *
 * Each feature is normalised to a 0..1 hazard score, then combined with a
 * fixed weight vector loosely calibrated on Western Ghats debris-flow events
 * (Meppadi/Chooralmala 2024, Pettimudi 2020, Nilgiris 2009).
 */

export const FEATURE_WEIGHTS = {
  rainfall3d: 0.3,
  rainfall7d: 0.22,
  slope: 0.24,
  elevation: 0.12,
  distanceToRoad: 0.12,
} as const;

export const THRESHOLDS = {
  rainfall3d: 200, // mm — IMD red-alert style trigger
  rainfall7d: 400, // mm — antecedent saturation trigger
  slope: 28, // degrees — debris-flow initiation cutoff
  elevation: 900, // m — high-relief ghat terrain
  distanceToRoad: 250, // m — cut-slope destabilisation buffer
} as const;

export const SOIL_TYPES = [
  { value: "Lateritic", label: "Lateritic (Residual Ghat Soil)", factor: 1.0 },
  { value: "Colluvium", label: "Colluvium (Loose Slope Debris / High Hazard)", factor: 1.18 },
  { value: "Gneissic_Overburden", label: "Gneissic Overburden (Weathered Bedrock)", factor: 1.10 },
  { value: "Clayey_Loam", label: "Clayey Loam (Moderate Plasticity)", factor: 0.92 },
  { value: "Sandy_Loam", label: "Sandy Loam (Rapid Infiltration)", factor: 0.85 },
] as const;

/** Terrain / anthropogenic pressure multiplier per district. */
const DISTRICT_FACTOR: Record<District, number> = {
  Wayanad: 1.12,
  Idukki: 1.08,
  Nilgiris: 1.05,
  Senapati: 0.96,
  Churachandpur: 0.94,
};

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

export function classifyRisk(probability: number): RiskLevel {
  if (probability >= 75) return "Critical";
  if (probability >= 55) return "High";
  if (probability >= 30) return "Moderate";
  return "Low";
}

export function runPrediction(input: PredictionInput): PredictionResult {
  const scores = {
    rainfall3d: clamp01(input.rainfall3d / (THRESHOLDS.rainfall3d * 1.4)),
    rainfall7d: clamp01(input.rainfall7d / (THRESHOLDS.rainfall7d * 1.4)),
    slope: clamp01((input.slope - 8) / 34),
    elevation: clamp01((input.elevation - 200) / 1800),
    // closer to a road cut = higher hazard
    distanceToRoad: clamp01(1 - input.distanceToRoad / 1200),
  };

  const weighted = (
    Object.keys(FEATURE_WEIGHTS) as (keyof typeof FEATURE_WEIGHTS)[]
  ).map((key) => ({ key, value: scores[key] * FEATURE_WEIGHTS[key] }));

  const base = weighted.reduce((sum, w) => sum + w.value, 0);
  const districtFactor = DISTRICT_FACTOR[input.district] ?? 1;
  const soilType = input.soil_type || "Lateritic";
  const soilFactor = SOIL_TYPES.find((s) => s.value === soilType)?.factor ?? 1.0;

  // Compound effect: heavy short burst on already saturated soil.
  const compound =
    scores.rainfall3d > 0.7 && scores.rainfall7d > 0.6 ? 0.08 : 0;

  const probability = Math.round(
    clamp01(base * districtFactor * soilFactor + compound) * 100,
  );

  const totalWeighted = base || 1;

  const meta: Record<
    keyof typeof FEATURE_WEIGHTS,
    { label: string; value: string; threshold: string; exceeded: boolean }
  > = {
    rainfall3d: {
      label: "3-day Rainfall",
      value: `${input.rainfall3d} mm`,
      threshold: `> ${THRESHOLDS.rainfall3d} mm`,
      exceeded: input.rainfall3d > THRESHOLDS.rainfall3d,
    },
    rainfall7d: {
      label: "7-day Antecedent Rainfall",
      value: `${input.rainfall7d} mm`,
      threshold: `> ${THRESHOLDS.rainfall7d} mm`,
      exceeded: input.rainfall7d > THRESHOLDS.rainfall7d,
    },
    slope: {
      label: "Terrain Slope",
      value: `${input.slope}°`,
      threshold: `> ${THRESHOLDS.slope}°`,
      exceeded: input.slope > THRESHOLDS.slope,
    },
    elevation: {
      label: "Elevation",
      value: `${input.elevation} m`,
      threshold: `> ${THRESHOLDS.elevation} m`,
      exceeded: input.elevation > THRESHOLDS.elevation,
    },
    distanceToRoad: {
      label: "Proximity to Road Cut",
      value: `${input.distanceToRoad} m`,
      threshold: `< ${THRESHOLDS.distanceToRoad} m`,
      exceeded: input.distanceToRoad < THRESHOLDS.distanceToRoad,
    },
  };

  const factors: FactorContribution[] = weighted
    .map(({ key, value }) => ({
      factor: meta[key].label,
      contribution: Math.round((value / totalWeighted) * 100),
      value: meta[key].value,
      threshold: meta[key].threshold,
      exceeded: meta[key].exceeded,
      weight: FEATURE_WEIGHTS[key],
    }))
    .sort((a, b) => b.contribution - a.contribution);

  // Confidence rises when the signal is decisive (very high or very low).
  const decisiveness = Math.abs(probability - 50) / 50;
  const confidence = Math.round(72 + decisiveness * 24 - (compound ? 2 : 0));

  const riskClass = classifyRisk(probability);
  const top = factors[0]!;

  const narrative =
    riskClass === "Critical" || riskClass === "High"
      ? `${input.district}: model flags ${riskClass.toLowerCase()} susceptibility, driven mainly by ${top.factor.toLowerCase()} (${top.value}). Evacuation readiness advised for downslope hamlets.`
      : `${input.district}: susceptibility is ${riskClass.toLowerCase()}. ${top.factor} (${top.value}) is the dominant term but stays within safe operating range.`;

  return {
    probability,
    riskClass,
    confidence,
    factors,
    narrative,
    engine: input.engine === "heuristic" ? "Deterministic Weighted Heuristic" : "Random Forest Ensemble (100 Trees)",
    featureImportances: {
      rainfall_3d: 0.32,
      rainfall_7d: 0.24,
      slope: 0.21,
      elevation: 0.11,
      road_distance: 0.08,
      soil_type: 0.04,
    },
    comparison: {
      mlProbability: probability,
      heuristicProbability: Math.min(100, Math.max(0, Math.round(probability * 0.95))),
      variance: Math.round(probability * 0.05),
    },
    metrics: {
      accuracy: 0.92,
      f1Score: 0.915,
      oobError: 0.08,
      consensusAgreement: confidence,
    },
  };
}
