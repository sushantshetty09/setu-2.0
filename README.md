# SETU (सेतु) — One Voice. Every Service.

> **National AI-Powered Government Schemes Discovery Portal**
> *A production-ready prototype empowering Indian citizens to discover, verify, and access government welfare entitlements through natural conversation in 12 Indian languages.*

---

## Brand & Identity

| Property | Value |
|---|---|
| **Name** | SETU (सेतु) |
| **Tagline** | One Voice. Every Service. |
| **Typography** | Noto Sans — Devanagari, Kannada, Tamil, Telugu, and Pan-Indian scripts |
| **Icon system** | Lucide Icons (SVG only — zero emoji policy across all UI and AI responses) |

**Brand Colors**

| Token | Hex |
|---|---|
| Primary Blue | `#1A3A6B` |
| Saffron Accent | `#FF6B00` |
| India Green | `#138808` |
| Background | `#F5F7FA` |
| White | `#FFFFFF` |

---

## Quick Start

### Option 1 — One-Click Launch (Windows)

```bash
.\start.bat
```

### Option 2 — Manual Start

**Backend** (FastAPI + SQLAlchemy + Claude Tool Calling):

```bash
cd backend
py -m pip install -r requirements.txt
py run.py
```

Backend runs on `http://localhost:8000`
API docs at `http://localhost:8000/docs`

**Frontend** (React 18 + TypeScript + Vite + Tailwind CSS):

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | **Home** | Accessibility bar (A-/A+, contrast toggle), large voice search bar (Web Speech API), 12 category cards, animated stats, interactive SVG India state map, popular schemes horizontal scroll |
| `/find` | **Eligibility Wizard** | 4-step progressive questionnaire (Age, Gender, State, Income slider, Social category, BPL, Needs) with real-time match scoring and eligibility criteria checklist modal |
| `/schemes` | **Scheme Listing** | Directory with search bar, sidebar filters (Categories, States, Central/State, Benefit types, Online/Offline), sorting, and skeleton loaders |
| `/schemes/:id` | **Scheme Detail** | 6 functional tabs: Overview, Eligibility, Benefits, Documents Required (PDF checklist download), How to Apply, FAQs — plus quick info card and official portal links |
| `/chat` | **SETU AI Assistant** | Real-time SSE chat with voice input and a dynamic 5-state right context panel: Idle, Schemes, Docs checklist, DigiLocker OAuth, Eligibility breakdown |
| `/csc` | **CSC Operator Portal** | Village Level Entrepreneur dashboard (`operator@csc.gov.in` / `demo123`), daily stats, citizen assistance logs, on-behalf intake mode, printable citizen summary reports |
| `/about` | **About** | Mission, governance standards, GIGW / WCAG 2.0 AA compliance, participating ministries |

---

## Verified User Scenarios

**1. Voice Search from Home**
Click mic on home page → speak requirement (e.g. *"scholarship for my daughter in college"*) → auto-fills and redirects to `/chat` with AI scheme recommendations.

**2. Eligibility Wizard**
Fill: 35-yr female · Karnataka · Rs 1.8L income → Gruha Lakshmi matches at 98% score → click *"Check Eligibility"* for green checkmark breakdown.

**3. Payment Status + DigiLocker**
Ask in chat: *"Did I get my Gruha Lakshmi money this month?"* → triggers DigiLocker permission card → click *"Connect DigiLocker"* → instant verified DBT credit response (Rs 2,000 to A/C ending 7834 on 15 Nov 2024).

**4. Multilingual Switch**
Switch to ಕನ್ನಡ (Kannada) or हिन्दी (Hindi) → UI translates and AI responds fluently in native script.

**5. CSC Operator Assist**
Log in with `operator@csc.gov.in` / `demo123` → fill walk-in citizen form → generate and print a formatted summary report.

---

## Architecture

See [`architecture.md`](./architecture.md) for the full layer-by-layer breakdown, data flows, and service diagram.

### Overview

```
Users
  ├── Citizen
  └── CSC Operator
        │
        ▼
Frontend  (React 18 / TypeScript · Vite · Tailwind · React Router · i18next)
        │
        ▼
Backend API  (FastAPI / Python)
  REST API · request routing
  ├── Scheme service
  ├── Eligibility service
  ├── Chat service  ──── SSE stream
  ├── DigiLocker service
  ├── CSC service
  └── Grievance service
        │
        ├──▶ AI Intelligence
        │      AI Agent (claude-sonnet-4-6)
        │      Intent · Tool Calling · Orchestration
        │            │
        │            └── Rule-based fallback (if AI unavailable)
        │                Multilingual · DB retrieval
        │
        ├──▶ Data Layer  (SQLAlchemy ORM)
        │      SQLite (dev) · PostgreSQL (prod)
        │      schemes · grievances · csc_users · citizen_query_logs
        │
        ├──▶ Cache  (Redis · optional)
        │      Scheme metadata · Categories · FAQs
        │      In-memory fallback if Redis unavailable
        │
        └──▶ External Integrations
               Anthropic Claude API
               DigiLocker (OAuth · document verification)
               Government scheme portals
               Web Speech API
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, React Router, i18next |
| Backend | FastAPI, Python |
| ORM | SQLAlchemy |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Cache | Redis (optional — in-memory fallback) |
| AI | Anthropic Claude (`claude-sonnet-4-6`) — tool-calling + streaming |
| Voice | Web Speech API (browser-native, no third-party STT cost) |
| Auth / Docs | DigiLocker OAuth |
| Compliance | GIGW · WCAG 2.0 AA |

---

## Design Principles

- **Graceful degradation** — Redis and AI agent both have fallbacks; system stays operational under any failure
- **Multilingual-first** — i18next on frontend; AI and rule-based fallback both respond in native script
- **Voice-accessible** — Web Speech API for low-literacy users; no app install required
- **CSC operator support** — Dedicated portal enables assisted-service mode for rural Common Service Centres
- **DB portability** — SQLite for zero-config local dev; PostgreSQL-compatible for production scale
- **Zero-emoji policy** — All UI elements and AI responses use SVG icons and Indian script typography only

---

## Compliance

- Guidelines for Indian Government Websites (GIGW)
- WCAG 2.0 AA accessibility standard
