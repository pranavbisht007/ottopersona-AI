# OttoPersona AI

> **"The Right Message. The Right Tone. Every Time."**  
> *Instant Persona and Context-Aware Communication Transformer*

---

## 1. Project Overview

**OttoPersona AI** is a production-grade, context-aware communication assistant built with React, Node.js, Express, and Google Gemini API. Unlike traditional paraphrase tools, OttoPersona AI dynamically adjusts wording according to five distinct dimensions:
1. **Target Audience**: Teacher, Recruiter, Friend, Manager, Client, General audience
2. **Communication Purpose**: Email, Request, Apology, Job application, Interview response, Follow-up, General communication
3. **Desired Tone**: Professional, Friendly, Formal, Respectful, Empathetic, Confident, Concise
4. **Desired Length**: Short, Medium, Detailed
5. **Communication Format**: Email, WhatsApp message, General text message

Crucially, OttoPersona AI is engineered with **strict meaning preservation**: it never invents excuses, dates, achievements, or commitments, and preserves uncertainty (e.g., turning "I may attend" into a promise is strictly forbidden).

---

## 2. Problem Statement & Proposed Solution

### The Problem
Communicating effectively in diverse social and professional contexts is challenging:
- Students drafting emails to professors often sound either overly casual or overly stiff.
- Job seekers frequently undersell themselves or risk fabricating claims when using basic generative tools.
- Professionals lose hours rewriting sensitive messages (apologies, follow-ups, requests).
- Generic AI tools hallucinate details, fabricate dates, make unauthorized commitments, or fail to adhere to format constraints.

### The Solution
OttoPersona AI combines server-side context validation with a hardened AI instruction engine that:
- Adapts text structure, etiquette, and vocabulary to the chosen recipient.
- Enforces strict factual fidelity and uncertainty preservation.
- Provides a transparent explanation and bulleted breakdown of why changes were made.
- Delivers an intuitive side-by-side comparison with instant copy, direct editing, and regeneration capabilities.

---

## 3. Core Features

- **Context-Aware Transformation Engine**: Combines 5 parameters to deliver fine-grained tone and structural alignment.
- **Meaning Preservation Safeguards**: Preserves factual claims, commitments, and ambiguity without hallucinating excuses or dates.
- **Side-by-Side Comparison Workspace**: Compare original input against transformed output in real-time.
- **In-Place Output Editing**: Edit rewritten messages directly while maintaining the original text intact.
- **One-Click Clipboard Copying**: Copies latest edited output with fallback support for all browser environments.
- **Preset Test Scenarios**: Quick-fill chips for Teacher Requests, Job Applications, Friend Notes, Apologies, and Uncertainty preservation.
- **Zero-Storage Privacy Architecture**: In-memory request processing without persistent database tracking of personal messages.
- **Defense-in-Depth Security**:
  - Helmet HTTP security headers (CSP, HSTS, X-Content-Type-Options: nosniff).
  - Multi-tier rate limiting (transformations: 30/15m, general: 150/15m, admin: 10/15m).
  - Timing-safe authentication for administrative diagnostics.
  - Strict input sanitization and allowlist validation.
  - Fingerprinting suppression (`x-powered-by` removed).
  - Zero exposed API secrets in frontend or version control.
- **Accessible, Modern UI**:
  - Deep indigo accent system (`#4338ca`).
  - No purple gradient pill buttons; clean rectangular geometry with subtle borders.
  - System-responsive Light and Dark mode with instant toggle.
  - Dedicated accessible Privacy Policy and Terms & Conditions dialogs.

---

## 4. Technology Stack

- **Frontend**: React 18, Vite 6, Modern CSS (Custom Properties, Flexbox, Grid), Native Fetch API.
- **Backend**: Node.js 20+, Express.js 4, Helmet 8, Express-Rate-Limit 7, CORS, Dotenv.
- **AI Provider**: Google Gemini API via official `@google/genai` SDK (`gemini-2.5-flash`).
- **Security & Cryptography**: Bcrypt.js (salted password hashing), Node.js `crypto` (timing-safe comparisons).
- **Testing**: Node.js native test runner (`node --test`), automated E2E validation suite.

---

## 5. Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Client (React)                        │
│  - MessageInput (5,000 char max, presets, counter)         │
│  - Selectors: Audience | Purpose | Tone | Length | Format   │
│  - ResultPanel (Side-by-side, Edit output, Copy, Badges)    │
│  - Modals: Privacy Policy | Terms of Service | Diagnostics  │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS (JSON POST /api/transform)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express Backend API                      │
│  - Helmet (CSP, HSTS, X-Content-Type-Options: nosniff)       │
│  - CORS (Whitelist validation)                              │
│  - Rate Limiter (30 req / 15m on transform)                 │
│  - Input Validator (Allowlists, 5000 max, XSS sanitization) │
│  - Centralized Error Handler (No stack traces in production)│
└──────────────────────────────┬──────────────────────────────┘
                               │ Structured JSON Request
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               Google Gemini API Service                     │
│  - Model: gemini-2.5-flash                                  │
│  - Strict System Instructions (Meaning Preservation)        │
│  - Schema: { rewrittenMessage, explanation, improvements }  │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Project Structure

