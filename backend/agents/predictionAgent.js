/**
 * Prediction Agent
 * ------------------------------------------------------------------
 * Responsibility: consume the cleaned feature object from the Sensing
 * Agent and run a transparent, weighted multi-factor risk model
 * (no external ML dependency — keeps the demo deterministic & reliable).
 * ------------------------------------------------------------------
 */

// Feature weights (must sum to 1.0) — tuned to reflect general landslide
// susceptibility literature: cumulative rainfall dominates, slope and
// saturation matter, elevation is a minor modifier.
const WEIGHTS = {
  rainfall7d: 0.32,
  rainfall3d: 0.28,
  slope: 0.2,
  soilSaturation: 0.15,
  elevation: 0.05
};

// Normalization ranges (min/max used to scale each raw feature to 0-100)
const RANGES = {
  rainfall3d: { min: 0, max: 350 }, // mm
  rainfall7d: { min: 0, max: 700 }, // mm
  slope: { min: 0, max: 60 }, // degrees
  soilSaturation: { min: 0, max: 100 }, // %
  elevation: { min: 0, max: 2200 } // meters (moderate elevations riskier than very high/low)
};

function normalize(value, min, max) {
  const v = Math.min(Math.max(value, min), max);
  return ((v - min) / (max - min)) * 100;
}

// Elevation risk is not linear: mid-elevation slopes (800-1500m) in the
// Western Ghats/NE hills see the most debris-flow activity. We use a
// triangular scoring curve peaking at 1150m.
function elevationRiskScore(elevation) {
  const peak = 1150;
  const spread = 1150;
  const distance = Math.abs(elevation - peak);
  const score = Math.max(0, 100 - (distance / spread) * 100);
  return score;
}

function computeRiskClass(probability) {
  if (probability >= 80) return "Critical";
  if (probability >= 60) return "High";
  if (probability >= 35) return "Moderate";
  return "Low";
}

/**
 * Confidence reflects how much data completeness / consistency backs the
 * prediction. In this rule-based demo it is derived from:
 *  - whether Sensing Agent had to apply defaults/warnings (lower confidence)
 *  - how far feature values sit from the "ambiguous middle" of their range
 *    (values near the extremes are easier to classify confidently)
 */
function computeConfidence(features, warningsCount) {
  const midAmbiguityPenalty = (value, min, max) => {
    const norm = normalize(value, min, max) / 100; // 0-1
    // distance from 0.5 (the most ambiguous point), scaled 0-1
    return Math.abs(norm - 0.5) * 2;
  };

  const clarityScores = [
    midAmbiguityPenalty(features.rainfall7d, RANGES.rainfall7d.min, RANGES.rainfall7d.max),
    midAmbiguityPenalty(features.rainfall3d, RANGES.rainfall3d.min, RANGES.rainfall3d.max),
    midAmbiguityPenalty(features.slope, RANGES.slope.min, RANGES.slope.max),
    midAmbiguityPenalty(features.soilSaturation, RANGES.soilSaturation.min, RANGES.soilSaturation.max)
  ];

  const avgClarity = clarityScores.reduce((a, b) => a + b, 0) / clarityScores.length;

  let confidence = 60 + avgClarity * 35; // base 60, up to +35 for clear-cut cases
  confidence -= warningsCount * 8; // penalize each data-quality warning
  confidence -= features.district === "Unknown" ? 15 : 0;

  return Math.round(Math.min(Math.max(confidence, 30), 97));
}

/**
 * @param {Object} sensingResult - output of runSensingAgent()
 * @returns {Object} prediction result
 */
function runPredictionAgent(sensingResult) {
  const { features } = sensingResult;
  const warningsCount = sensingResult.warnings ? sensingResult.warnings.length : 0;

  const scores = {
    rainfall3d: normalize(features.rainfall3d, RANGES.rainfall3d.min, RANGES.rainfall3d.max),
    rainfall7d: normalize(features.rainfall7d, RANGES.rainfall7d.min, RANGES.rainfall7d.max),
    slope: normalize(features.slope, RANGES.slope.min, RANGES.slope.max),
    soilSaturation: normalize(features.soilSaturation, RANGES.soilSaturation.min, RANGES.soilSaturation.max),
    elevation: elevationRiskScore(features.elevation)
  };

  const weightedContributions = Object.keys(WEIGHTS).map((key) => ({
    factor: key,
    rawScore: Math.round(scores[key] * 10) / 10,
    weight: WEIGHTS[key],
    contribution: Math.round(scores[key] * WEIGHTS[key] * 10) / 10
  }));

  const probabilityRaw = weightedContributions.reduce(
    (sum, c) => sum + c.contribution,
    0
  );
  const probability = Math.round(Math.min(Math.max(probabilityRaw, 0), 100));

  const riskClass = computeRiskClass(probability);
  const confidence = computeConfidence(features, warningsCount);

  const factorLabels = {
    rainfall3d: "3-Day Rainfall",
    rainfall7d: "7-Day Cumulative Rainfall",
    slope: "Slope Gradient",
    soilSaturation: "Soil Saturation",
    elevation: "Elevation Profile"
  };

  const topFactors = [...weightedContributions]
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, 3)
    .map((c) => ({
      factor: factorLabels[c.factor],
      key: c.factor,
      contributionPercent: Math.round((c.contribution / (probability || 1)) * 1000) / 10,
      rawScore: c.rawScore,
      weight: c.weight
    }));

  return {
    agent: "PredictionAgent",
    status: "success",
    timestamp: new Date().toISOString(),
    input: features,
    probability,
    riskClass,
    confidence,
    allFactors: weightedContributions.map((c) => ({
      factor: factorLabels[c.factor],
      key: c.factor,
      rawScore: c.rawScore,
      weight: c.weight,
      contribution: c.contribution
    })),
    topFactors
  };
}

module.exports = { runPredictionAgent, WEIGHTS, RANGES };
