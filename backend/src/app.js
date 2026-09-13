import express from "express";
import cors from "cors";

import healthRoutes from "./routes/health.js";
import riskPointsRoutes from "./routes/riskPoints.js";
import alertsRoutes from "./routes/alerts.js";
import predictRoutes from "./routes/predict.js";
import agentRoutes from "./routes/agent.js";
import sentinelRoutes from "./routes/sentinel.js";
import aiRoutes from "./routes/ai.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";

const app = express();

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[HTTP] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// ─── REST API Routes ─────────────────────────────────────────────────────────
app.use("/api/health", healthRoutes);
app.use("/api/risk-points", riskPointsRoutes);
app.use("/api/alerts", alertsRoutes);
app.use("/api/predict", predictRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api/sentinel", sentinelRoutes);
app.use("/api/ai", aiRoutes);


// ─── Error Handlers ──────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
