# Scheme Saathi — WhatsApp Government Scheme Chatbot 🇮🇳

> A lightweight, modular WhatsApp chatbot built for Indian citizens to discover government schemes they are eligible for, understand benefits, check required documents, and follow simple application steps.

---

## 📋 Table of Contents
- [1. Overview & Architecture](#1-overview--architecture)
- [2. Quick Start & Commands](#2-quick-start--commands)
- [3. How to Test Without WhatsApp](#3-how-to-test-without-whatsapp)
- [4. Meta WhatsApp Cloud API Setup](#4-meta-whatsapp-cloud-api-setup)
- [5. Public HTTPS Deployment for Webhook](#5-public-https-deployment-for-webhook)
- [6. Connecting to Teammates' Backend](#6-connecting-to-teammates-backend)
- [7. Privacy, Consent & Safeguards](#7-privacy-consent--safeguards)
- [8. Project Structure](#8-project-structure)

---

## 1. Overview & Architecture

Scheme Saathi handles WhatsApp citizen conversations end-to-end:
- **Languages:** Hindi (हिंदी) and English (easily extensible to more Indian languages).
- **Privacy & Consent First:** Strictly requires user consent before processing personal details. Supports instant revocation via `STOP`.
- **Sequential Questioning:** State/UT, Age, Occupation, and Category of Assistance.
- **Smart Validation & Navigation:** Validates states/UTs (with aliases like UP, MP, MH, Delhi), integer ages (1-120), and option selections. Supports `BACK`, `RESTART`, and `HELP` commands.
- **Scheme Matching Service:** Includes verified real Indian government schemes (PM-KISAN, Ayushman Bharat PM-JAY, PMAY, APY, PM Vishwakarma, Post-Matric Scholarship, etc.) with verified official URLs and criteria.
- **Modular Backend Adapter:** Seamlessly toggle between local `MOCK` mode and teammate `API` mode via `SCHEME_SERVICE_MODE`.
- **Meta Cloud API Ready:** Webhook challenge verification (`GET /webhook`), event ingestion (`POST /webhook`), HMAC SHA-256 signature verification (`x-hub-signature-256`), and duplicate message deduplication.

---

## 2. Quick Start & Commands

### Prerequisites
- Node.js v18+ (tested on Node v20/v26)
- npm v9+

### Installation
```bash
# Clone or navigate to the repository
cd CHATBOT

# Install dependencies
npm install
```

### Environment Configuration
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
*(The default `.env` is already configured for local mock mode, so you can run the bot immediately without needing Meta credentials)*

### Available npm Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Express server with live reload on port 3000 (`http://localhost:3000`) |
| `npm test` | Runs the full Vitest suite (30 unit & integration tests) |
| `npm run build` | Compiles TypeScript code to `dist/` |
| `npm start` | Runs the compiled production server from `dist/server.js` |
| `npm run simulate` | Launches the interactive terminal chatbot simulator |

---

## 3. How to Test Without WhatsApp

You do **not** need a Meta developer account or WhatsApp phone number to test or demo the bot. Scheme Saathi provides two simulation options:

### Option A: Interactive Terminal Simulator (Recommended for Live Demos)
Run:
```bash
npm run simulate
```
This starts an interactive chat in your terminal where you can type replies and view exact WhatsApp-formatted messages:
```
╔═══════════════════════════════════════════════════════════════════╗
║       🇮🇳  SCHEME SAATHI — LOCAL WHATSAPP CHATBOT SIMULATOR       ║
╚═══════════════════════════════════════════════════════════════════╝

👤 You: HI

💬 [Scheme Saathi 🤖]:
----------------------------------------------------
Welcome to *Scheme Saathi*! 🇮🇳
...
Please choose your preferred language:
1. Hindi (हिंदी)
2. English
----------------------------------------------------
```

### Option B: HTTP Simulation API (`POST /simulate`)
Start the server in one terminal:
```bash
npm run dev
```

In another terminal, simulate a user journey via `curl`:
```bash
# 1. Start chat
curl -X POST http://localhost:3000/simulate \
  -H "Content-Type: application/json" \
  -d '{"senderId": "test-user-1", "text": "HI"}'

# 2. Select Language (1 = Hindi, 2 = English)
curl -X POST http://localhost:3000/simulate \
  -H "Content-Type: application/json" \
  -d '{"senderId": "test-user-1", "text": "2"}'

# 3. Give Consent (1 = Yes, 2 = No)
curl -X POST http://localhost:3000/simulate \
  -H "Content-Type: application/json" \
  -d '{"senderId": "test-user-1", "text": "1"}'

# 4. State
curl -X POST http://localhost:3000/simulate \
  -H "Content-Type: application/json" \
  -d '{"senderId": "test-user-1", "text": "Uttar Pradesh"}'

# 5. Age
curl -X POST http://localhost:3000/simulate \
  -H "Content-Type: application/json" \
  -d '{"senderId": "test-user-1", "text": "28"}'

# 6. Occupation (1. Farmer, 2. Student, 3. Worker, 4. Business Owner, 5. Other)
curl -X POST http://localhost:3000/simulate \
  -H "Content-Type: application/json" \
  -d '{"senderId": "test-user-1", "text": "1"}'

# 7. Category (1. Agriculture, 2. Education, 3. Employment, 4. Housing, 5. Healthcare, etc.)
curl -X POST http://localhost:3000/simulate \
  -H "Content-Type: application/json" \
  -d '{"senderId": "test-user-1", "text": "1"}'
```

### Health Check Endpoint
```bash
curl http://localhost:3000/health
```
Response:
```json
{
  "status": "ok",
  "service": "scheme-saathi-whatsapp-bot",
  "version": "1.0.0",
  "uptimeSeconds": 42,
  "config": {
    "schemeServiceMode": "mock",
    "whatsappConfigured": false,
    "nodeEnv": "development"
  }
}
```

---

## 4. Meta WhatsApp Cloud API Setup

When you are ready to connect to a live WhatsApp number:

### Step 1: Create Meta Developer App
1. Go to the [Meta for Developers Portal](https://developers.facebook.com/).
2. Click **My Apps** > **Create App**.
3. Select **Other** > **Business** as the app type.
4. Add the **WhatsApp** product to your app.

### Step 2: Retrieve Credentials
Navigate to **WhatsApp** > **API Setup** in the left sidebar:
1. **Temporary Access Token** or **System User Token**: Copy and set as `WHATSAPP_TOKEN` in your `.env`.
2. **Phone Number ID**: Copy the test phone number ID (e.g. `1049284...`) and set as `WHATSAPP_PHONE_NUMBER_ID`.
3. Go to **App Settings** > **Basic**: Copy **App Secret** and set as `WHATSAPP_APP_SECRET`.
4. Choose any random secret string for `WHATSAPP_VERIFY_TOKEN` (e.g., `scheme_saathi_webhook_token_2025`).

### Step 3: Configure Webhook in Meta Dashboard
1. Under **WhatsApp** > **Configuration**, find the **Webhook** section.
2. Click **Edit**:
   - **Callback URL:** `https://your-public-domain.com/webhook`
   - **Verify Token:** The exact string you set in `WHATSAPP_VERIFY_TOKEN`.
3. Click **Verify and Save**. Meta will send a `GET` request to your `/webhook` endpoint with `hub.challenge`.
4. Under **Webhook fields**, click **Manage** and subscribe to `messages`.

---

## 5. Public HTTPS Deployment for Webhook

Meta requires a publicly accessible **HTTPS** URL to deliver webhooks.

### Option A: Local Tunnel with Ngrok (Fastest for Hackathon)
```bash
# Install ngrok if needed (brew install ngrok)
ngrok http 3000
```
Ngrok will display a public HTTPS URL like:
`https://a1b2-c3d4.ngrok-free.app`

Set Meta's Callback URL to:
`https://a1b2-c3d4.ngrok-free.app/webhook`

### Option B: Cloudflare Tunnel (Free & No timeout)
```bash
npx cloudflared tunnel --url http://localhost:3000
```

### Option C: Cloud Deployment (Render / Railway)
- Deploy this repository to [Render](https://render.com) or [Railway](https://railway.app).
- Set Environment Variables:
  - `PORT=3000`
  - `NODE_ENV=production`
  - `WHATSAPP_TOKEN=...`
  - `WHATSAPP_PHONE_NUMBER_ID=...`
  - `WHATSAPP_VERIFY_TOKEN=...`
  - `WHATSAPP_APP_SECRET=...`
  - `SCHEME_SERVICE_MODE=mock` (or `api`)
- Webhook URL: `https://your-app-name.onrender.com/webhook`

---

## 6. Connecting to Teammates' Backend

The chatbot uses the Adapter pattern in [src/services/schemeService.ts](file:///Users/suyashmishra/Desktop/CHATBOT/src/services/schemeService.ts).

### Switching Modes
To switch from Mock mode to Teammates' API mode, change in `.env`:
```env
SCHEME_SERVICE_MODE=api
BACKEND_API_URL=http://localhost:4000
BACKEND_API_TIMEOUT_MS=5000
```

### API Contract Details to Request from Teammates

Provide this specification to your teammates building the backend:

#### 1. Matching Request (Chatbot -> Teammates' Backend)
- **Method:** `POST`
- **Path:** `/api/schemes/match` (configurable in [src/services/apiSchemeService.ts](file:///Users/suyashmishra/Desktop/CHATBOT/src/services/apiSchemeService.ts))
- **Headers:** `Content-Type: application/json`
- **Payload:**
```json
{
  "state": "Uttar Pradesh",
  "age": 28,
  "occupation": "Farmer",
  "category": "Agriculture",
  "language": "en"
}
```

#### 2. Expected Response (Teammates' Backend -> Chatbot)
The backend should return an array of schemes (either directly `[...]` or wrapped in `{ "schemes": [...] }`):
```json
{
  "success": true,
  "schemes": [
    {
      "id": "pm-kisan-01",
      "name": "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
      "category": "Agriculture",
      "state": "Central / All India",
      "description": "Income support to landholding farmer families.",
      "benefits": "₹6,000 per year in 3 installments via DBT.",
      "eligibilitySummary": "Small and marginal landholder farmer families.",
      "requiredDocuments": [
        "Aadhaar Card",
        "Land Record (Khasra/Khatauni)",
        "Bank Passbook"
      ],
      "applicationSteps": [
        "Register on https://pmkisan.gov.in",
        "Enter Aadhaar and complete OTP verification",
        "Submit land details"
      ],
      "officialUrl": "https://pmkisan.gov.in",
      "lastVerifiedAt": "2025-01-15"
    }
  ]
}
```

#### Resilience Built-in:
- **5-second Timeout:** If teammates' server is lagging, requests abort gracefully after 5000ms.
- **Fail-safe Message:** If teammates' backend throws 500 or goes offline, the chatbot returns a friendly delay notice instead of crashing.

---

## 7. Privacy, Consent & Safeguards

In accordance with responsible governance and hackathon guidelines:
1. **Server-Enforced Consent:** Answers are not processed or stored unless affirmative consent is recorded for the sender.
2. **Instant Revocation:** Sending `STOP`, `रोकें`, or `रद्द` immediately clears all session answers, sets consent to `false`, and stops messaging.
3. **No Sensitive PII:** Scheme Saathi **never** asks for Aadhaar numbers, bank account numbers, OTPs, passwords, or document uploads.
4. **Log Privacy:** Console logs sanitize sender numbers and **never** log citizen answers.
5. **Clear Guidance Disclaimer:** Every recommendation emphasizes that matches are guidance suggestions and users must verify official rules before applying.
6. **No Phantom Rejections:** When no schemes match, the bot explicitly clarifies that this does **not** mean the citizen is ineligible for government assistance.

---

## 8. Project Structure

```
CHATBOT/
├── .env                  # Local environment configuration
├── .env.example          # Template with documentation for all variables
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies and npm scripts
├── tsconfig.json         # TypeScript configuration (NodeNext)
├── README.md             # This comprehensive guide
├── src/
│   ├── server.ts         # Express server with raw-body capture & routes
│   ├── simulator.ts      # Interactive CLI WhatsApp simulator
│   ├── types/
│   │   ├── scheme.ts     # Scheme and UserProfile types & interfaces
│   │   └── conversation.ts # Conversation step, state & store interfaces
│   ├── chatbot/
│   │   ├── index.ts      # Module exports & singleton instances
│   │   ├── conversationFlow.ts # State machine, validations, back navigation
│   │   ├── conversationManager.ts # In-memory store & deduplication
│   │   └── translations.ts # English & Hindi copy, Indian states list
│   ├── middleware/
│   │   └── verifyMetaSignature.ts # HMAC SHA-256 Meta signature validator
│   ├── routes/
│   │   ├── health.ts     # GET /health
│   │   ├── webhook.ts    # GET & POST /webhook
│   │   └── simulate.ts   # POST & DELETE /simulate
│   └── services/
│       ├── whatsappService.ts # WhatsApp Cloud API sender
│       ├── schemeService.ts   # Facade toggling Mock and API modes
│       ├── mockSchemeService.ts # 12 verified Central & State schemes
│       └── apiSchemeService.ts  # HTTP client with Zod validation
└── tests/
    ├── conversationFlow.test.ts # 19 tests: welcome, consent, validation, commands, deduplication
    ├── apiSchemeService.test.ts # 3 tests: API adapter, Zod validation, timeouts
    └── webhook.test.ts          # 8 tests: health, challenge, event receiving, HMAC signatures
```
