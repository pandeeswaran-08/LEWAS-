/**
 * Groq Cloud LLM Service for Landslide Early Warning System.
 * Powered by LLaMA 3.3 70B Versatile / LLaMA 3.1 8B via Groq's high-speed inference engine.
 *
 * Capabilities:
 * 1. Deep geotechnical failure mechanism analysis & explainability.
 * 2. Automated emergency Standard Operating Procedure (SOP) generation.
 * 3. Trilingual emergency broadcast alerts (English, Malayalam, Tamil).
 * 4. Graceful offline fallback if API network is unreachable.
 */

import { GROQ_CONFIG } from "../config/constants.js";

// Telemetry tracker for Groq inference calls
const groqStats = {
  totalCalls: 0,
  successfulCalls: 0,
  fallbackCalls: 0,
  lastUsedModel: null,
  lastInferenceDurationMs: 0,
  lastStatus: "IDLE",
};

/**
 * Calls Groq Cloud chat completion API using native fetch.
 *
 * @param {Array} messages - Chat completion messages array
 * @param {Object} options - Custom parameters (temperature, model, jsonMode)
 * @returns {Promise<string>} LLM response content
 */
async function callGroqChat(messages, options = {}) {
  const apiKey = process.env.GROQ_API_KEY || GROQ_CONFIG.API_KEY;
  const model = options.model || process.env.GROQ_MODEL || GROQ_CONFIG.MODEL;

  if (!apiKey || apiKey === "your_groq_api_key_here") {
    throw new Error("GROQ_API_KEY is not configured.");
  }

  const startTime = Date.now();
  groqStats.totalCalls += 1;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), GROQ_CONFIG.TIMEOUT_MS || 5000);

  try {
    const payload = {
      model,
      messages,
      temperature: options.temperature ?? 0.2,
      max_tokens: options.max_tokens ?? 900,
    };

    if (options.jsonMode) {
      payload.response_format = { type: "json_object" };
    }

    const response = await fetch(GROQ_CONFIG.API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API returned ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    groqStats.successfulCalls += 1;
    groqStats.lastUsedModel = model;
    groqStats.lastInferenceDurationMs = Date.now() - startTime;
    groqStats.lastStatus = "READY";

    return content;
  } catch (error) {
    clearTimeout(timeoutId);
    groqStats.fallbackCalls += 1;
    groqStats.lastStatus = `ERROR: ${error.message}`;
    throw error;
  }
}

/**
 * Generates an in-depth geotechnical AI briefing for the Landslide Early Warning System.
 *
 * @param {Object} data - Prediction and sensing features
 * @returns {Promise<Object>} Formatted AI reasoning result
 */
export async function generateGroqReasoning(data) {
  const {
    district = "Wayanad",
    village = "Ghat Corridor",
    probability = 75,
    confidence = 80,
    riskClass = "High",
    rainfall3d = 220,
    rainfall7d = 450,
    slope = 34,
    elevation = 1100,
    distanceToRoad = 180,
    topFactors = [],
  } = data;

  const factorSummary = topFactors.length
    ? topFactors.map((f) => `${f.factor} (${f.contribution}%)`).join(", ")
    : "Cumulative rainfall and steep terrain slope";

  const systemPrompt = `You are the Chief Geotechnical and Disaster Response AI for the Western Ghats Landslide Early Warning System (LEWS) in India.
Your mission is to provide rigorous scientific, physics-grounded landslide hazard synthesis and immediate actionable directives for District Emergency Operation Centres (DEOC) and the National Disaster Response Force (NDRF).

Respond STRICTLY with valid JSON having the following schema:
{
  "executiveSummary": "string (2-3 sentences assessing threat level, triggering factors, and urgency)",
  "geologicalFailureMechanism": "string (detailed explanation of pore-water pressure, shear resistance loss, overburden saturation, and slip plane dynamics)",
  "immediateResponseSOP": ["array of 3-4 specific operational directives for District Collectors/Rescue units"],
  "evacuationPriority": "CRITICAL" | "HIGH_ALERT" | "STANDBY" | "MONITORING",
  "publicAdvisories": {
    "english": "concise public warning in English (under 160 chars)",
    "malayalam": "concise public warning in Malayalam (under 160 chars)",
    "tamil": "concise public warning in Tamil (under 160 chars)",
    "kannada": "concise public warning in Kannada (under 160 chars)"
  },
  "roadSafetyBulletin": "specific advisory regarding Ghat passes, hairpin turns, and debris clearance",
  "confidenceAssessment": "string explaining sensor confidence reliability and validation requirements"
}`;

  const userPrompt = `Monitored Region: ${village}, ${district} (Western Ghats)
Landslide Susceptibility Probability: ${probability}%
Risk Classification: ${riskClass}
Sensor Model Confidence: ${confidence}%
Hydrometeorological Readings:
- 3-Day Cumulative Rainfall: ${rainfall3d} mm (IMD Alert Threshold: 200mm)
- 7-Day Antecedent Rainfall: ${rainfall7d} mm (Soil Saturation Trigger: 400mm)
Terrain Geomorphology:
- Slope: ${slope}° (Failure Initiation Angle: >28°)
- Elevation: ${elevation} m MSL
- Distance to Road/Excavation: ${distanceToRoad} m
Leading Contributory Factors: ${factorSummary}

Generate the comprehensive AI disaster response assessment in the required JSON format.`;

  try {
    const rawJson = await callGroqChat(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      { jsonMode: true, temperature: 0.15 }
    );

    const parsed = JSON.parse(rawJson);
    return {
      source: "GROQ_LLM",
      model: groqStats.lastUsedModel,
      latencyMs: groqStats.lastInferenceDurationMs,
      ...parsed,
    };
  } catch (err) {
    console.warn("[GroqService] LLM call failed or timed out. Engaging scientific fallback heuristic:", err.message);
    return generateFallbackReasoning(data);
  }
}

