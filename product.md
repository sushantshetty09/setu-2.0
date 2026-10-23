# SETU (सेतु) — Product Document

> **One Voice. Every Service.**
> National AI-Powered Government Schemes Discovery Portal for Indian Citizens

---

## Table of Contents

1. [What is SETU?](#1-what-is-setu)
2. [Who is it for?](#2-who-is-it-for)
3. [The Problem it Solves](#3-the-problem-it-solves)
4. [How it Works — End to End](#4-how-it-works--end-to-end)
5. [Feature Walkthrough](#5-feature-walkthrough)
   - [Home Page](#51-home-page)
   - [Eligibility Wizard](#52-eligibility-wizard)
   - [Scheme Directory & Detail](#53-scheme-directory--detail)
   - [SETU AI Assistant](#54-setu-ai-assistant)
   - [CSC Operator Portal](#55-csc-operator-portal)
   - [About Page](#56-about-page)
6. [AI Intelligence — How the Brain Works](#6-ai-intelligence--how-the-brain-works)
7. [Multilingual Support](#7-multilingual-support)
8. [Accessibility](#8-accessibility)
9. [Data & Privacy](#9-data--privacy)
10. [External Integrations](#10-external-integrations)
11. [Tech Stack at a Glance](#11-tech-stack-at-a-glance)
12. [Design System](#12-design-system)
13. [Compliance & Governance](#13-compliance--governance)
14. [Roadmap Considerations](#14-roadmap-considerations)

---

## 1. What is SETU?

SETU (सेतु, meaning *bridge* in Sanskrit) is a production-ready, AI-powered web portal that acts as a single unified gateway to India's government welfare schemes and services.

A citizen can walk up to SETU — in any of 12 Indian languages, by voice or text — describe their situation in plain words, and immediately receive:

- Schemes they are eligible for, ranked by relevance
- A step-by-step eligibility verification
- A checklist of documents required
- Direct links to apply on official government portals
- Payment and DBT (Direct Benefit Transfer) status via DigiLocker
- Grievance filing and tracking

SETU bridges the gap between the complexity of the Indian government's welfare infrastructure and the everyday citizen who needs it most — without requiring them to know scheme names, ministry websites, or bureaucratic language.

---

## 2. Who is it for?

### Primary Users

**Citizens**
Any Indian resident seeking access to government welfare entitlements — scholarships, pensions, housing subsidies, agricultural support, health schemes, and more. Particularly designed for users who:
- Are not familiar with government portal names or scheme terminology
- Prefer to speak in their native language (Kannada, Hindi, Tamil, Telugu, etc.)
- Have low digital literacy and need step-by-step guidance
- Are in rural areas with access only through a CSC (Common Service Centre)

**CSC Operators (Village Level Entrepreneurs)**
Trained government-appointed operators at Common Service Centres who assist citizens in rural and semi-urban areas. SETU gives them a dedicated portal to:
- Log in and access an operator dashboard
- Fill forms on behalf of walk-in citizens
- Generate and print formatted citizen summary reports
- Track daily assisted-service activity

### Secondary Stakeholders

- **Government ministries** — SETU surfaces their schemes to a broader audience
- **NGOs and field workers** — Can use SETU as a reference tool to guide beneficiaries
- **Policy researchers** — Citizen query logs provide anonymised insight into scheme demand

---

## 3. The Problem it Solves

India has hundreds of welfare schemes across central and state governments — for agriculture, education, health, housing, women empowerment, minority welfare, and more. The problems citizens face:

| Problem | How SETU Addresses It |
|---|---|
| Citizens don't know which schemes exist | AI assistant + scheme directory with search and filters |
| Scheme eligibility criteria are complex | Eligibility wizard with step-by-step scoring and visual breakdown |
| Government portals are in English only | 12 Indian language support across UI and AI responses |
| Voice and literacy barriers | Web Speech API — speak to search, no typing required |
| Document requirements are unclear | Per-scheme document checklist with PDF download |
| DBT payment status requires portal login | DigiLocker OAuth integration — instant verified status |
| Rural citizens can't access digital services | CSC Operator Portal for assisted-mode service delivery |
| AI chatbots fail when internet/API is down | Rule-based multilingual fallback engine — always available |

---

## 4. How it Works — End to End

```
Citizen or CSC Operator
        │
        │  speaks / types in any Indian language
        ▼
SETU Frontend  (React 18 · TypeScript · Vite)
        │
        │  REST calls + SSE stream
        ▼
FastAPI Backend  — request routing
        │
        ├──▶ Scheme service      ──▶ DB: schemes
        ├──▶ Eligibility service ──▶ DB: schemes + user profile
        ├──▶ Chat service        ──▶ AI Agent (Claude sonnet-4-6)
        │                                │
        │                                ├──▶ Tool: scheme lookup
        │                                ├──▶ Tool: eligibility check
        │                                ├──▶ Tool: payment status (DigiLocker)
        │                                ├──▶ Tool: document list
        │                                └──▶ Tool: grievance filing
        │                                │
        │                                └── if unavailable ──▶ Rule-based fallback
        │                                                        DB retrieval · multilingual replies
        ├──▶ DigiLocker service  ──▶ DigiLocker OAuth API
        ├──▶ CSC service         ──▶ DB: csc_users
        └──▶ Grievance service   ──▶ DB: grievances
                │
                ├──▶ Redis cache (scheme metadata · categories · FAQs)
                │    └── in-memory fallback if Redis unavailable
                │
                └──▶ DB: citizen_query_logs (analytics)
```

Every response — whether from the AI agent or the fallback engine — is delivered in the language the citizen used to ask.

---

## 5. Feature Walkthrough

### 5.1 Home Page  `/`

The entry point for citizens. Designed for maximum accessibility and immediate action.

**What's on this page:**

- **Accessibility bar** — Font size controls (A- / A+) and high-contrast toggle, persistent across the session
- **Voice search bar** — Powered by the Web Speech API. Citizen speaks their need ("I need a scholarship for my daughter") → query auto-fills → redirected to the AI Assistant with context pre-loaded
- **12 category cards** — Quick entry points: Agriculture, Education, Health, Housing, Women & Child, Minority Welfare, Senior Citizens, Disability, Employment, Entrepreneurship, Sports, and Environment
- **Animated statistics** — Live-feel counters showing scheme count, languages supported, states covered
- **Interactive SVG India map** — Click any state to filter schemes by state government
- **Popular schemes horizontal scroll** — Trending / high-uptake schemes surfaced for quick access

**User journey this enables:**
A first-time user lands here with no prior knowledge of any scheme. They tap the mic, say *"mujhe kisan samman nidhi chahiye"* (I want PM-KISAN support) in Hindi, and are immediately taken to the AI assistant with the right context — without typing a single character.

---

### 5.2 Eligibility Wizard  `/find`

A guided, structured alternative to the open-ended AI chat — for users who prefer a form-based flow.

**How it works:**

4 progressive steps, each collecting one cluster of data:

| Step | Fields |
|---|---|
| 1. Personal | Age, Gender |
| 2. Location | State, District |
| 3. Income | Annual income slider, BPL card status |
| 4. Needs | Social category (SC/ST/OBC/General), specific needs checkboxes |

After submission:
- Schemes are ranked by a **real-time match score** (e.g. "98% match")
- Each matched scheme shows an **eligibility checklist modal** — a green/red breakdown of which criteria the user meets and which they don't
- User can proceed directly to Scheme Detail or open the AI assistant for more help

**Why this exists alongside the AI chat:**
Some users distrust open-ended AI. A structured wizard feels familiar (like filling a government form) and gives deterministic, explainable results — building trust before they engage the AI assistant.

---

### 5.3 Scheme Directory & Detail  `/schemes` and `/schemes/:id`

**Scheme Listing `/schemes`**

A full searchable, filterable directory of all schemes in the database.

- Search bar with live results
- Sidebar filters: Category, State, Central vs State scheme, Benefit type (cash/in-kind/service), Online/Offline application
- Sort by: Relevance, Newest, Benefit amount
- Skeleton loaders for perceived performance on slow connections

**Scheme Detail `/schemes/:id`**

Six functional tabs per scheme:

| Tab | Contents |
|---|---|
| Overview | Summary, ministry, launch year, beneficiary count |
| Eligibility | Full criteria list — age, income, category, state, occupation |
| Benefits | What the citizen gets — amount, frequency, nature (DBT/in-kind) |
| Documents Required | Itemised document checklist with **one-click PDF download** |
| How to Apply | Step-by-step application guide, online vs offline process |
| FAQs | Common questions seeded from official scheme documentation |

Also on this page:
- **Quick info card** — Scheme at a glance (ministry, deadline, benefit amount)
- **Official portal link** — Deep-link to the actual government application portal

---

### 5.4 SETU AI Assistant  `/chat`

The core of SETU. A real-time conversational interface backed by Claude (`claude-sonnet-4-6`) with Server-Sent Events (SSE) streaming so responses appear word by word, not all at once.

**Input modes:**
- Text input in any of 12 Indian languages
- Voice input via Web Speech API — speak directly into the chat

**The dynamic right context panel** — 5 states:

| Panel State | Triggered When | Shows |
|---|---|---|
| Idle | No active context | Welcome message, suggested prompts |
| Schemes | AI identifies matching schemes | Scheme cards with match scores |
| Docs checklist | User asks about documents | Itemised checklist for the relevant scheme |
| DigiLocker OAuth | User asks about payment/document status | "Connect DigiLocker" permission card |
| Eligibility breakdown | AI runs eligibility check | Green/red criteria checklist |

**What the AI can do (via tool calling):**

- Look up schemes by category, state, eligibility profile
- Check a citizen's eligibility against specific scheme criteria
- Retrieve payment/DBT credit status from DigiLocker (post-OAuth)
- Pull the document checklist for any scheme
- File a grievance on behalf of the citizen
- Answer questions about application process, deadlines, benefit amounts

**Example conversation:**

> Citizen: *"Did I get my Gruha Lakshmi money this month?"*
>
> → AI detects payment-status intent
> → Right panel switches to DigiLocker OAuth state
> → Citizen taps "Connect DigiLocker"
> → AI retrieves verified DBT record: Rs 2,000 credited to A/C ending 7834 on 15 Nov 2024
> → Response delivered in Kannada if that was the input language

---

### 5.5 CSC Operator Portal  `/csc`

A dedicated dashboard for Village Level Entrepreneurs (VLEs) operating at Common Service Centres — the government's last-mile digital service delivery network.

**Login:** `operator@csc.gov.in` / `demo123`

**Dashboard features:**

- Daily stats: citizens assisted, schemes processed, grievances filed
- Recent citizen assistance log with timestamps
- **On-behalf intake mode** — Operator fills the eligibility wizard or chat on behalf of a walk-in citizen (e.g. an elderly farmer who cannot use a smartphone)
- **Printable citizen summary report** — A formatted, printable page the citizen can take home: their matched schemes, eligibility status, document checklist, and next steps

**Why this matters:**
A significant portion of India's rural population will never access SETU directly on a smartphone. The CSC portal ensures SETU reaches them through the existing network of ~5 lakh Common Service Centres.

---

### 5.6 About Page  `/about`

- Platform mission and origin
- GIGW (Guidelines for Indian Government Websites) compliance statement
- WCAG 2.0 AA accessibility certification statement
- List of participating ministries and scheme sources

---

## 6. AI Intelligence — How the Brain Works

SETU's AI layer is designed to be reliable even when the underlying AI API is unavailable.

### Primary Path — Claude Tool Calling

```
User message
      │
      ▼
AI Agent  (claude-sonnet-4-6)
Intent detection · conversation orchestration
      │
      ├── intent: scheme_discovery
      │     └── Tool: search_schemes(category, state, eligibility_profile)
      │
      ├── intent: eligibility_check
      │     └── Tool: check_eligibility(scheme_id, user_profile)
      │
      ├── intent: payment_status
      │     └── Tool: get_dbt_status(digilocker_token, scheme_id)
      │
      ├── intent: document_list
      │     └── Tool: get_documents(scheme_id)
      │
      └── intent: grievance
            └── Tool: file_grievance(scheme_id, description, citizen_profile)
```

Claude receives the conversation, detects intent, calls the appropriate backend tool, receives structured data back, and composes a natural language response in the citizen's language.

### Fallback Path — Rule-Based Engine

If the Claude API is unavailable (timeout, quota, network error), the system automatically falls back to a **deterministic rule-based engine** that:

- Queries the database directly for scheme matches
- Returns pre-written multilingual response templates
- Covers the most common intents: scheme discovery, eligibility, document lists
- Ensures 100% uptime for basic queries regardless of AI API status

This dual-path design means SETU never shows a blank error screen to a citizen.

---

## 7. Multilingual Support

SETU supports 12 Indian languages across all layers:

| Layer | How |
|---|---|
| Frontend UI | `react-i18next` — all static strings translated |
| AI responses | Claude prompted to respond in the input language |
| Fallback engine | Pre-written response templates in all 12 languages |
| Voice input | Web Speech API configured per selected language |
| Typography | Noto Sans — covers Devanagari, Kannada, Tamil, Telugu, and other scripts |

**Supported languages include:** Hindi, Kannada, Tamil, Telugu, Marathi, Bengali, Gujarati, Malayalam, Odia, Punjabi, Assamese, Urdu.

A citizen who switches to ಕನ್ನಡ (Kannada) mid-session gets the UI in Kannada and AI responses written in Kannada script — not transliterated, not translated on the fly by a widget, but natively composed.

---

## 8. Accessibility

SETU is built to WCAG 2.0 AA and GIGW standards.

| Feature | Implementation |
|---|---|
| Font size controls | A- / A+ buttons, persistent in session |
| High contrast mode | Toggle in accessibility bar |
| Voice input | Web Speech API — no typing required |
| Screen reader support | Semantic HTML, ARIA labels throughout |
| Keyboard navigation | Full tab-order support |
| Zero-emoji policy | All iconography is SVG (Lucide Icons) — renders cleanly with screen readers |
| Script legibility | Noto Sans chosen specifically for clarity in Indian scripts at small sizes |

---

## 9. Data & Privacy

| Data type | Stored where | Purpose |
|---|---|---|
| Scheme catalogue | `schemes` table (SQLite/PostgreSQL) | Core product data |
| Citizen query logs | `citizen_query_logs` table | Analytics, AI improvement |
| CSC user accounts | `csc_users` table | Operator authentication |
| Grievances | `grievances` table | Tracking and resolution |
| DigiLocker tokens | Not persisted | Used in-session only for API calls |
| Personal profile data | Not persisted server-side | Eligibility wizard runs client-side; only query intent is logged |

DigiLocker OAuth tokens are ephemeral — used only for the duration of the session to fetch payment/document status and never written to the database.

---

## 10. External Integrations

### Anthropic Claude API
- Model: `claude-sonnet-4-6`
- Used for: intent detection, tool orchestration, natural language response generation
- Fallback: rule-based engine takes over if unavailable

### DigiLocker
- Flow: OAuth 2.0 authorization initiated from the chat panel
- Used for: verifying DBT payment credits, fetching issued government documents
- Citizen consent required before any data is accessed

### Government Scheme Portals
- SETU deep-links to official portals (NIC-hosted, ministry portals) for actual application submission
- SETU does not process applications itself — it is a discovery and guidance layer

### Web Speech API
- Browser-native voice recognition (no third-party STT service)
- No audio is sent to any external server
- Language configurable per the selected UI language

---

## 11. Tech Stack at a Glance

| Layer | Technology | Why |
|---|---|---|
| Frontend | React 18 + TypeScript + Vite | Fast dev builds, strong typing, component model |
| Styling | Tailwind CSS | Utility-first, rapid UI, consistent spacing |
| Routing | React Router | SPA navigation, clean URL structure |
| i18n | react-i18next | Industry standard, lazy-loads language bundles |
| Backend | FastAPI (Python) | Async, fast, excellent OpenAPI docs auto-generation |
| ORM | SQLAlchemy | DB-agnostic — same code works on SQLite and PostgreSQL |
| Database | SQLite (dev) / PostgreSQL (prod) | Zero-config local dev; scales to production |
| Cache | Redis (optional) | Scheme metadata caching; in-memory fallback |
| AI | Anthropic Claude sonnet-4-6 | Best-in-class tool calling, multilingual, streaming |
| Voice | Web Speech API | Free, browser-native, no third-party dependency |
| Auth/Docs | DigiLocker OAuth | Official Indian government document verification |
| Icons | Lucide Icons (SVG) | Accessible, scalable, zero emoji |
| Typography | Noto Sans | Full Pan-Indian script coverage |

---

## 12. Design System

### Brand Colors

| Token | Hex | Usage |
|---|---|---|
| Primary Blue | `#1A3A6B` | Headers, primary buttons, nav |
| Saffron Accent | `#FF6B00` | CTAs, highlights, active states |
| India Green | `#138808` | Success states, eligibility matches |
| Background | `#F5F7FA` | Page backgrounds |
| White | `#FFFFFF` | Cards, modals |

### Principles

- **SVG-only icons** — Lucide Icons throughout; zero emojis anywhere in UI or AI output
- **Indian script first** — Typography chosen for legibility of Devanagari, Kannada, Tamil, and Telugu at all sizes
- **Government-grade visual language** — Color palette draws from the Indian tricolour; feels official and trustworthy
- **Accessible contrast ratios** — All text/background combinations meet WCAG AA minimum

---

## 13. Compliance & Governance

| Standard | Status |
|---|---|
| GIGW (Guidelines for Indian Government Websites) | Compliant |
| WCAG 2.0 AA | Compliant |
| DigiLocker integration | Official OAuth flow |
| Data localisation | All data stored locally (SQLite/PostgreSQL on-premise or Indian cloud) |

---

## 14. Roadmap Considerations

The following are natural next steps for SETU beyond the current prototype:

- **State government API integrations** — Live scheme status pulls from state portals (Karnataka Seva Sindhu, MahaDBT, etc.)
- **WhatsApp / SMS channel** — Reach citizens without smartphones via conversational flows on WhatsApp Business API or USSD
- **Aadhaar-linked auto-fill** — With citizen consent, pre-fill eligibility wizard using DigiLocker-linked Aadhaar demographic data
- **Grievance portal integration** — Connect to CPGRAMS (Central Public Grievance Redress and Monitoring System) for real-time grievance tracking
- **Offline PWA mode** — Cache scheme data for use in low-connectivity areas
- **Analytics dashboard** — For government administrators to see which schemes have high demand but low uptake (discovery gap)
- **Voice-only mode** — Full IVR-style flow for feature phones and blind users

---

*This document covers the full product as built. For technical architecture detail, see [`architecture.md`](./architecture.md). For setup instructions, see [`README.md`](./README.md).*
EOF
