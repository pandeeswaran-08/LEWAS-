import { Router } from "express";
import { riskPoints } from "../data/riskPoints.js";

const router = Router();

/**
 * GET /api/risk-points
 * Query params (optional):
 *   - district: Filter by district name (e.g. "Wayanad", "Idukki")
 *   - risk: Filter by risk level ("Critical", "High", "Moderate", "Low")
 */
router.get("/", (req, res) => {
  const { district, risk } = req.query;

  let results = [...riskPoints];

  if (district) {
    results = results.filter(
      (p) => p.district.toLowerCase() === String(district).toLowerCase()
    );
  }

  if (risk) {
    results = results.filter(
      (p) => p.risk.toLowerCase() === String(risk).toLowerCase()
    );
  }

  res.json({
    success: true,
    count: results.length,
    totalMonitored: riskPoints.length,
    data: results,
  });
});

export default router;
