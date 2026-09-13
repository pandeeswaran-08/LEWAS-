/**
 * Reasoning Agent
 * ------------------------------------------------------------------
 * Responsibility: take the Prediction Agent's output and enrich it
 * with human-readable explanation, relevant SOP guidance, and a
 * similarity comparison against known historical landslide events.
 *
 * Deliberately RULE + TEMPLATE based (no external LLM / vector DB)
 * so the demo is 100% deterministic and never fails or times out.
 * ------------------------------------------------------------------
 */

const { PAST_EVENTS, SOP_KNOWLEDGE } = require("../data/mockData");

/**
 * Simple normalized-distance similarity between the current event's
 * rainfall/slope profile and each past event. Returns 0-100 (%).
 */
function computeSimilarity(features, pastEvent) {
  const dims = [
    { key: "rainfall3d", range: 350 },
    { key: "rainfall7d", range: 700 },
    { key: "slope", range: 60 }
  ];

  const distances = dims.map((d) => {
    const a = features[d.key];
    const b = pastEvent[d.key];
    return Math.abs(a - b) / d.range;
  });

  const avgDistance = distances.reduce((sum, d) => sum + d, 0) / distances.length;
  const similarity = Math.max(0, 100 - avgDistance * 100);
  return Math.round(similarity);
}

function buildNarrative(predictionResult, mostSimilarEvent, similarityScore) {
  const { probability, riskClass, confidence, topFactors, input } = predictionResult;
  const topFactorNames = topFactors.map((f) => f.factor).join(", ");

  let opening;
  switch (riskClass) {
    case "Critical":
      opening = `The multi-factor model estimates a CRITICAL landslide probability of ${probability}% for ${input.village}, ${input.district}.`;
      break;
    case "High":
      opening = `The model flags a HIGH landslide probability of ${probability}% for ${input.village}, ${input.district}.`;
      break;
    case "Moderate":
      opening = `The model indicates a MODERATE landslide probability of ${probability}% for ${input.village}, ${input.district}.`;
      break;
    default:
      opening = `The model indicates a LOW landslide probability of ${probability}% for ${input.village}, ${input.district}.`;
  }

  const driverSentence = `This is primarily driven by ${topFactorNames}, based on inputs of ${input.rainfall3d}mm (3-day) and ${input.rainfall7d}mm (7-day) rainfall on a ${input.slope}° slope at ${input.elevation}m elevation.`;

  const confidenceSentence =
    confidence >= 75
      ? `Model confidence is HIGH (${confidence}%), meaning the input data is clear and consistent enough to support this estimate strongly.`
      : confidence >= 55
      ? `Model confidence is MODERATE (${confidence}%) — the estimate is usable but would benefit from additional ground-truthing (e.g. field slope sensors, updated rain-gauge readings).`
      : `Model confidence is LOW (${confidence}%) — treat this estimate cautiously and prioritize gathering more reliable field data before acting on it alone.`;

  let historicalSentence;
  if (similarityScore >= 70) {
    historicalSentence = `Current conditions show a STRONG resemblance (${similarityScore}% similarity) to the ${mostSimilarEvent.name} (${mostSimilarEvent.year}), where ${mostSimilarEvent.summary} Key lesson: ${mostSimilarEvent.keyLesson}`;
  } else if (similarityScore >= 40) {
    historicalSentence = `Conditions show a MODERATE resemblance (${similarityScore}% similarity) to the ${mostSimilarEvent.name} (${mostSimilarEvent.year}). Key lesson from that event: ${mostSimilarEvent.keyLesson}`;
  } else {
    historicalSentence = `Conditions do not closely resemble any major historical event in the reference database (closest match: ${mostSimilarEvent.name}, ${mostSimilarEvent.year}, at ${similarityScore}% similarity), suggesting this profile is comparatively less extreme.`;
  }

  return [opening, driverSentence, confidenceSentence, historicalSentence].join(" ");
}

/**
 * @param {Object} predictionResult - output of runPredictionAgent()
 * @returns {Object} reasoning result
 */
function runReasoningAgent(predictionResult) {
  const { input } = predictionResult;

  const similarities = PAST_EVENTS.map((event) => ({
    event,
    similarity: computeSimilarity(input, event)
  })).sort((a, b) => b.similarity - a.similarity);

  const mostSimilar = similarities[0];

  const explanation = buildNarrative(predictionResult, mostSimilar.event, mostSimilar.similarity);

  const sopActions = SOP_KNOWLEDGE[predictionResult.riskClass] || SOP_KNOWLEDGE.Low;

  return {
    agent: "ReasoningAgent",
    status: "success",
    timestamp: new Date().toISOString(),
    explanation,
    similarEvents: similarities.map((s) => ({
      name: s.event.name,
      year: s.event.year,
      location: s.event.location,
      similarity: s.similarity,
      keyLesson: s.event.keyLesson
    })),
    mostSimilarEvent: {
      name: mostSimilar.event.name,
      year: mostSimilar.event.year,
      similarity: mostSimilar.similarity
    },
    sopRecommendations: sopActions
  };
}

module.exports = { runReasoningAgent };