```
persona-ai/
├── client/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── styles.css
│       └── components/
│           ├── Navbar.jsx
│           ├── Hero.jsx
│           ├── MessageInput.jsx
│           ├── AudienceSelector.jsx
│           ├── PurposeSelector.jsx
│           ├── ToneSelector.jsx
│           ├── LengthSelector.jsx
│           ├── FormatSelector.jsx
│           ├── ResultPanel.jsx
│           ├── ExplainChanges.jsx
│           ├── LoadingState.jsx
│           ├── ErrorMessage.jsx
│           ├── Footer.jsx
│           ├── PrivacyPolicyModal.jsx
│           ├── TermsModal.jsx
│           └── AdminDiagnosticsModal.jsx
├── server/
│   ├── package.json
│   ├── .env.example
│   ├── src/
│   │   ├── app.js
│   │   ├── routes/
│   │   │   ├── transform.js
│   │   │   ├── health.js
│   │   │   └── admin.js
│   │   ├── services/
│   │   │   └── aiService.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   └── rateLimiter.js
│   │   └── validators/
│   │       └── transformValidator.js
│   └── tests/
│       ├── server.test.mjs
│       └── e2e.test.mjs
├── .gitignore
├── package.json
└── README.md
```

---

## 7. Prerequisites

- **Node.js**: Version 20.x or 22.x or 24.x LTS
- **npm**: Version 10+
- **Google Gemini API Key**: Free tier or paid key from [Google AI Studio](https://aistudio.google.com/)

---

## 8. Installation & Setup

### Step 1: Clone or navigate to the repository
```bash
cd persona-ai
```

### Step 2: Install Server Dependencies
```bash
cd server
npm install
```

### Step 3: Install Client Dependencies
```bash
cd ../client
npm install
```

---

## 9. Environment Variable Setup

In the `server/` directory, create a `.env` file based on `.env.example`:

```bash
cd ../server
cp .env.example .env
```

Edit `server/.env` with your values:
```env
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173

# Gemini API Key from Google AI Studio: https://aistudio.google.com/
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash

# Admin Protected Diagnostics Key & Bcrypt Password Hash
ADMIN_SECRET_KEY=generate_a_random_32_character_string_here
ADMIN_PASSWORD_HASH=$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lR0e.uD15J7g8e3n35Ew8hW6xYV2m
```

> **Security Note:** Never commit `server/.env` or expose `GEMINI_API_KEY` to the client. `.gitignore` is pre-configured to strictly ignore all `.env` files.

---

## 10. Running the Application

### Development Mode

**Terminal 1 — Start the Backend Server:**
```bash
cd server
npm run dev
# Starts server on http://localhost:5000
```

**Terminal 2 — Start the Frontend Client:**
```bash
cd client
npm run dev
# Starts Vite dev server on http://localhost:5173
```

Visit `http://localhost:5173` in your browser.

### Unified Production Mode
You can build the frontend and serve it directly from Express:
```bash
cd client
npm run build
cd ../server
npm start
# Server serves API on /api/* and client static files on /* at http://localhost:5000
```

---

## 11. API Specification

### `POST /api/transform`
Transforms a user message based on context.

**Request Headers:**
`Content-Type: application/json`

**Request Body Example:**
```json
{
  "message": "Sir, I cannot submit the assignment today.",
  "audience": "Teacher",
  "purpose": "Request",
  "tone": "Respectful",
  "length": "Short",
  "format": "WhatsApp message"
}
```

**Success Response (HTTP 200):**
```json
{
  "success": true,
  "data": {
    "rewrittenMessage": "Respected Sir, I am writing to inform you that I will be unable to submit my assignment today. I apologize for the inconvenience.",
    "explanation": "Adapted wording to address the instructor with respectful academic etiquette while keeping the notification brief for messaging.",
    "improvements": [
      "Added respectful academic salutation",
      "Maintained concise message structure suitable for WhatsApp",
      "Preserved exact status without fabricating excuses"
    ]
  }
}
```

**Error Response Example (HTTP 400):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please enter a message before transforming it."
  }
}
```

---

### `GET /api/health`
Returns backend service health status.

**Success Response (HTTP 200):**
```json
{
  "success": true,
  "status": "healthy",
  "service": "OttoPersona AI Backend",
  "uptime": 1420,
  "timestamp": "2026-10-23T12:00:00.000Z"
}
```

---

### `GET /api/admin/status`
Protected administrative diagnostics (requires `Authorization: Bearer <ADMIN_SECRET_KEY>`).

**Success Response (HTTP 200):**
```json
{
  "success": true,
  "data": {
    "uptimeSeconds": 1420,
    "nodeVersion": "v24.22.1",
    "memoryRssMb": 48,
    "heapUsedMb": 24,
    "environment": "development",
    "aiConfigured": true,
    "securityHeaders": "Helmet CSP, HSTS, X-Content-Type-Options active",
    "rateLimiting": "Active (general: 150/15m, transform: 30/15m, auth: 10/15m)"
  }
}
```

---

## 12. Automated Testing

OttoPersona AI includes 22 automated tests covering input validation, error handling, rate limiting, security headers, admin authorization, and E2E transformation scenarios.

Run the entire test suite:
```bash
cd server
npm test
```

### Verified Scenarios:
- **Scenario 1:** Teacher request validation & context extraction
- **Scenario 2:** Recruiter job application context validation
- **Scenario 3:** Friend message casual tone adaptation
- **Scenario 4:** Uncertainty preservation (no commitment invention)
- **Scenario 5:** Empty message rejection (`VALIDATION_ERROR`)
- **Scenario 6:** Whitespace-only message rejection (`VALIDATION_ERROR`)
- **Scenario 7:** Length limit enforcement (>5,000 chars rejected with `MESSAGE_TOO_LONG`)
- **Scenario 8:** Invalid selector reject (`INVALID_AUDIENCE`, `INVALID_PURPOSE`, etc.)
- **Scenario 9:** Missing API key handling (`CONFIG_ERROR` HTTP 503 without server crash)
- **Scenario 10:** Malformed JSON payload rejection (`MALFORMED_JSON` HTTP 400)
- **Scenario 11:** Admin route unauthenticated rejection (`UNAUTHORIZED` HTTP 401)
- **Scenario 12:** Admin route password verification using bcrypt
- **Scenario 13:** Security header presence (`Helmet`, no `X-Powered-By`)
- **Scenario 14:** Production static bundle serving

---

## 13. Security & Privacy Audit Report

| Security Requirement | Status | Implementation Mechanism |
|---|---|---|
| **API Key Protection** | **PASSED** | Key stored strictly in `server/.env`; never exposed to browser or build outputs |
| **Git Leak Protection** | **PASSED** | `.gitignore` covers `.env`, `.env.*`, `node_modules`, `dist` |
| **XSS & Injection Protection** | **PASSED** | Backend input sanitization; React automatic JSX string escaping; no `dangerouslySetInnerHTML` |
| **Security Headers** | **PASSED** | Helmet with CSP, HSTS, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` |
| **Rate Limiting** | **PASSED** | `express-rate-limit` active on `/api/transform` (30/15m) and general API (150/15m) |
| **Server Fingerprinting** | **PASSED** | `app.disable('x-powered-by')` active |
| **CORS Policy** | **PASSED** | Whitelisted origin validation based on `CLIENT_ORIGIN` |
| **Admin Route Protection** | **PASSED** | Timing-safe Bearer token comparison (`crypto.timingSafeEqual`) + bcrypt password hashing |
| **Vulnerability Audit** | **PASSED** | 0 vulnerabilities on server, 0 vulnerabilities on client (`npm audit`) |

