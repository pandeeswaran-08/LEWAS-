import { Router } from "express";

const router = Router();

/**
 * GET /api/health
 * Returns service health status and timestamp.
 */
router.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "Western Ghats Landslide Early Warning System API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

export default router;
