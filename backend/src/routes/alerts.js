import { Router } from "express";
import { alerts } from "../data/alerts.js";
import { generateGroqAlertSms } from "../services/groqService.js";

const router = Router();


/**
 * GET /api/alerts
 * Returns list of alerts.
 * Optional query filters:
 *   - district: Filter by district name (e.g., "Wayanad")
 *   - severity: Filter by severity ("Critical", "High", "Moderate", "Low")
 */
router.get("/", (req, res) => {
  const { district, severity } = req.query;

  let results = [...alerts];

  if (district && district !== "All") {
    results = results.filter(
      (a) => a.district.toLowerCase() === String(district).toLowerCase()
    );
  }

  if (severity && severity !== "All") {
    results = results.filter(
      (a) => a.severity.toLowerCase() === String(severity).toLowerCase()
    );
  }

  res.json({
    success: true,
    count: results.length,
    totalAlerts: alerts.length,
    data: results,
  });
});

/**
 * POST /api/alerts/generate
 * Generates formatted SMS alerts in English, Malayalam, and Tamil using Groq AI.
 *
 * Body:
 * {
 *   "location": "Chooralmala",
 *   "district": "Wayanad",
 *   "severity": "Critical",
 *   "probability": 88,
 *   "rainfall3d": 320,
 *   "helpline": "1077"
 * }
 */
router.post("/generate", async (req, res) => {
  const {
    location = "Monitored Ghat Sector",
    district = "Western Ghats",
    severity = "High",
    probability = 75,
    rainfall3d = 200,
    helpline = "1077",
  } = req.body;

  const timestamp = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const levelUpper = severity.toUpperCase();

  // Generate deterministic standard template
  const smsEnglish =
    `${levelUpper} LANDSLIDE ALERT: ${location}, ${district}. ` +
    `Risk probability: ${probability}%. Rainfall: ${rainfall3d}mm. ` +
    `Avoid ghat travel. Evacuate if ordered. Helpline: ${helpline}. [${timestamp} IST]`;

  const smsMalayalam =
    `അടിയന്തര മുന്നറിയിപ്പ്: ${location}, ${district}. ` +
    `ഉരുൾപൊട്ടல் சாத்தியത: ${probability}%. ` +
    `ജാഗ്രത പാലിക്കുക. സഹായത്തിന്: ${helpline}. [${timestamp} IST]`;

  const smsTamil =
    `அவசர எச்சரிக்கை: ${location}, ${district}. ` +
    `நிலச்சரிவு அபாயம்: ${probability}%. ` +
    `மலைப்பாதை பயணம் தவிர்க்கவும். உதவி எண்: ${helpline}. [${timestamp} IST]`;

  const smsKannada =
    `ತುರ್ತು ಎಚ್ಚರಿಕೆ: ${location}, ${district}. ` +
    `ಭೂಕುಸಿತದ ಅಪಾಯ: ${probability}%. ` +
    `ಘಾಟ್ ಪ್ರಯಾಣ ತಪ್ಪಿಸಿ. ಸಹಾಯವಾಣಿ: ${helpline}. [${timestamp} IST]`;

  // Dynamic AI generated alerts via Groq LLaMA 3.3
  let aiAlerts = null;
  try {
    aiAlerts = await generateGroqAlertSms({
      location,
      district,
      severity,
      probability,
      rainfall3d,
      helpline,
    });
  } catch (err) {
    console.warn("Groq alert SMS generation error:", err.message);
  }

  res.json({
    success: true,
    generatedAt: new Date().toISOString(),
    sms: {
      english: aiAlerts?.english || smsEnglish,
      malayalam: aiAlerts?.malayalam || smsMalayalam,
      tamil: aiAlerts?.tamil || smsTamil,
      kannada: aiAlerts?.kannada || smsKannada,
      characterCounts: {
        en: (aiAlerts?.english || smsEnglish).length,
        ml: (aiAlerts?.malayalam || smsMalayalam).length,
        ta: (aiAlerts?.tamil || smsTamil).length,
        kn: (aiAlerts?.kannada || smsKannada).length,
      },
    },
    meta: {
      location,
      district,
      severity,
      probability,
      rainfall3d,
      aiPowered: Boolean(aiAlerts),
    },
  });
});


/**
 * POST /api/alerts/send
 * Simulates dispatching SMS broadcast to telecom gateways and district subscribers.
 * Logs the transmission to standard console and returns confirmation.
 *
 * Body:
 * {
 *   "alertId": "ALT-2026-0912-01",
 *   "recipientGroup": "District Collectors & Field Rescue Teams",
 *   "message": "CRITICAL LANDSLIDE ALERT...",
 *   "channel": "SMS_GATEWAY" // or "WHATSAPP"
 * }
 */
router.post("/send", (req, res) => {
  const {
    alertId = `ALT-${Date.now().toString().slice(-6)}`,
    recipientGroup = "Emergency Response Personnel",
    message,
    channel = "SMS_GATEWAY",
    subscribersCount = 4500,
  } = req.body;

  if (!message) {
    return res.status(400).json({
      success: false,
      error: "The 'message' field is required to dispatch an alert.",
    });
  }

  const dispatchId = `DISP-${Date.now()}`;
  const timestamp = new Date().toISOString();

  // Log dispatch simulation as specified in requirements
  console.log("=================================================");
  console.log(`[ALERT DISPATCH SIMULATOR] ID: ${dispatchId}`);
  console.log(`[CHANNEL]           ${channel}`);
  console.log(`[ALERT REF]         ${alertId}`);
  console.log(`[TARGET GROUP]      ${recipientGroup}`);
  console.log(`[RECIPIENTS COUNT]  ${subscribersCount} numbers`);
  console.log(`[TIMESTAMP]         ${timestamp}`);
  console.log(`[MESSAGE CONTENT]:`);
  console.log(message);
  console.log("=================================================");

  res.json({
    success: true,
    message: "SMS alert broadcast simulated successfully.",
    dispatchRecord: {
      dispatchId,
      alertId,
      channel,
      recipientGroup,
      subscribersReached: subscribersCount,
      status: "DELIVERED_SIMULATED",
      dispatchedAt: timestamp,
    },
  });
});

export default router;
