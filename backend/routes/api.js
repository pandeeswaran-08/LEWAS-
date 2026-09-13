/**
 * api.js
 * Express router exposing the Multi-Agent LEWS backend to the frontend.
 *
 * Endpoints:
 *   GET  /api/health                        -> liveness check
 *   GET  /api/districts                     -> monitoring points (map + dashboard)
 *   GET  /api/districts/:id                 -> single monitoring point detail
 *   POST /api/predict                       -> run full 4-agent pipeline
 *   GET  /api/alerts                        -> recent alerts list
 *   POST /api/alerts/generate-message       -> SMS/WhatsApp text from a pipeline result
 *   GET  /api/knowledge/past-events         -> past landslide events (reference data)
 */

const express = require("express");
const router = express.Router();

const { MONITORING_POINTS, PAST_EVENTS } = require("../data/mockData");
const { runPipeline } = require("../orchestrator");
const { getAlerts, addAlert } = require("../data/alertsStore");
const { generateAlertMessage } = require("../utils/messageGenerator");

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "western-ghats-lews-backend",
    timestamp: new Date().toISOString()
  });
});

// ---------------------------------------------------------------------------
// Monitoring points (for Live Risk Map + Dashboard)
// ---------------------------------------------------------------------------
router.get("/districts", (req, res) => {
  res.json({ status: "success", data: MONITORING_POINTS });
});

router.get("/districts/:id", (req, res) => {
  const point = MONITORING_POINTS.find((p) => p.id === req.params.id);
  if (!point) {
    return res.status(404).json({ status: "error", message: "Monitoring point not found" });
  }
  res.json({ status: "success", data: point });
});

// ---------------------------------------------------------------------------
// Multi-agent prediction pipeline
// ---------------------------------------------------------------------------
router.post("/predict", (req, res) => {
  try {
    const rawInput = req.body || {};
    const result = runPipeline(rawInput);

    // Automatically log this run into the recent alerts feed so the
    // Alerts page and Dashboard reflect Studio activity.
    addAlert(result);

    res.json(result);
  } catch (err) {
    console.error("Pipeline error:", err);
    res.status(500).json({
      status: "error",
      message: "Pipeline execution failed",
      detail: err.message
    });
  }
});

// ---------------------------------------------------------------------------
// Alerts
// ---------------------------------------------------------------------------
router.get("/alerts", (req, res) => {
  res.json({ status: "success", data: getAlerts() });
});

router.post("/alerts/generate-message", (req, res) => {
  try {
    const { pipelineResult, channel } = req.body || {};
    if (!pipelineResult) {
      return res.status(400).json({
        status: "error",
        message: "pipelineResult (full /api/predict response) is required"
      });
    }
    const message = generateAlertMessage(pipelineResult, channel || "sms");
    res.json({ status: "success", channel: channel || "sms", message });
  } catch (err) {
    console.error("Message generation error:", err);
    res.status(500).json({
      status: "error",
      message: "Message generation failed",
      detail: err.message
    });
  }
});

// ---------------------------------------------------------------------------
// Knowledge base (used by Reasoning Agent, exposed for transparency/demo)
// ---------------------------------------------------------------------------
router.get("/knowledge/past-events", (req, res) => {
  res.json({ status: "success", data: PAST_EVENTS });
});

module.exports = router;
