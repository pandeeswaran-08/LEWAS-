/**
 * Landslide Susceptibility Prediction Service.
 * Implements a weighted multi-factor heuristic model calibrated for Western Ghats terrain.
 */

import {
  FEATURE_WEIGHTS,
  THRESHOLDS,
  DISTRICT_DEFAULTS,
} from "../config/constants.js";
import {
  predictWithRandomForest,
  getMLModelMetadata,
} from "./mlRandomForestService.js";

const clamp01 = (num) => Math.max(0, Math.min(1, num));

/**
 * Classifies the numerical probability into standard risk categories.
 * @param {number} probability (0 - 100)
 * @returns {"Low" | "Moderate" | "High" | "Critical"}
 */
export function classifyRisk(probability) {
  if (probability >= 75) return "Critical";
  if (probability >= 55) return "High";
  if (probability >= 30) return "Moderate";
  return "Low";
}

/**
 * Runs the prediction model given terrain and hydrometeorological parameters.
 * Supports both Random Forest ML Ensemble and Heuristic engines.
 *
 * @param {Object} params
 * @param {string} params.district - District name (e.g., "Wayanad", "Idukki", "Nilgiris")
 * @param {number} params.rainfall3d - 3-day cumulative precipitation in mm
 * @param {number} params.rainfall7d - 7-day cumulative antecedent precipitation in mm
 * @param {number} [params.slope] - Terrain slope in degrees
 * @param {number} [params.elevation] - Elevation in meters
 * @param {number} [params.distanceToRoad] - Proximity to road cut in meters
 * @param {string} [params.soil_type] - Soil type (Lateritic | Clayey_Loam | Colluvium | Gneissic_Overburden | Sandy_Loam)
 * @param {"random_forest" | "heuristic"} [params.engine="random_forest"] - Susceptibility model engine
 * @returns {Object} Prediction result containing probability, riskClass, confidence, topFactors, and ML metrics
 */
