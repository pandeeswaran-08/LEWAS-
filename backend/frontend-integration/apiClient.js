/**
 * apiClient.js
 * ---------------------------------------------------------------
 * Drop this file into your React app (e.g. src/api/apiClient.js)
 * to talk to the Western Ghats LEWS backend.
 *
 * Usage:
 *   import { runPrediction, getDistricts, getAlerts, generateMessage } from "./api/apiClient";
 *
 *   const result = await runPrediction({ district: "Wayanad", rainfall3d: 210, rainfall7d: 480 });
 *   console.log(result.pipeline.action.decision);
 * ---------------------------------------------------------------
 */

// Set this to your backend URL. During local dev with Vite, you can also
// add a proxy in vite.config.js instead of hardcoding localhost:5000.
export const API_BASE_URL =
  import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Request failed: ${res.status}`);
  }
  return data;
}

/** GET /api/health */
export function checkHealth() {
  return request("/health");
}

/** GET /api/districts — all monitoring points (for map + dashboard) */
export function getDistricts() {
  return request("/districts").then((r) => r.data);
}

/** GET /api/districts/:id — single monitoring point */
export function getDistrictById(id) {
  return request(`/districts/${id}`).then((r) => r.data);
}

/**
 * POST /api/predict — run the full 4-agent pipeline.
 * @param {{district:string, village?:string, rainfall3d?:number, rainfall7d?:number, slope?:number, elevation?:number, soilSaturation?:number}} input
 */
export function runPrediction(input) {
  return request("/predict", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

/** GET /api/alerts — recent alerts feed */
export function getAlerts() {
  return request("/alerts").then((r) => r.data);
}

/**
 * POST /api/alerts/generate-message — build an SMS/WhatsApp message
 * @param {Object} pipelineResult - the full object returned by runPrediction()
 * @param {"sms"|"whatsapp"} channel
 */
export function generateMessage(pipelineResult, channel = "sms") {
  return request("/alerts/generate-message", {
    method: "POST",
    body: JSON.stringify({ pipelineResult, channel })
  }).then((r) => r.message);
}

/** GET /api/knowledge/past-events — historical landslide reference data */
export function getPastEvents() {
  return request("/knowledge/past-events").then((r) => r.data);
}
