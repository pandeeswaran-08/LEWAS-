/**
 * Autonomous Rule-Based Early Warning Agent Service.
 *
 * Decision Rule:
 * - If probability >= 80 AND confidence >= 75:
 *     Recommend immediate automated alert broadcast without awaiting manual officer clearance.
 * - Otherwise:
 *     Require manual confirmation or routine monitoring.
 *
 * Provides transparent reasoning text for all agentic decisions.
 */

import { AGENT_RULES } from "../config/constants.js";

// In-memory telemetry and operational metrics for the agent
const agentState = {
  status: "ONLINE",
  mode: "AUTONOMOUS_RULE_BASED",
  startedAt: new Date().toISOString(),
  metrics: {
    totalEvaluations: 0,
    autoAlertsRecommended: 0,
    manualReviewsRecommended: 0,
    routineMonitoringCount: 0,
    lastEvaluatedAt: null,
  },
  activeRules: [
    {
      id: "RULE_01_AUTO_BROADCAST",
      condition: "probability >= 80 AND confidence >= 75",
      action: "RECOMMEND_AUTO_BROADCAST",
      urgency: "CRITICAL",
      description:
        "Triggers immediate automatic SMS and public siren alert broadcast when disaster probability and sensor confidence breach critical thresholds.",
    },
    {
      id: "RULE_02_DUTY_OFFICER_REVIEW",
      condition: "probability >= 55 OR (probability >= 80 AND confidence < 75)",
      action: "MANUAL_OFFICER_REVIEW",
      urgency: "HIGH",
      description:
        "Routes elevated risk cases to the emergency operations desk for rapid human verification before public dispatch.",
    },
    {
      id: "RULE_03_STANDARD_WATCH",
      condition: "probability < 55",
      action: "ROUTINE_MONITORING",
      urgency: "NORMAL",
      description:
        "Maintains regular 15-minute sensor polling and background heuristic checks.",
    },
  ],
};

/**
 * Evaluates prediction metrics against the agent rules and generates reasoning.
 *
 * @param {Object} params
 * @param {number} params.probability - Landslide probability (0-100)
 * @param {number} params.confidence - Model confidence (0-100)
 * @param {string} params.district - Monitored district
 * @param {number} [params.rainfall3d] - 3-day rainfall
 * @param {number} [params.rainfall7d] - 7-day rainfall
 * @param {string} [params.riskClass] - Classified risk level
 * @param {Array} [params.topFactors] - Top driving hazard factors
 * @returns {Object} Agent decision object containing recommendation, action, and reasoning text.
 */
export function evaluateAgentDecision({
  probability,
  confidence,
  district = "Western Ghats",
  rainfall3d = 0,
  rainfall7d = 0,
  riskClass = "Moderate",
  topFactors = [],
}) {
  agentState.metrics.totalEvaluations += 1;
  agentState.metrics.lastEvaluatedAt = new Date().toISOString();

  const isProbBreached = probability >= AGENT_RULES.AUTO_ALERT_PROBABILITY_MIN; // 80
  const isConfBreached = confidence >= AGENT_RULES.AUTO_ALERT_CONFIDENCE_MIN;   // 75

  let recommendAutoAlert = false;
  let action = "ROUTINE_MONITORING";
  let urgency = "NORMAL";
  let reasoning = "";

  // ─── Core Agent Rule Evaluation ──────────────────────────────────────────
  if (isProbBreached && isConfBreached) {
    // CRITICAL CONDITION: High probability AND sufficient model confidence
    recommendAutoAlert = true;
    action = "RECOMMEND_AUTO_BROADCAST";
    urgency = "CRITICAL";
    agentState.metrics.autoAlertsRecommended += 1;

    const primaryDriver = topFactors[0]?.factor || "Extreme cumulative rainfall";
    reasoning =
      `CRITICAL AUTOMATION TRIGGER ACTIVATED: The predicted landslide probability (${probability}%) ` +
      `equals or exceeds the critical cut-off threshold (${AGENT_RULES.AUTO_ALERT_PROBABILITY_MIN}%), ` +
      `and model confidence (${confidence}%) meets the required confidence floor (${AGENT_RULES.AUTO_ALERT_CONFIDENCE_MIN}%). ` +
      `Primary risk driver is "${primaryDriver}" in ${district} with cumulative rainfall reaching ` +
      `${rainfall3d} mm (3-day) and ${rainfall7d} mm (7-day). ` +
      `Autonomous early warning dispatch (SMS/Siren) is STRONGLY RECOMMENDED to preserve human life without waiting for manual clearance.`;
  } else if (isProbBreached && !isConfBreached) {
    // High probability BUT lower sensor confidence -> require officer confirmation
    recommendAutoAlert = false;
    action = "MANUAL_OFFICER_REVIEW";
    urgency = "HIGH";
    agentState.metrics.manualReviewsRecommended += 1;

    reasoning =
      `MANUAL CONFIRMATION REQUIRED: Landslide probability is critical (${probability}% >= ${AGENT_RULES.AUTO_ALERT_PROBABILITY_MIN}%), ` +
      `however model confidence is only ${confidence}%, which is below the autonomous dispatch threshold (${AGENT_RULES.AUTO_ALERT_CONFIDENCE_MIN}%). ` +
      `Possible sensor noise or conflicting telemetry detected. An on-duty officer must inspect live rain gauges before broadcasting alerts.`;
  } else if (probability >= 55) {
    // Elevated warning
    recommendAutoAlert = false;
    action = "MANUAL_OFFICER_REVIEW";
    urgency = "MODERATE_HIGH";
    agentState.metrics.manualReviewsRecommended += 1;

    reasoning =
      `ELEVATED RISK NOTED: Predicted probability is ${probability}% (Risk Class: ${riskClass}) with ${confidence}% confidence. ` +
      `Conditions do not satisfy the automatic broadcast criteria (probability >= 80% AND confidence >= 75%). ` +
      `District disaster management teams are advised to monitor slope sensors and prepare response units.`;
  } else {
    // Normal watch
    recommendAutoAlert = false;
    action = "ROUTINE_MONITORING";
    urgency = "LOW";
    agentState.metrics.routineMonitoringCount += 1;

    reasoning =
      `STANDARD MONITORING STATE: Predicted landslide probability is ${probability}% (confidence: ${confidence}%). ` +
      `All hydrometeorological indices remain within safe parameters. Routine sensor telemetry polling continues every 15 minutes.`;
  }

  return {
    recommendAutoAlert,
    action,
    urgency,
    evaluatedRules: [
      `Probability Check: ${probability}% >= ${AGENT_RULES.AUTO_ALERT_PROBABILITY_MIN}% -> ${isProbBreached ? "PASSED" : "FAILED"}`,
      `Confidence Check: ${confidence}% >= ${AGENT_RULES.AUTO_ALERT_CONFIDENCE_MIN}% -> ${isConfBreached ? "PASSED" : "FAILED"}`,
    ],
    reasoning,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Returns operational health, active rules, and runtime metrics for the agent.
 */
export function getAgentStatus() {
  const uptimeSeconds = Math.round(
    (Date.now() - new Date(agentState.startedAt).getTime()) / 1000
  );

  return {
    status: agentState.status,
    mode: agentState.mode,
    uptimeSeconds,
    startedAt: agentState.startedAt,
    thresholds: AGENT_RULES,
    metrics: agentState.metrics,
    activeRules: agentState.activeRules,
  };
}