export function calculatePrediction({
  district = "Wayanad",
  rainfall3d = 0,
  rainfall7d = 0,
  slope,
  elevation,
  distanceToRoad,
  soil_type = "Lateritic",
  engine = "random_forest",
}) {
  const defaults = DISTRICT_DEFAULTS[district] || DISTRICT_DEFAULTS.Wayanad;

  const actualSlope = Number(slope ?? defaults.slope);
  const actualElevation = Number(elevation ?? defaults.elevation);
  const actualDistanceToRoad = Number(distanceToRoad ?? defaults.distanceToRoad);
  const r3d = Number(rainfall3d);
  const r7d = Number(rainfall7d);
  const selectedSoil = soil_type || "Lateritic";

  // Normalize each feature into 0..1 hazard score
  const featureScores = {
    rainfall3d: clamp01(r3d / (THRESHOLDS.rainfall3d * 1.4)),
    rainfall7d: clamp01(r7d / (THRESHOLDS.rainfall7d * 1.4)),
    slope: clamp01((actualSlope - 8) / 34),
    elevation: clamp01((actualElevation - 200) / 1800),
    distanceToRoad: clamp01(1 - actualDistanceToRoad / 1200), // closer road = higher vulnerability
  };

  // Calculate weighted sub-scores
  const weightedContributions = Object.keys(FEATURE_WEIGHTS).map((key) => {
    const rawHazard = featureScores[key];
    const weight = FEATURE_WEIGHTS[key];
    const contributionValue = rawHazard * weight;
    return { key, rawHazard, weight, contributionValue };
  });

  const baseScore = weightedContributions.reduce(
    (acc, curr) => acc + curr.contributionValue,
    0
  );

  // Compound saturation penalty: intense short-duration rainfall over already saturated ground
  const compoundPenalty =
    featureScores.rainfall3d > 0.65 && featureScores.rainfall7d > 0.60 ? 0.08 : 0;

  const districtMultiplier = defaults.multiplier || 1.0;
  const finalScore = clamp01(baseScore * districtMultiplier + compoundPenalty);
  const probability = Math.round(finalScore * 100);
  const riskClass = classifyRisk(probability);

  // Model confidence: based on signal alignment and extreme trigger consistency
  let confidenceScore = 80;
  if (r3d > THRESHOLDS.rainfall3d && r7d > THRESHOLDS.rainfall7d) {
    confidenceScore += 8; // Strong dual meteorological signal
  }
  if (actualSlope > THRESHOLDS.slope) {
    confidenceScore += 4; // High hazard terrain confirmed
  }
  if (r3d < 20 && r7d < 40) {
    confidenceScore += 5; // Clear low condition
  }
  const confidence = Math.min(95, Math.max(65, confidenceScore));

  // Meta breakdown of factors with readable labels & threshold flags
  const factorLabels = {
    rainfall3d: {
      factor: "3-Day Cumulative Rainfall",
      value: `${r3d} mm`,
      threshold: `> ${THRESHOLDS.rainfall3d} mm`,
      exceeded: r3d > THRESHOLDS.rainfall3d,
    },
    rainfall7d: {
      factor: "7-Day Antecedent Rainfall",
      value: `${r7d} mm`,
      threshold: `> ${THRESHOLDS.rainfall7d} mm`,
      exceeded: r7d > THRESHOLDS.rainfall7d,
    },
    slope: {
      factor: "Slope Angle",
      value: `${actualSlope}°`,
      threshold: `> ${THRESHOLDS.slope}°`,
      exceeded: actualSlope > THRESHOLDS.slope,
    },
    elevation: {
      factor: "Elevation Relief",
      value: `${actualElevation} m`,
      threshold: `> ${THRESHOLDS.elevation} m`,
      exceeded: actualElevation > THRESHOLDS.elevation,
    },
    distanceToRoad: {
      factor: "Road Cut-Slope Proximity",
      value: `${actualDistanceToRoad} m`,
      threshold: `< ${THRESHOLDS.distanceToRoad} m`,
      exceeded: actualDistanceToRoad < THRESHOLDS.distanceToRoad,
    },
  };

  const totalWeighted = baseScore || 1;
  const topFactors = weightedContributions
    .map((item) => {
      const meta = factorLabels[item.key];
      const contributionPercent = Math.round(
        (item.contributionValue / totalWeighted) * 100
      );
      return {
        factor: meta.factor,
        featureKey: item.key,
        value: meta.value,
        threshold: meta.threshold,
        weight: item.weight,
        contribution: contributionPercent,
        exceeded: meta.exceeded,
      };
    })
    .sort((a, b) => b.contribution - a.contribution);

  const heuristicResult = {
    district,
    inputParameters: {
      rainfall3d: r3d,
      rainfall7d: r7d,
      slope: actualSlope,
      elevation: actualElevation,
      distanceToRoad: actualDistanceToRoad,
      soil_type: selectedSoil,
    },
    probability,
    riskClass,
    confidence,
    factors: topFactors,
    topFactors,
    engine: "Deterministic Weighted Heuristic",
    calculatedAt: new Date().toISOString(),
  };

  if (engine === "heuristic") {
    return heuristicResult;
  }

  // Run Random Forest ML Model
  const mlResult = predictWithRandomForest({
    district,
    rainfall_3d: r3d,
    rainfall_7d: r7d,
    slope: actualSlope,
    elevation: actualElevation,
    road_distance: actualDistanceToRoad,
    soil_type: selectedSoil,
  });

  return {
    district,
    inputParameters: {
      rainfall3d: r3d,
      rainfall7d: r7d,
      slope: actualSlope,
      elevation: actualElevation,
      distanceToRoad: actualDistanceToRoad,
      soil_type: selectedSoil,
    },
    probability: mlResult.probability,
    riskClass: mlResult.riskClass,
    confidence: mlResult.confidence,
    factors: topFactors,
    topFactors: mlResult.topFactors,
    featureImportances: mlResult.featureImportances,
    engine: mlResult.engine,
    comparison: {
      mlProbability: mlResult.probability,
      heuristicProbability: heuristicResult.probability,
      variance: mlResult.probability - heuristicResult.probability,
    },
    metrics: mlResult.metrics,
    calculatedAt: new Date().toISOString(),
  };
}

export { getMLModelMetadata };
