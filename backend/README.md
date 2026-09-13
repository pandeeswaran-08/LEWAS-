# Landslide Early Warning System (EWS) — Backend API

A lightweight, robust Node.js + Express backend service providing REST API endpoints and autonomous rule-based early warning agent logic for the Western Ghats Landslide Early Warning System prototype.

---

## 📁 Project Structure

```
backend/
├── package.json
├── README.md
└── src/
    ├── app.js                   # Express application setup, middleware, and route mounting
    ├── server.js                # Server entry point (starts HTTP listener)
    ├── config/
    │   └── constants.js         # Domain constants, feature weights, hazard thresholds & agent rules
    ├── data/
    │   ├── riskPoints.js        # In-memory dataset of monitored landslide risk hotspots
    │   └── alerts.js            # In-memory dataset of issued alerts and emergency contacts
    ├── middleware/
    │   └── errorHandler.js      # 404 handler and central error-handling middleware
    ├── routes/
    │   ├── agent.js             # GET  /api/agent/status
    │   ├── alerts.js            # GET  /api/alerts, POST /api/alerts/generate, POST /api/alerts/send
    │   ├── health.js            # GET  /api/health
    │   ├── predict.js           # POST /api/predict
    │   └── riskPoints.js        # GET  /api/risk-points
    └── services/
        ├── agentService.js      # Rule-based agentic decision engine with reasoning explanations
        └── predictionService.js # Heuristic multi-factor landslide susceptibility calculation
```

---

## 🚀 Quick Start

### 1. Install Dependencies
Navigate into the `backend` directory and run:
```bash
cd backend
npm install
```

### 2. Start the Server
```bash
# Production start
npm start

# Development mode (auto-reload on file change in Node 18+)
npm run dev
```

The server will start on **`http://localhost:5000`** by default (or the port defined in `PORT` environment variable).

---

## 🤖 Agentic Decision Logic

The backend features an **Autonomous Rule-Based Early Warning Agent** (`agentService.js`).

### Core Decision Rule:
- **Condition:** `probability >= 80` **AND** `confidence >= 75`
- **Agent Action:** `RECOMMEND_AUTO_BROADCAST` (Urgency: `CRITICAL`)
- **Reasoning:** Automatically triggers immediate public SMS / Siren dispatch without awaiting manual duty officer approval to save human lives in imminent disaster situations.
- **Fallback Rule (High Risk / Low Confidence):** If probability is high but confidence is `< 75%`, the agent routes to `MANUAL_OFFICER_REVIEW` to prevent false alarms from potential sensor noise.
- **Normal Rule:** If probability is `< 55%`, the agent logs `ROUTINE_MONITORING` and maintains standard 15-minute polling.

---

## 📡 REST API Documentation

### 1. Health Check
- **Endpoint:** `GET /api/health`
- **Description:** Returns service operational health and server timestamp.
- **Example Response:**
  ```json
  {
    "status": "ok",
    "service": "Western Ghats Landslide Early Warning System API",
    "version": "1.0.0",
    "timestamp": "2026-09-12T09:50:00.000Z"
  }
  ```

---

### 2. Risk Points
- **Endpoint:** `GET /api/risk-points`
- **Optional Query Params:**
  - `district` (e.g. `?district=Wayanad`)
  - `risk` (e.g. `?risk=Critical`)
- **Description:** Returns all monitored landslide risk hotspots with live soil moisture, rainfall, coordinates, and populated exposure zones.
- **Example Response:**
  ```json
  {
    "success": true,
    "count": 8,
    "totalMonitored": 8,
    "data": [
      {
        "id": "WYD-01",
        "name": "Chooralmala",
        "district": "Wayanad",
        "state": "Kerala",
        "lat": 11.4675,
        "lng": 76.1042,
        "elevation": 1080,
        "slope": 38,
        "criticalRoads": ["Meppadi–Chooralmala Road", "SH 29 link"],
        "rainfall3d": 372,
        "rainfall7d": 618,
        "risk": "Critical",
        "probability": 91,
        "confidence": 88,
        "villages": ["Chooralmala", "Punchirimattom", "Attamala"],
        "population": 4200,
        "soilMoisture": 94,
        "status": "Active Warning"
      }
    ]
  }
  ```

---

### 3. Recent Alerts
- **Endpoint:** `GET /api/alerts`
- **Optional Query Params:**
  - `district` (e.g. `?district=Wayanad`)
  - `severity` (e.g. `?severity=Critical`)
- **Description:** Returns active early warnings with incident briefs, affected villages, and emergency telephone lines.

---