/**
 * Deterministic scientific fallback when internet/API is disconnected.
 */
function generateFallbackReasoning(data) {
  const {
    district = "Wayanad",
    village = "Ghat Sector",
    probability = 50,
    confidence = 70,
    riskClass = "Moderate",
    rainfall3d = 150,
    rainfall7d = 300,
    slope = 30,
  } = data;

  const isCritical = probability >= 80;
  const isHigh = probability >= 55;

  return {
    source: "DETERMINISTIC_EXPERT_HEURISTIC",
    model: "Geotechnical-Ruleset-v2.4",
    latencyMs: 1,
    executiveSummary: isCritical
      ? `CRITICAL HAZARD: ${district} (${village}) exhibits severe slope instability (${probability}% probability) caused by ${rainfall3d}mm 3-day deluge exceeding safety limits.`
      : isHigh
      ? `HIGH ALERT: Elevated landslide potential (${probability}%) detected in ${district}. Antecedent moisture (${rainfall7d}mm) has weakened regolith shear strength.`
      : `ROUTINE WATCH: Slope stability in ${district} remains manageable (${probability}% probability). Sensor telemetry is stable.`,
    geologicalFailureMechanism:
      `Prolonged rainfall of ${rainfall7d}mm over 7 days has driven soil moisture beyond field capacity. ` +
      `On steep ${slope}° terrain, matric suction drops to zero, triggering high pore-water pressure along bedrock slip planes.`,
    immediateResponseSOP: isCritical
      ? [
          "Mandate immediate evacuation of downstream habitations and tea estate worker colonies.",
          "Close Ghat passes to heavy vehicular traffic; deploy SDRF earthmovers at vulnerable km posts.",
          "Sound village siren towers and dispatch automated SMS broadcast in Malayalam/Tamil.",
        ]
      : [
          "Place rapid response rescue teams and taluk disaster shelters on 30-minute standby.",
          "Conduct hourly physical inspection of culverts, tension cracks, and mud seepage.",
          "Restrict night travel between 7:00 PM and 6:00 AM on hill routes.",
        ],
    evacuationPriority: isCritical ? "CRITICAL" : isHigh ? "HIGH_ALERT" : "MONITORING",
    publicAdvisories: {
      english: `WARNING: ${district} slope risk ${probability}%. Evacuate low-lying ghat areas immediately. Helpline: 1077.`,
      malayalam: `മുന്നറിയിപ്പ്: ${district} ഉരുൾപൊട്ടൽ സാധ്യത ${probability}%. മലയോര യാത്ര ഒഴിവാക്കുക. സഹായത്തിന്: 1077.`,
      tamil: `எச்சரிக்கை: ${district} நிலச்சரிவு அபாயம் ${probability}%. மலைப்பாதை பயணத்தை தவிர்க்கவும். உதவி: 1077.`,
      kannada: `ಎಚ್ಚರಿಕೆ: ${district} ಭೂಕುಸಿತ ಅಪಾಯ ${probability}%. ಘಾಟ್ ರಸ್ತೆ ಪ್ರಯಾಣವನ್ನು ತಪ್ಪಿಸಿ. ಸಹಾಯವಾಣಿ: 1077.`,
    },
    roadSafetyBulletin: `Ghat pass sector near ${village} has saturated cut-slopes. Single-lane movement and boulder netting inspection recommended.`,
    confidenceAssessment: `Calculated from multi-sensor telemetry with ${confidence}% confidence score. Ground gauge verification ongoing.`,
  };
}

/**
 * Generates an AI-crafted alert SMS in requested language.
 */
