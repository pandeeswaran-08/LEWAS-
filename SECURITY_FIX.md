# 🛡️ LEWAS Security & Configuration Fix Guide

> Comprehensive guide to credential security, environment configuration, and clean secrets management for the TECHNOVA Zonal Round presentation.

---

## 1. Critical Security Fix – `backend/.env.example`

**Content of `backend/.env.example`**:

```bash
# Backend Service Configuration
PORT=5000

# Groq Cloud AI Configuration (optional – deterministic fallback activates if blank)
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile

# Sentinel Hub API Credentials (optional – system works with simulated layers if blank)
SENTINEL_CLIENT_ID=your_sentinel_client_id_here
SENTINEL_CLIENT_SECRET=your_sentinel_client_secret_here
```

> [!IMPORTANT]
> Real credentials must never be committed to `.env.example` files or source code repositories.

---

## 2. Root `.env.example` Cleanup

**Content of root `.env.example`**:

```bash
# Frontend Environment Configuration
VITE_API_URL=http://localhost:5000/api
```

---

## 3. Dotenv Support in Backend

### 3.1 Install dependency
```bash
cd backend
npm install dotenv
```

### 3.2 Load environment variables early
At the very top of `backend/src/server.js`:
```javascript
import "dotenv/config";
import app from "./app.js";
```

---

## 4. Local `.env` Setup (For Local Development Only)

Create `backend/.env` (strictly git-ignored):
```bash
PORT=5000
GROQ_API_KEY=your_actual_groq_key_here
GROQ_MODEL=llama-3.3-70b-versatile

# Leave blank if you don't have live Sentinel credentials
SENTINEL_CLIENT_ID=
SENTINEL_CLIENT_SECRET=
```

---

## 5. Verify `.gitignore`

Confirmed in root `.gitignore`:
```text
.env
.env.*
.env.local
.env.*.local
**/.env
**/.env.*
!.env.example
!**/.env.example
```

---

## 6. Naming Consistency

Throughout `README.md`, UI headers, and documentation, the standard project nomenclature is:
- **LEWAS**: Western Ghats Multi-Agent Landslide Early Warning System.

---

## 7. Final Checklist Before Demo

- [x] Real secrets removed from all `.env.example` files and source files.
- [x] `backend/.env` loaded safely via `dotenv/config`.
- [x] `.env` and subfolder `.env` files protected by `.gitignore`.
- [x] Clean deterministic fallback active if `GROQ_API_KEY` is omitted.
- [x] Clean commit history on GitHub repository.

---
*Maintained by the Western Ghats LEWAS Engineering Team.*
