/**
 * Sensing Agent
 * ------------------------------------------------------------------
 * Responsibility: collect raw input (from API request or a monitoring
 * point lookup), validate & clean it, fill in sane defaults for any
 * missing fields, and hand back a normalized "features" object that
 * every downstream agent can rely on.
 * ------------------------------------------------------------------
 */

const { MONITORING_POINTS } = require("../data/mockData");

const DEFAULTS = {
  rainfall3d: 50,
  rainfall7d: 120,
  slope: 25,
  elevation: 800,
  soilSaturation: 50, // percent, 0-100
  soilType: "Unknown"
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function toNumberOrDefault(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * @param {Object} rawInput
 *  {
 *    district: string,
 *    village?: string,
 *    rainfall3d?: number,   // mm
 *    rainfall7d?: number,   // mm
 *    slope?: number,        // degrees
 *    elevation?: number,    // meters
 *    soilSaturation?: number // 0-100 %
 *  }
 * @returns {Object} cleaned feature object + metadata about the run
 */
function runSensingAgent(rawInput = {}) {
  const warnings = [];

  if (!rawInput.district) {
    warnings.push("No district supplied — defaulting to 'Wayanad'.");
  }
  const district = rawInput.district || "Wayanad";

  // Try to match a known monitoring point for richer context (village,
  // critical road, geo-coords, baseline soil type) — falls back to the
  // first point in that district, or a generic unknown point.
  const matchedPoint =
    MONITORING_POINTS.find(
      (p) =>
        p.district.toLowerCase() === district.toLowerCase() &&
        (!rawInput.village ||
          p.village.toLowerCase() === String(rawInput.village).toLowerCase())
    ) ||
    MONITORING_POINTS.find(
      (p) => p.district.toLowerCase() === district.toLowerCase()
    );

  if (!matchedPoint) {
    warnings.push(
      `District '${district}' not found in monitoring network — using generic defaults.`
    );
  }

  const rainfall3d = clamp(
    toNumberOrDefault(
      rawInput.rainfall3d,
      matchedPoint ? matchedPoint.baseRainfall3d : DEFAULTS.rainfall3d
    ),
    0,
    1000
  );

  const rainfall7d = clamp(
    toNumberOrDefault(
      rawInput.rainfall7d,
      matchedPoint ? matchedPoint.baseRainfall7d : DEFAULTS.rainfall7d
    ),
    0,
    2000
  );

  if (rainfall7d < rainfall3d) {
    warnings.push(
      "7-day rainfall was lower than 3-day rainfall input — values swapped for consistency."
    );
  }

  const slope = clamp(
    toNumberOrDefault(
      rawInput.slope,
      matchedPoint ? matchedPoint.slope : DEFAULTS.slope
    ),
    0,
    90
  );

  const elevation = clamp(
    toNumberOrDefault(
      rawInput.elevation,
      matchedPoint ? matchedPoint.elevation : DEFAULTS.elevation
    ),
    0,
    9000
  );

  const soilSaturation = clamp(
    toNumberOrDefault(rawInput.soilSaturation, DEFAULTS.soilSaturation),
    0,
    100
  );

  const cleanedFeatures = {
    district: matchedPoint ? matchedPoint.district : district,
    state: matchedPoint ? matchedPoint.state : "Unknown",
    village: matchedPoint ? matchedPoint.village : rawInput.village || "N/A",
    criticalRoad: matchedPoint ? matchedPoint.criticalRoad : "N/A",
    lat: matchedPoint ? matchedPoint.lat : null,
    lng: matchedPoint ? matchedPoint.lng : null,
    rainfall3d: Math.round(rainfall3d * 10) / 10,
    rainfall7d: Math.round(rainfall7d * 10) / 10,
    slope: Math.round(slope * 10) / 10,
    elevation: Math.round(elevation),
    soilSaturation: Math.round(soilSaturation),
    soilType: matchedPoint ? matchedPoint.soilType : DEFAULTS.soilType
  };

  return {
    agent: "SensingAgent",
    status: "success",
    timestamp: new Date().toISOString(),
    warnings,
    features: cleanedFeatures
  };
}

module.exports = { runSensingAgent };
