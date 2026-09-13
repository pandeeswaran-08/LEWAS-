/**
 * Frontend API Client for the Landslide Early Warning Backend Service.
 * Connects to the Express backend with automatic fallback to client-side heuristics.
 */

import { runPrediction as localRunPrediction } from "@/utils/prediction";
import type { PredictionInput, PredictionResult } from "@/types";

export const API_BASE_URL =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env["VITE_API_URL"]) ||
  "http://localhost:5000/api";


export interface AgentDecision {
  recommendAutoAlert: boolean;
  action: string;
  urgency: string;
  evaluatedRules: string[];
  reasoning: string;
  timestamp: string;
}

export interface GroqAiBriefing {
  source: string;
  model: string;
  latencyMs?: number;
  executiveSummary: string;
  geologicalFailureMechanism: string;
  immediateResponseSOP: string[];
  evacuationPriority: "CRITICAL" | "HIGH_ALERT" | "STANDBY" | "MONITORING";
  publicAdvisories: {
    english: string;
    malayalam: string;
    tamil: string;
    kannada?: string;
  };
  roadSafetyBulletin?: string;
  confidenceAssessment?: string;
}

export interface PredictApiResponse extends PredictionResult {
  success: boolean;
  agentDecision?: AgentDecision;
  aiBriefing?: GroqAiBriefing;
}


/**
 * Calls POST /api/predict on the backend.
 * Gracefully falls back to local heuristic calculation if the backend is not running.
 */
export async function predictRisk(
  input: PredictionInput
): Promise<PredictApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn(
      "[EWS API] Backend unreachable at",
      API_BASE_URL,
      "— Falling back to client-side heuristic engine:",
      error
    );

    // Fallback: use local calculation
    const localResult = localRunPrediction(input);
    const prob = localResult.probability;
    const conf = localResult.confidence;

    const isAuto = prob >= 80 && conf >= 75;

    return {
      ...localResult,
      success: true,
      agentDecision: {
        recommendAutoAlert: isAuto,
        action: isAuto ? "RECOMMEND_AUTO_BROADCAST" : "ROUTINE_MONITORING",
        urgency: isAuto ? "CRITICAL" : "NORMAL",
        evaluatedRules: [
          `Probability Check: ${prob}% >= 80% -> ${prob >= 80 ? "PASSED" : "FAILED"}`,
          `Confidence Check: ${conf}% >= 75% -> ${conf >= 75 ? "PASSED" : "FAILED"}`,
        ],
        reasoning: isAuto
          ? `CRITICAL AUTOMATION TRIGGER ACTIVATED: Probability (${prob}%) >= 80% and Confidence (${conf}%) >= 75%. Automated early warning broadcast recommended.`
          : `Conditions within watch tolerance (${prob}% probability). Continue 15-minute sensor polling.`,
        timestamp: new Date().toISOString(),
      },
    };
  }
}

/**
 * Fetches all monitored risk points from GET /api/risk-points.
 */
export async function getRiskPoints(params?: { district?: string; risk?: string }) {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  const url = `${API_BASE_URL}/risk-points${query ? `?${query}` : ""}`;
  const response = await fetch(url);
  return response.json();
}

/**
 * Fetches recent alerts from GET /api/alerts.
 */
export async function getAlerts(params?: { district?: string; severity?: string }) {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  const url = `${API_BASE_URL}/alerts${query ? `?${query}` : ""}`;
  const response = await fetch(url);
  return response.json();
}

/**
 * Simulates alert dispatch via POST /api/alerts/send.
 */
export async function sendAlertDispatch(payload: {
  alertId: string;
  message: string;
  recipientGroup?: string;
  channel?: string;
}) {
  const response = await fetch(`${API_BASE_URL}/alerts/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return response.json();
}

/**
 * Gets live agent status from GET /api/agent/status.
 */
export async function getAgentStatus() {
  const response = await fetch(`${API_BASE_URL}/agent/status`);
  return response.json();
}

/**
 * Gets Groq AI engine connection status from GET /api/ai/status.
 */
export async function getAiStatus() {
  const response = await fetch(`${API_BASE_URL}/ai/status`);
  return response.json();
}

/**
 * Directly requests an AI briefing from POST /api/ai/briefing.
 */
export async function getAiBriefing(payload: Record<string, unknown>) {
  const response = await fetch(`${API_BASE_URL}/ai/briefing`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return response.json();
}

/**
 * Sends a conversational query to the Landslide Decision Support Agent.
 * (POST /api/ai/chat)
 */
export async function sendDecisionAgentChat(payload: {
  hotspot?: Record<string, unknown>;
  user_message: string;
  language?: "en" | "ta" | "ml" | "kn";
}) {
  const response = await fetch(`${API_BASE_URL}/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return response.json();
}