---

## 14. Four-Member Team Responsibilities

- **Member 1 (Frontend Lead)**: UI component architecture, accessible controls, responsive CSS grid, theme switching, result comparison view.
- **Member 2 (Backend & AI Lead)**: Express application lifecycle, `@google/genai` integration, system instructions, error handling, health endpoints.
- **Member 3 (Context Quality Lead)**: Parameter allowlists, system instruction fine-tuning, meaning preservation verification, explanation consistency.
- **Member 4 (QA, Security & Release Lead)**: Automated testing suites, security audits, CORS and rate limiting policies, README, and deployment readiness.

---

## 15. Deployment Instructions

### Frontend (e.g., Vercel / Cloudflare Pages / Netlify)
1. Set the Root Directory to `client`.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Environment variable: `VITE_API_BASE_URL=https://your-backend-domain.com` (if deploying separately).

### Backend (e.g., Render / Railway / Fly.io / AWS EC2)
1. Set Root Directory to `server`.
2. Start command: `npm start`
3. Configure Environment Variables in the hosting dashboard:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `CLIENT_ORIGIN=https://your-frontend-domain.com`
   - `GEMINI_API_KEY=your_production_gemini_api_key`
   - `ADMIN_SECRET_KEY=your_secure_random_key`

---

## 16. Known Limitations & Future Scope

### Known Limitations
- Transformations require an active Internet connection to communicate with Google Gemini API.
- If upstream Gemini API reaches rate limits or quota depletion, requests will pause until quota refreshes.

### Future Scope
- Optional client-side localStorage history toggle.
- Multi-language translation and tone adaptation (Spanish, Hindi, French, German).
- Audio speech input (Web Speech API) for voice message drafting.
- Browser extension for inline email and WhatsApp web transformation.

---

## 17. License

MIT License. Built for ethical, accessible, and context-aware communication.