export async function generateGroqAlertSms(params) {
  const {
    location = "Chooralmala",
    district = "Wayanad",
    severity = "Critical",
    probability = 85,
    rainfall3d = 310,
    helpline = "1077",
  } = params;

  const prompt = `Generate four 160-character emergency alert messages for a landslide early warning broadcast in:
1) English
2) Malayalam
3) Tamil
4) Kannada

Details:
Location: ${location}, ${district}
Severity: ${severity}
Probability: ${probability}%
3-Day Rainfall: ${rainfall3d}mm
Helpline: ${helpline}

Format as strict JSON:
{
  "english": "...",
  "malayalam": "...",
  "tamil": "...",
  "kannada": "..."
}`;

  try {
    const raw = await callGroqChat(
      [
        { role: "system", content: "You are a crisis communications specialist. Keep each message under 160 characters, direct, actionable, including helpline." },
        { role: "user", content: prompt }
      ],
      { jsonMode: true, temperature: 0.1 }
    );
    return JSON.parse(raw);
  } catch (err) {
    return {
      english: `${severity.toUpperCase()} ALERT: Landslide risk in ${location}, ${district} (${probability}%). Avoid ghat roads. Call ${helpline}.`,
      malayalam: `അടിയന്തര മുന്നറിയിപ്പ്: ${location}, ${district}. ഉരുൾപൊട്ടൽ സാധ്യത ${probability}%. സഹായത്തിന്: ${helpline}.`,
      tamil: `அவசர எச்சரிக்கை: ${location}, ${district} நிலச்சரிவு அபாயம் ${probability}%. உதவிக்கு: ${helpline}.`,
      kannada: `ತುರ್ತು ಎಚ್ಚರಿಕೆ: ${location}, ${district} ಭೂಕುಸಿತದ ಅಪಾಯ ${probability}%. ಘಾಟ್ ರಸ್ತೆ ತಪ್ಪಿಸಿ. ಸಹಾಯವಾಣಿ: ${helpline}.`,
    };
  }
}

/**
 * Conversational Decision Support Agent for Duty Officers and Disaster Collectors.
 * Strictly adheres to AGENT_PROMPTS.md.
 */
