import { Router } from "express";
import { getAgentStatus } from "../services/agentService.js";

const router = Router();

/**
 * GET /api/agent/status
 * Returns the current runtime state, rules, and telemetry for the autonomous agent.
 */
router.get("/status", (req, res) => {
  const status = getAgentStatus();

  res.json({
    success: true,
    agent: status,
  });
});

export default router;
