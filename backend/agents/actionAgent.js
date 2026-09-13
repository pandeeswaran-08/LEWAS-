/**
 * Action Agent
 * ------------------------------------------------------------------
 * Responsibility: apply final decision rules on top of the Prediction
 * + Reasoning Agent outputs, and produce a clear, actionable decision
 * object for the frontend / alerting pipeline.
 *
 * Decision rules (as specified):
 *  - probability >= 80 AND confidence >= 75  -> RECOMMEND_AUTO_BROADCAST
 *  - probability >= 80 AND confidence < 75   -> MANUAL_OFFICER_REVIEW
 *  - else                                     -> ROUTINE_MONITORING
 * ------------------------------------------------------------------
 */

const DECISIONS = {
  RECOMMEND_AUTO_BROADCAST: {
    decision: "RECOMMEND_AUTO_BROADCAST",
    label: "Recommend Automatic Broadcast",
    urgency: "IMMEDIATE",
    color: "red"
  },
  MANUAL_OFFICER_REVIEW: {
    decision: "MANUAL_OFFICER_REVIEW",
    label: "Manual Officer Review Required",
    urgency: "HIGH",
    color: "orange"
  },
  ROUTINE_MONITORING: {
    decision: "ROUTINE_MONITORING",
    label: "Routine Monitoring",
    urgency: "LOW",
    color: "green"
  }
};

function buildRecommendedAction(decisionKey, predictionResult, reasoningResult) {
  const { input } = predictionResult;

  switch (decisionKey) {
    case "RECOMMEND_AUTO_BROADCAST":
      return `Auto-generate and dispatch a RED ALERT to all registered numbers in ${input.village} and along ${input.criticalRoad}. Notify DDMA ${input.district} control room and pre-position NDRF/SDRF immediately. Recommend evacuation of identified vulnerable habitations.`;
    case "MANUAL_OFFICER_REVIEW":
      return `Escalate to the duty officer at DDMA ${input.district} for manual verification before broadcast, since model confidence (${predictionResult.confidence}%) is below the auto-broadcast threshold. Officer should cross-check live rain-gauge/slope-sensor data and local field reports before issuing an alert.`;
    default:
      return `Continue routine monitoring for ${input.village}, ${input.district}. No immediate public alert required. Re-run prediction if rainfall intensifies or new sensor data arrives.`;
  }
}

/**
 * @param {Object} predictionResult - output of runPredictionAgent()
 * @param {Object} reasoningResult - output of runReasoningAgent()
 * @returns {Object} action/decision result
 */
function runActionAgent(predictionResult, reasoningResult) {
  const { probability, confidence } = predictionResult;

  let decisionKey;
  if (probability >= 80 && confidence >= 75) {
    decisionKey = "RECOMMEND_AUTO_BROADCAST";
  } else if (probability >= 80 && confidence < 75) {
    decisionKey = "MANUAL_OFFICER_REVIEW";
  } else {
    decisionKey = "ROUTINE_MONITORING";
  }

  const decisionMeta = DECISIONS[decisionKey];
  const recommendedAction = buildRecommendedAction(decisionKey, predictionResult, reasoningResult);

  return {
    agent: "ActionAgent",
    status: "success",
    timestamp: new Date().toISOString(),
    decision: decisionMeta.decision,
    label: decisionMeta.label,
    urgency: decisionMeta.urgency,
    color: decisionMeta.color,
    recommendedAction,
    triggerRule:
      decisionKey === "RECOMMEND_AUTO_BROADCAST"
        ? "probability >= 80 AND confidence >= 75"
        : decisionKey === "MANUAL_OFFICER_REVIEW"
        ? "probability >= 80 AND confidence < 75"
        : "probability < 80 (default)",
    sopRecommendations: reasoningResult.sopRecommendations
  };
}

module.exports = { runActionAgent, DECISIONS };