export async function generateDecisionAgentChat({ hotspot = {}, user_message = "", language = "en" }) {
  const systemPrompt = `You are an expert Landslide Decision Support Agent for the Western Ghats region (Wayanad, Idukki, Nilgiris and Kodagu).

Your role is to help District Collectors, Duty Officers, SDRF/NDRF teams and local officials make fast, clear decisions during monsoon.

STRICT RULES:
1. Always base your answers ONLY on the deterministic data provided (probability, confidence, rainfall, slope, elevation, fired rules, hotspot details). Never invent sensor readings or numbers.
2. The LLM is only for explanation, reasoning, translation and drafting — NEVER for deciding the final action. The action (Auto-Broadcast / Officer Review / Monitoring) is already decided by the rule engine.
3. Be concise, clear and actionable. Field officers have no time for long theory.
4. If the user writes in Tamil, Malayalam, or Kannada, reply fully in the same language. Otherwise use simple English.
5. For critical situations (probability >= 80%), always highlight the recommended action clearly at the end.
6. When generating SMS/alerts, keep them short, urgent and in the requested language.
7. Never say "I think" or "maybe". Speak with authority based on the given data.

Current Context will be provided in every message as JSON.`;

  const contextPayload = {
    hotspot,
    user_message,
    language,
  };

  try {
    const raw = await callGroqChat(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: JSON.stringify(contextPayload) }
      ],
      { temperature: 0.2, max_tokens: 600 }
    );
    return raw;
  } catch (err) {
    const name = hotspot.name || hotspot.location || "Western Ghats Location";
    const prob = hotspot.probability ?? 80;
    const conf = hotspot.confidence ?? 75;
    const rain3 = hotspot.rain_3d ?? hotspot.rainfall3d ?? 250;
    const slope = hotspot.slope ?? 30;
    const action = hotspot.action || (prob >= 80 && conf >= 75 ? "RECOMMEND_AUTO_BROADCAST" : "MANUAL_OFFICER_REVIEW");
    const isSms = user_message.toLowerCase().includes("sms");

    // Tamil Fallback
    if (language === "ta" || /[\u0B80-\u0BFF]/.test(user_message)) {
      if (isSms) {
        return `தயார் SMS:\n\n${name}-ல் நிலச்சரிவு அபாயம் மிக அதிகம் (${prob}%). உடனடியாக பாதுகாப்பான இடத்திற்கு செல்லுங்கள். மலைப்பாதை பயணத்தை தவிர்க்கவும். உதவி எண்: 1077.`;
      }
      return `${name}-ல் தற்போதைய நிலச்சரிவு அபாயம்: ${hotspot.risk_level || "Critical"} (${prob}% சாத்தியக்கூறு, ${conf}% சென்சார் நம்பிக்கை).\nமுக்கிய காரணிகள்: 3-நாள் மழை ${rain3} mm, செங்குத்தான சரிவு ${slope}°.\n\nபரிந்துரைக்கப்பட்ட நடவடிக்கை: ${action === "RECOMMEND_AUTO_BROADCAST" ? "Immediate Auto-Broadcast + Siren activation" : "Officer Review"}`;
    }

    // Malayalam Fallback
    if (language === "ml" || /[\u0D00-\u0D7F]/.test(user_message)) {
      if (isSms) {
        return `തയ്യാറായ SMS:\n\n${name}-ൽ ഉരുൾപൊട്ടൽ സാധ്യത വളരെ കൂടുതൽ (${prob}%). ഉടൻ സുരക്ഷിത സ്ഥാനങ്ങളിലേക്ക് മാറുക. മലയോര യാത്ര ഒഴിവാക്കുക. ഹെൽപ്പ് ലൈൻ: 1077.`;
      }
      return `${name}-ൽ നിലവിലെ ഉരുൾപൊട്ടൽ സാധ്യത: ${hotspot.risk_level || "Critical"} (${prob}% സാധ്യത, ${conf}% സെൻസർ കൃത്യത).\nപ്രധാന ഘടകങ്ങൾ: 3-ദിവസത്തെ മഴ ${rain3} mm, കുത്തനെയുള്ള ചരിവ് ${slope}°.\n\nശുപാർശ ചെയ്യുന്ന നടപടി: ${action === "RECOMMEND_AUTO_BROADCAST" ? "Immediate Auto-Broadcast + Siren activation" : "Officer Review"}`;
    }

    // Kannada Fallback (Unicode range \u0C80-\u0CFF)
    if (language === "kn" || /[\u0C80-\u0CFF]/.test(user_message)) {
      if (isSms) {
        return `ಸಿದ್ಧ SMS:\n\n${name}-ನಲ್ಲಿ ಭೂಕುಸಿತದ ಅಪಾಯ ತೀವ್ರವಾಗಿದೆ (${prob}%). ತಕ್ಷಣವೇ ಸುರಕ್ಷಿತ ಸ್ಥಳಗಳಿಗೆ ತೆರಳಿ. ಘಾಟ್ ರಸ್ತೆ ಪ್ರಯಾಣವನ್ನು ತಪ್ಪಿಸಿ. ಸಹಾಯವಾಣಿ ಸಂಖ್ಯೆ: 1077.`;
      }
      return `${name}-ನಲ್ಲಿ ಪ್ರಸ್ತುತ ಭೂಕುಸಿತ ಅಪಾಯ: ${hotspot.risk_level || "Critical"} (${prob}% ಸಂಭವನೀಯತೆ, ${conf}% ಸಂವೇದಕ ನಿಖರತೆ).\nಮುಖ್ಯ ಕಾರಣಗಳು: 3-ದಿನಗಳ ಮಳೆ ${rain3} mm, ಕಡಿದಾದ ಇಳಿಜಾರು ${slope}°.\n\nಶಿಫಾರಸು ಮಾಡಿದ ಕ್ರಮ: ${action === "RECOMMEND_AUTO_BROADCAST" ? "ತಕ್ಷಣದ ಆಟೋ-ಪ್ರಸಾರ + ಸೈರನ್ ಸಕ್ರಿಯಗೊಳಿಸುವಿಕೆ" : "ಅಧಿಕಾರಿಗಳ ಪರಿಶೀಲನೆ"}`;
    }

    // English Fallback
    if (isSms) {
      return `EMERGENCY ALERT: Landslide risk in ${name} is Critical (${prob}%). Evacuate immediately to designated relief shelters. Avoid ghat routes. Helpline: 1077.`;
    }
    return `${name} currently has ${hotspot.risk_level || "Critical"} risk (${prob}% probability, ${conf}% confidence).\nMain drivers: Extremely high 3-day rainfall (${rain3} mm) + steep ${slope}° slope.\n\nRecommended Action: ${action === "RECOMMEND_AUTO_BROADCAST" ? "Immediate Auto-Broadcast + Siren activation" : "Officer Review"}`;
  }
}

/**
 * Returns current Groq LLM integration status and stats.
 */
export function getGroqServiceStatus() {
  const key = process.env.GROQ_API_KEY || GROQ_CONFIG.API_KEY;
  const maskedKey = key
    ? `${key.slice(0, 7)}...${key.slice(-4)}`
    : "NOT_SET";

  return {
    configured: Boolean(key && key !== "your_groq_api_key_here"),
    maskedKey,
    defaultModel: process.env.GROQ_MODEL || GROQ_CONFIG.MODEL,
    endpoint: GROQ_CONFIG.API_URL,
    stats: groqStats,
  };
}
