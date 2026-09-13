/**
 * alertsStore.js
 * Simple in-memory store of "recent alerts", seeded at server startup by
 * running the pipeline once for each monitoring point. New alerts (e.g.
 * generated from the Multi-Agent Studio "Run Pipeline" action) can be
 * pushed here too, so the Alerts page has something dynamic to show.
 *
 * This is intentionally in-memory (no DB) to keep the demo dependency-free.
 * Restarting the server resets the list back to the seeded baseline.
 */

const { MONITORING_POINTS } = require("./mockData");
const { runPipeline } = require("../orchestrator");

let alerts = [];

function seedAlerts() {
  alerts = MONITORING_POINTS.map((point, idx) => {
    const result = runPipeline({
      district: point.district,
      village: point.village
    });

    return {
      id: `seed_${idx}_${point.id}`,
      createdAt: new Date(Date.now() - idx * 1000 * 60 * 37).toISOString(), // stagger times
      district: result.summary.district,
      village: result.summary.village,
      state: point.state,
      criticalRoad: point.criticalRoad,
      probability: result.summary.probability,
      riskClass: result.summary.riskClass,
      confidence: result.summary.confidence,
      decision: result.summary.decision,
      urgency: result.summary.urgency,
      lat: point.lat,
      lng: point.lng
    };
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function getAlerts() {
  return alerts;
}

function addAlert(pipelineResult) {
  const { summary, pipeline } = pipelineResult;
  const { features } = pipeline.sensing;

  const newAlert = {
    id: pipelineResult.runId,
    createdAt: pipelineResult.generatedAt,
    district: summary.district,
    village: summary.village,
    state: features.state,
    criticalRoad: features.criticalRoad,
    probability: summary.probability,
    riskClass: summary.riskClass,
    confidence: summary.confidence,
    decision: summary.decision,
    urgency: summary.urgency,
    lat: features.lat,
    lng: features.lng
  };

  alerts.unshift(newAlert);
  // Keep the list bounded for a tidy demo
  alerts = alerts.slice(0, 50);
  return newAlert;
}

// Seed on module load
seedAlerts();

module.exports = { getAlerts, addAlert, seedAlerts };
