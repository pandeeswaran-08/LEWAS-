import { Router } from "express";
import {
  generateGroqReasoning,
  generateGroqAlertSms,
  generateDecisionAgentChat,
  getGroqServiceStatus,
} from "../services/groqService.js";

const router = Router();

/**
 * GET /api/ai/status
 * Returns connection status to Groq Cloud LLM engine and model metadata.
 */
router.get("/status", (req, res) => {
  const status = getGroqServiceStatus();
  res.json({
    success: true,
    engine: "Groq Cloud LPU",
    status,
  });
});

/**
 * POST /api/ai/briefing
 * Directly requests an in-depth geotechnical and SOP briefing from LLaMA 3.3.
 */
router.post("/briefing", async (req, res, next) => {
  try {
    const data = req.body || {};
    const briefing = await generateGroqReasoning(data);
    res.json({
      success: true,
      data: briefing,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/ai/sms
 * Requests multilingual AI-crafted SMS emergency broadcasts.
 */
router.post("/sms", async (req, res, next) => {
  try {
    const params = req.body || {};
    const sms = await generateGroqAlertSms(params);
    res.json({
      success: true,
      sms,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/ai/chat
 * Conversational Decision Support Agent for Duty Officers & Collectors.
 * Governed strictly by AGENT_PROMPTS.md.
 */
router.post("/chat", async (req, res, next) => {
  try {
    const { hotspot, user_message, language } = req.body || {};
    const reply = await generateDecisionAgentChat({ hotspot, user_message, language });
    res.json({
      success: true,
      reply,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