### 4. AI Landslide Prediction + Agent Decision
- **Endpoint:** `POST /api/predict`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "district": "Wayanad",
    "rainfall3d": 320,
    "rainfall7d": 560,
    "slope": 38,
    "elevation": 1100,
    "distanceToRoad": 160
  }
  ```
  *(Note: `slope`, `elevation`, and `distanceToRoad` are optional; if omitted, realistic district terrain defaults are automatically applied).*
- **Example Response:**
  ```json
  {
    "success": true,
    "district": "Wayanad",
    "probability": 89,
    "riskClass": "Critical",
    "confidence": 88,
    "topFactors": [
      {
        "factor": "3-Day Cumulative Rainfall",
        "featureKey": "rainfall3d",
        "value": "320 mm",
        "threshold": "> 200 mm",
        "weight": 0.3,
        "contribution": 36,
        "exceeded": true
      },
      {
        "factor": "Terrain Slope",
        "featureKey": "slope",
        "value": "38°",
        "threshold": "> 28°",
        "weight": 0.24,
        "contribution": 28,
        "exceeded": true
      }
    ],
    "agentDecision": {
      "recommendAutoAlert": true,
      "action": "RECOMMEND_AUTO_BROADCAST",
      "urgency": "CRITICAL",
      "evaluatedRules": [
        "Probability Check: 89% >= 80% -> PASSED",
        "Confidence Check: 88% >= 75% -> PASSED"
      ],
      "reasoning": "CRITICAL AUTOMATION TRIGGER ACTIVATED: The predicted landslide probability (89%) equals or exceeds the critical cut-off threshold (80%), and model confidence (88%) meets the required confidence floor (75%). Primary risk driver is \"3-Day Cumulative Rainfall\" in Wayanad with cumulative rainfall reaching 320 mm (3-day) and 560 mm (7-day). Autonomous early warning dispatch (SMS/Siren) is STRONGLY RECOMMENDED to preserve human life without waiting for manual clearance.",
      "timestamp": "2026-09-12T09:55:00.000Z"
    }
  }
  ```

---

### 5. Generate SMS Broadcast Message
- **Endpoint:** `POST /api/alerts/generate`
- **Request Body:**
  ```json
  {
    "location": "Chooralmala",
    "district": "Wayanad",
    "severity": "Critical",
    "probability": 89,
    "rainfall3d": 320,
    "helpline": "1077"
  }
  ```
- **Example Response:**
  ```json
  {
    "success": true,
    "generatedAt": "2026-09-12T09:55:00.000Z",
    "sms": {
      "english": "CRITICAL LANDSLIDE ALERT: Chooralmala, Wayanad. Risk probability: 89%. Rainfall: 320mm. Avoid ghat travel. Evacuate if ordered. Helpline: 1077. [15:25 IST]",
      "characterCountEn": 158,
      "regional": "അടിയന്തര മുന്നറിയിപ്പ്: Chooralmala, Wayanad. ഉരുൾപൊട്ടൽ സാധ്യത: 89%. ജാഗ്രത പാലിക്കുക. സഹായത്തിന്: 1077. [15:25 IST]",
      "characterCountMl": 121
    }
  }
  ```

---

### 6. Simulate Sending Alert
- **Endpoint:** `POST /api/alerts/send`
- **Request Body:**
  ```json
  {
    "alertId": "ALT-2026-0912-01",
    "recipientGroup": "District Disaster Management & Relief Officers",
    "message": "CRITICAL LANDSLIDE RED ALERT: Chooralmala, Wayanad. Severe debris flow risk. Evacuation advised.",
    "channel": "SMS_GATEWAY"
  }
  ```
- **Behavior:** Logs the dispatch payload to server standard output and returns simulated delivery confirmation.

---

### 7. Agent Operational Status
- **Endpoint:** `GET /api/agent/status`
- **Description:** Returns the live agent status, operational mode, active rules, uptime in seconds, and execution statistics.

---

### 8. Groq Cloud AI Engine Status & Configuration
- **Endpoint:** `GET /api/ai/status`
- **Description:** Verifies connectivity to the Groq Cloud LPU engine, reporting active model (`llama-3.3-70b-versatile`), masked API key, and call metrics.
- **Example Response:**
  ```json
  {
    "success": true,
    "engine": "Groq Cloud LPU",
    "status": {
      "configured": true,
      "maskedKey": "gsk_Kq2...54n",
      "defaultModel": "llama-3.3-70b-versatile",
      "endpoint": "https://api.groq.com/openai/v1/chat/completions",
      "stats": {
        "totalCalls": 12,
        "successfulCalls": 12,
        "fallbackCalls": 0,
        "lastInferenceDurationMs": 284,
        "lastStatus": "READY"
      }
    }
  }
  ```

---

### 9. Groq In-Depth Geotechnical AI Briefing
- **Endpoint:** `POST /api/ai/briefing`
- **Request Body:**
  ```json
  {
    "district": "Wayanad",
    "village": "Chooralmala",
    "probability": 88,
    "confidence": 85,
    "riskClass": "Critical",
    "rainfall3d": 320,
    "rainfall7d": 540,
    "slope": 36,
    "elevation": 1100,
    "distanceToRoad": 150
  }
  ```
- **Returns:** Full LLM synthesis including pore-water failure mechanics, immediate response SOP checklist, evacuation priority, and trilingual public advisories (English, Malayalam, Tamil).

---

### 10. Groq Multilingual Alert SMS Generation
- **Endpoint:** `POST /api/ai/sms`
- **Request Body:**
  ```json
  {
    "location": "Mundakkai",
    "district": "Wayanad",
    "severity": "Critical",
    "probability": 92,
    "rainfall3d": 340,
    "helpline": "1077"
  }
  ```
- **Returns:** AI-crafted 160-char SMS texts in English, Malayalam, and Tamil.

