/**
 * Orchestrator
 * ------------------------------------------------------------------
 * Runs the 4-agent pipeline in sequence:
 *   raw input -> Sensing -> Prediction -> Reasoning -> Action
 * and returns a single combined result object, plus a step-by-step
 * trace that the frontend "Multi-Agent Studio" page can render.
 * ------------------------------------------------------------------
 */

const { runSensingAgent } = require("./agents/sensingAgent");
const { runPredictionAgent } = require("./agents/predictionAgent");
const { runReasoningAgent } = require("./agents/reasoningAgent");
const { runActionAgent } = require("./agents/actionAgent");

/**
 * @param {Object} rawInput - user/API supplied input (district, rainfall, etc.)
 * @returns {Object} full pipeline result
 */
function runPipeline(rawInput = {}) {
  const startedAt = Date.now();

  // Step 1 — Sensing
  const sensingResult = runSensingAgent(rawInput);

  // Step 2 — Prediction
  const predictionResult = runPredictionAgent(sensingResult);

  // Step 3 — Reasoning
  const reasoningResult = runReasoningAgent(predictionResult);

  // Step 4 — Action
  const actionResult = runActionAgent(predictionResult, reasoningResult);

  const durationMs = Date.now() - startedAt;

  return {
    status: "success",
    runId: `run_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    generatedAt: new Date().toISOString(),
    durationMs,
    pipeline: {
      sensing: sensingResult,
      prediction: predictionResult,
      reasoning: reasoningResult,
      action: actionResult
    },
    // Convenience flattened summary for quick-glance UI widgets
    summary: {
      district: sensingResult.features.district,
      village: sensingResult.features.village,
      probability: predictionResult.probability,
      riskClass: predictionResult.riskClass,
      confidence: predictionResult.confidence,
      decision: actionResult.decision,
      urgency: actionResult.urgency
    }
  };
}

module.exports = { runPipeline };
