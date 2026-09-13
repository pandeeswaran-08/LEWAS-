import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("===============================================================");
  console.log("🌊 Landslide Early Warning System (EWS) Backend Service");
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log("===============================================================");
  console.log("Available REST Endpoints:");
  console.log(` • GET  http://localhost:${PORT}/api/health`);
  console.log(` • GET  http://localhost:${PORT}/api/risk-points`);
  console.log(` • GET  http://localhost:${PORT}/api/alerts`);
  console.log(` • POST http://localhost:${PORT}/api/predict`);
  console.log(` • POST http://localhost:${PORT}/api/alerts/generate`);
  console.log(` • POST http://localhost:${PORT}/api/alerts/send`);
  console.log(` • GET  http://localhost:${PORT}/api/agent/status`);
  console.log(` • GET  http://localhost:${PORT}/api/ai/status`);
  console.log(` • POST http://localhost:${PORT}/api/ai/briefing`);
  console.log(` • POST http://localhost:${PORT}/api/ai/sms`);
  console.log(` • POST http://localhost:${PORT}/api/ai/chat (Conversational Agent)`);
  console.log(` • GET  http://localhost:${PORT}/api/sentinel/status`);
  console.log(` • GET  http://localhost:${PORT}/api/sentinel/layers`);
  console.log(` • POST http://localhost:${PORT}/api/sentinel/token`);
  console.log("===============================================================");
  console.log("🤖 Agentic Logic: AUTO_BROADCAST when probability >= 80 & confidence >= 75");
  console.log("🧠 LLM Reasoning: Groq Cloud LPU (Llama-3.3-70B) with Deterministic Fallback");
  console.log("🛰️ Pitch Statement: Architecture supports live Sentinel-1/2 via Sentinel Hub API");
  console.log("===============================================================");
});

