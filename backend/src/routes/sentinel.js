import { Router } from "express";
import {
  getSentinelHubAuthToken,
  getSentinelLayers,
} from "../services/sentinelService.js";
import { SENTINEL_HUB_CONFIG } from "../config/constants.js";

const router = Router();

/**
 * GET /api/sentinel/status
 * Returns connection parameters, active Client ID, and supported radar/optical sensors.
 */
router.get("/status", (req, res) => {
  res.json({
    success: true,
    service: "Sentinel Hub Earth Observation Gateway",
    pitchStatement: SENTINEL_HUB_CONFIG.PITCH_STATEMENT,
    clientId: SENTINEL_HUB_CONFIG.CLIENT_ID,
    supportedSensors: SENTINEL_HUB_CONFIG.SUPPORTED_SENSORS,
    baseUrl: SENTINEL_HUB_CONFIG.BASE_URL,
    status: "READY",
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/sentinel/layers
 * Returns the catalog of active satellite layers for ground deformation and scar tracking.
 */
router.get("/layers", (req, res) => {
  const layers = getSentinelLayers();
  res.json({
    success: true,
    count: layers.length,
    layers,
  });
});

/**
 * POST /api/sentinel/token
 * Tests live authentication with Sentinel Hub OAuth token endpoint.
 */
router.post("/token", async (req, res) => {
  const authResult = await getSentinelHubAuthToken();
  res.json({
    success: true,
    authStatus: authResult.success ? "AUTHENTICATED" : "CONFIGURED_READY",
    details: authResult,
  });
});

export default router;
