/**
 * Domain constants, weights, thresholds, and agent configuration.
 */

// Heuristic model weights for Western Ghats landslide susceptibility
export const FEATURE_WEIGHTS = {
  rainfall3d: 0.30,
  rainfall7d: 0.22,
  slope: 0.24,
  elevation: 0.12,
  distanceToRoad: 0.12,
};

// Hazard thresholds for key trigger features
export const THRESHOLDS = {
  rainfall3d: 200,      // mm over 72 hours (IMD Red-Alert trigger)
  rainfall7d: 400,      // mm antecedent rainfall (soil saturation trigger)
  slope: 28,            // degrees (steep slope initiation threshold)
  elevation: 900,       // meters above sea level
  distanceToRoad: 250,  // meters (cut-slope vulnerability buffer)
};

// District terrain baselines for representative estimations
export const DISTRICT_DEFAULTS = {
  Wayanad: {
    slope: 35,
    elevation: 1050,
    distanceToRoad: 200,
    multiplier: 1.12,
  },
  Idukki: {
    slope: 33,
    elevation: 1400,
    distanceToRoad: 250,
    multiplier: 1.08,
  },
  Nilgiris: {
    slope: 30,
    elevation: 1800,
    distanceToRoad: 180,
    multiplier: 1.05,
  },
  Senapati: {
    slope: 26,
    elevation: 850,
    distanceToRoad: 300,
    multiplier: 0.96,
  },
  Churachandpur: {
    slope: 25,
    elevation: 900,
    distanceToRoad: 320,
    multiplier: 0.94,
  },
};

// Agent Decision Thresholds
// If probability >= 80 and confidence >= 75 -> recommend auto alert
export const AGENT_RULES = {
  AUTO_ALERT_PROBABILITY_MIN: 80,
  AUTO_ALERT_CONFIDENCE_MIN: 75,
};

// Sentinel Hub API Configuration for Live Sentinel-1/2 Earth Observation Ingestion
export const SENTINEL_HUB_CONFIG = {
  CLIENT_ID: process.env.SENTINEL_CLIENT_ID || "",
  CLIENT_SECRET: process.env.SENTINEL_CLIENT_SECRET || "",
  BASE_URL: "https://services.sentinel-hub.com",
  AUTH_TOKEN_URL: "https://services.sentinel-hub.com/oauth/token",
  SUPPORTED_SENSORS: ["Sentinel-1A SAR (C-band)", "Sentinel-2 MSI (Multispectral)"],
  PITCH_STATEMENT: "Architecture supports live Sentinel-1/2 via Sentinel Hub API",
};

// Groq Cloud LLM Configuration (Active LPU models)
export const GROQ_CONFIG = {
  API_KEY: process.env.GROQ_API_KEY || "",
  MODEL: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
  FALLBACK_MODEL: "openai/gpt-oss-20b",
  API_URL: "https://api.groq.com/openai/v1/chat/completions",
  TIMEOUT_MS: 3000,
};

