/**
 * messageGenerator.js
 * Builds short SMS / WhatsApp-ready alert messages from a pipeline result.
 * Kept as plain string templates — no external messaging API required.
 */

function generateAlertMessage(pipelineResult, channel = "sms") {
  const { pipeline, summary } = pipelineResult;
  const { features } = pipeline.sensing;
  const { decision, urgency } = pipeline.action;

  const riskEmoji =
    summary.riskClass === "Critical"
      ? "🔴"
      : summary.riskClass === "High"
      ? "🟠"
      : summary.riskClass === "Moderate"
      ? "🟡"
      : "🟢";

  if (channel === "whatsapp") {
    return (
      `${riskEmoji} *LANDSLIDE EARLY WARNING* ${riskEmoji}\n` +
      `*District:* ${features.district} (${features.village})\n` +
      `*Risk Level:* ${summary.riskClass} — ${summary.probability}% probability\n` +
      `*Confidence:* ${summary.confidence}%\n` +
      `*Critical Road:* ${features.criticalRoad}\n` +
      `*Action:* ${decision.replace(/_/g, " ")}\n` +
      `*Urgency:* ${urgency}\n\n` +
      `Please follow instructions from local disaster management authorities. ` +
      `Avoid travel on ${features.criticalRoad} until further notice.\n\n` +
      `— Western Ghats Multi-Agent Landslide Early Warning System`
    );
  }

  // Default: SMS (kept short, <= ~320 chars, no markdown)
  return (
    `${riskEmoji} LANDSLIDE ALERT: ${features.district} (${features.village}). ` +
    `Risk: ${summary.riskClass} (${summary.probability}%). ` +
    `Action: ${decision.replace(/_/g, " ")}. ` +
    `Avoid ${features.criticalRoad}. Follow local DDMA instructions. ` +
    `-LEWS`
  );
}

module.exports = { generateAlertMessage };
