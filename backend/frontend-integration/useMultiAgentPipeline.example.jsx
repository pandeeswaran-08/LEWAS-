/**
 * useMultiAgentPipeline.example.jsx
 * ---------------------------------------------------------------
 * Example React hook + component snippet showing how to wire the
 * "AI Prediction / Multi-Agent Studio" page to the backend.
 * Copy/adapt into your actual Studio page component.
 * ---------------------------------------------------------------
 */

import { useState } from "react";
import { runPrediction, generateMessage } from "./apiClient";

export function useMultiAgentPipeline() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null); // full backend response

  async function runPipeline(formInput) {
    setLoading(true);
    setError(null);
    try {
      const data = await runPrediction(formInput);
      setResult(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function buildAlertMessage(channel = "sms") {
    if (!result) throw new Error("Run the pipeline first");
    return generateMessage(result, channel);
  }

  return { loading, error, result, runPipeline, buildAlertMessage };
}

/* ---------------------------------------------------------------
Example usage inside a page component:

function MultiAgentStudioPage() {
  const { loading, error, result, runPipeline } = useMultiAgentPipeline();
  const [form, setForm] = useState({ district: "Wayanad", rainfall3d: 200, rainfall7d: 450 });

  return (
    <div>
      <button onClick={() => runPipeline(form)} disabled={loading}>
        {loading ? "Running..." : "Run Multi-Agent Pipeline"}
      </button>

      {error && <p className="text-red-600">{error}</p>}

      {result && (
        <div className="space-y-4">
          {/* Step 1: Sensing }
          <div>Sensing: {JSON.stringify(result.pipeline.sensing.features)}</div>

          {/* Step 2: Prediction }
          <div>
            Probability: {result.pipeline.prediction.probability}% —
            Risk: {result.pipeline.prediction.riskClass} —
            Confidence: {result.pipeline.prediction.confidence}%
          </div>

          {/* Step 3: Reasoning }
          <div>{result.pipeline.reasoning.explanation}</div>

          {/* Step 4: Action }
          <div>Decision: {result.pipeline.action.decision}</div>
        </div>
      )}
    </div>
  );
}
--------------------------------------------------------------- */
