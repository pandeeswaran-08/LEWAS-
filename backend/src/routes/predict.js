import { Router } from "express";
import {
  calculatePrediction,
  getMLModelMetadata,
} from "../services/predictionService.js";
import { evaluateAgentDecision } from "../services/agentService.js";
import { generateGroqReasoning } from "../services/groqService.js";

const router = Router();

/**
 * GET /api/predict/model
 * Returns current Machine Learning model metadata, feature importances, and evaluation metrics.
 */
router.get("/model", (req, res) => {
  const metadata = getMLModelMetadata();
  res.json({
    success: true,
    data: metadata,
  });
});

/**
 * POST /api/predict
 *
 * Body:
 * {
 *   "district": "Wayanad",
 *   "rainfall3d": 280,
 *   "rainfall7d": 490,
 *   "slope": 36,            // optional
 *   "elevation": 1100,      // optional
 *   "distanceToRoad": 150,  // optional
 *   "soil_type": "Colluvium", // optional (Lateritic | Clayey_Loam | Colluvium | Gneissic_Overburden | Sandy_Loam)
 *   "engine": "random_forest" // optional ("random_forest" | "heuristic")
 * }
 */
router.post("/", async (req, res, next) => {
  try {
    const {
      district = "Wayanad",
      rainfall3d,
      rainfall7d,
      slope,
      elevation,
      distanceToRoad,
      soil_type,
      engine = "random_forest",
    } = req.body;

    // Validation
    if (rainfall3d === undefined || rainfall7d === undefined) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: rainfall3d and rainfall7d are mandatory.",
        examplePayload: {
          district: "Wayanad",
          rainfall3d: 250,
          rainfall7d: 450,
          soil_type: "Lateritic",
          engine: "random_forest",
        },
      });
    }

    const r3d = Number(rainfall3d);
    const r7d = Number(rainfall7d);

    if (isNaN(r3d) || isNaN(r7d) || r3d < 0 || r7d < 0) {
      return res.status(400).json({
        success: false,
        error: "rainfall3d and rainfall7d must be valid non-negative numbers.",
      });
    }

    // 1. Calculate susceptibility prediction (Random Forest ML or Heuristic)
    const prediction = calculatePrediction({
      district,
      rainfall3d: r3d,
      rainfall7d: r7d,
      slope,
      elevation,
      distanceToRoad,
      soil_type,
      engine,
    });

    // 2. Run rule-based autonomous agent decision evaluation
    // Rule: if probability >= 80 AND confidence >= 75 -> recommend auto alert
    const agentDecision = evaluateAgentDecision({
      probability: prediction.probability,
      confidence: prediction.confidence,
      district: prediction.district,
      rainfall3d: r3d,
      rainfall7d: r7d,
      riskClass: prediction.riskClass,
      topFactors: prediction.topFactors,
    });

    // 3. Generate Groq LLM Geological & SOP synthesis (with instant fallback)
    let aiBriefing = null;
    try {
      aiBriefing = await generateGroqReasoning({
        district: prediction.district,
        probability: prediction.probability,
        confidence: prediction.confidence,
        riskClass: prediction.riskClass,
        rainfall3d: r3d,
        rainfall7d: r7d,
        slope: prediction.inputParameters.slope,
        elevation: prediction.inputParameters.elevation,
        distanceToRoad: prediction.inputParameters.distanceToRoad,
        topFactors: prediction.topFactors,
      });
    } catch (err) {
      console.warn("Groq reasoning failed:", err.message);
    }

    res.json({
      success: true,
      district: prediction.district,
      probability: prediction.probability,
      riskClass: prediction.riskClass,
      confidence: prediction.confidence,
      factors: prediction.factors || prediction.topFactors,
      topFactors: prediction.topFactors,
      engine: prediction.engine,
      featureImportances: prediction.featureImportances,
      comparison: prediction.comparison,
      metrics: prediction.metrics,
      inputParameters: prediction.inputParameters,
      agentDecision,
      aiBriefing,
      calculatedAt: prediction.calculatedAt,
    });
  } catch (err) {
    next(err);
  }
});

export default router;

