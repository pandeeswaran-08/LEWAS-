/**
 * Centralized error handling and 404 middleware.
 */

// Handle 404 Route Not Found
export function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    error: `Endpoint not found: ${req.method} ${req.originalUrl}`,
    availableEndpoints: [
      "GET  /api/health",
      "GET  /api/risk-points",
      "GET  /api/alerts",
      "POST /api/predict",
      "POST /api/alerts/generate",
      "POST /api/alerts/send",
      "GET  /api/agent/status",
    ],
  });
}

// Global Exception Handler
export function errorHandler(err, req, res, next) {
  console.error(`[SERVER ERROR] ${err.message}`, err.stack);

  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
}
