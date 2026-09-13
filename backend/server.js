/**
 * server.js
 * Entry point for the Western Ghats Multi-Agent Landslide Early Warning
 * System backend/integration layer.
 */

const express = require("express");
const cors = require("cors");
const apiRouter = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Simple request logger — handy for demos
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.use("/api", apiRouter);

app.get("/", (req, res) => {
  res.json({
    message: "Western Ghats Multi-Agent Landslide Early Warning System API",
    endpoints: [
      "GET  /api/health",
      "GET  /api/districts",
      "GET  /api/districts/:id",
      "POST /api/predict",
      "GET  /api/alerts",
      "POST /api/alerts/generate-message",
      "GET  /api/knowledge/past-events"
    ]
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ status: "error", message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ status: "error", message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`✅ Western Ghats LEWS backend running on http://localhost:${PORT}`);
  console.log(`   Try: curl http://localhost:${PORT}/api/health`);
});
