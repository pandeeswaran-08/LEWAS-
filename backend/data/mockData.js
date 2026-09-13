/**
 * mockData.js
 * Realistic static mock data used across the agents and API routes.
 * No external DB required — keeps the demo self-contained and reliable.
 */

// ---------------------------------------------------------------------------
// Monitoring points (districts / villages / critical roads)
// ---------------------------------------------------------------------------
const MONITORING_POINTS = [
  {
    id: "wayanad-chooralmala",
    district: "Wayanad",
    state: "Kerala",
    village: "Chooralmala",
    criticalRoad: "Chooralmala - Mundakkai Road",
    lat: 11.4870,
    lng: 76.1440,
    elevation: 1100,
    slope: 38,
    soilType: "Lateritic, low cohesion",
    baseRainfall3d: 210,
    baseRainfall7d: 480,
    historicalRisk: "Critical"
  },
  {
    id: "wayanad-meppadi",
    district: "Wayanad",
    state: "Kerala",
    village: "Meppadi",
    criticalRoad: "Meppadi - Vythiri Road",
    lat: 11.5460,
    lng: 76.1330,
    elevation: 950,
    slope: 29,
    soilType: "Lateritic",
    baseRainfall3d: 140,
    baseRainfall7d: 320,
    historicalRisk: "High"
  },
  {
    id: "idukki-pettimudi",
    district: "Idukki",
    state: "Kerala",
    village: "Pettimudi",
    criticalRoad: "Rajamala - Pettimudi Estate Road",
    lat: 10.1190,
    lng: 77.1330,
    elevation: 1450,
    slope: 42,
    soilType: "Weathered gneiss, shallow soil",
    baseRainfall3d: 190,
    baseRainfall7d: 410,
    historicalRisk: "Critical"
  },
  {
    id: "idukki-munnar",
    district: "Idukki",
    state: "Kerala",
    village: "Munnar",
    criticalRoad: "Munnar - Top Station Road",
    lat: 10.0889,
    lng: 77.0595,
    elevation: 1600,
    slope: 25,
    soilType: "Rocky, moderate cohesion",
    baseRainfall3d: 95,
    baseRainfall7d: 210,
    historicalRisk: "Moderate"
  },
  {
    id: "nilgiris-coonoor",
    district: "Nilgiris",
    state: "Tamil Nadu",
    village: "Coonoor",
    criticalRoad: "Coonoor - Kotagiri Ghat Road",
    lat: 11.3530,
    lng: 76.7960,
    elevation: 1850,
    slope: 33,
    soilType: "Lateritic, forested",
    baseRainfall3d: 120,
    baseRainfall7d: 260,
    historicalRisk: "High"
  },
  {
    id: "nilgiris-gudalur",
    district: "Nilgiris",
    state: "Tamil Nadu",
    village: "Gudalur",
    criticalRoad: "Gudalur - Devala Road",
    lat: 11.5010,
    lng: 76.4950,
    elevation: 1020,
    slope: 27,
    soilType: "Clayey loam",
    baseRainfall3d: 80,
    baseRainfall7d: 175,
    historicalRisk: "Moderate"
  },
  {
    id: "manipur-tamenglong",
    district: "Tamenglong",
    state: "Manipur",
    village: "Tamenglong Town",
    criticalRoad: "Tamenglong - Haflong Road (NH-137)",
    lat: 24.9950,
    lng: 93.5030,
    elevation: 1330,
    slope: 31,
    soilType: "Sandy loam, steep cut slopes",
    baseRainfall3d: 100,
    baseRainfall7d: 230,
    historicalRisk: "Moderate"
  },
  {
    id: "manipur-ukhrul",
    district: "Ukhrul",
    state: "Manipur",
    village: "Ukhrul Town",
    criticalRoad: "Ukhrul - Kamjong Road",
    lat: 25.0480,
    lng: 94.3630,
    elevation: 1690,
    slope: 36,
    soilType: "Weathered shale",
    baseRainfall3d: 70,
    baseRainfall7d: 150,
    historicalRisk: "Low"
  }
];

// ---------------------------------------------------------------------------
// Past landslide events — used by the Reasoning Agent for similarity matching
// ---------------------------------------------------------------------------
const PAST_EVENTS = [
  {
    name: "Chooralmala–Mundakkai Landslide",
    year: 2024,
    location: "Chooralmala, Wayanad, Kerala",
    rainfall3d: 572,
    rainfall7d: 705,
    slope: 38,
    deaths: "200+",
    summary:
      "Multiple debris flows triggered by extremely intense rainfall over Iruvazhinji river catchment, wiping out large parts of Chooralmala and Mundakkai villages.",
    keyLesson:
      "Extreme short-duration rainfall on already-saturated steep slopes with weak lateritic soil can trigger sudden catastrophic debris flow with very little warning time."
  },
  {
    name: "Pettimudi Landslide",
    year: 2020,
    location: "Pettimudi, Rajamala, Idukki, Kerala",
    rainfall3d: 260,
    rainfall7d: 440,
    slope: 42,
    deaths: "70+",
    summary:
      "A tea-estate labour settlement built on a historically unstable slope was buried after days of continuous monsoon rainfall saturated the hillside.",
    keyLesson:
      "Settlements on legacy unstable slopes are at elevated risk even at moderate-to-high (not extreme) rainfall totals if soil is already saturated from prior days."
  },
  {
    name: "Kavalappara Landslide",
    year: 2019,
    location: "Kavalappara, Malappuram, Kerala",
    rainfall3d: 300,
    rainfall7d: 550,
    slope: 35,
    deaths: "50+",
    summary:
      "A hillside collapsed and buried a hamlet after sustained heavy rainfall across the region during the August 2019 monsoon spell.",
    keyLesson:
      "Prolonged 7-day cumulative rainfall is often a stronger precursor signal than a single extreme-rainfall day."
  }
];

// ---------------------------------------------------------------------------
// Standard Operating Procedures / knowledge snippets for the Reasoning Agent
// ---------------------------------------------------------------------------
const SOP_KNOWLEDGE = {
  Critical: [
    "Immediate evacuation of identified vulnerable habitations within the risk zone.",
    "Activate District Disaster Management Authority (DDMA) control room and NDRF/SDRF standby.",
    "Close and barricade critical roads identified as high-risk corridors.",
    "Issue Red Alert via SMS, cell broadcast, and local sirens."
  ],
  High: [
    "Pre-position NDRF/SDRF teams and relief material near vulnerable zones.",
    "Advise at-risk households to prepare for possible evacuation on short notice.",
    "Increase monitoring frequency of rain gauges and slope sensors to hourly.",
    "Issue Orange Alert to district administration and local panchayats."
  ],
  Moderate: [
    "Continue routine monitoring of rainfall and slope indicators.",
    "Alert local disaster management volunteers to remain on standby.",
    "Advise caution to residents and travellers on known vulnerable stretches.",
    "Issue Yellow Alert as an informational advisory."
  ],
  Low: [
    "Maintain routine sensor and rainfall monitoring.",
    "No special action required beyond standard seasonal preparedness.",
    "Log observation for trend analysis."
  ]
};

module.exports = {
  MONITORING_POINTS,
  PAST_EVENTS,
  SOP_KNOWLEDGE
};
