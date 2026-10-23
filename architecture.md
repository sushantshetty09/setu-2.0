# SETU — One Voice. Every Service.
> AI-powered gateway to government services for Indian citizens

---

## Overview

SETU is a full-stack, AI-augmented platform that gives Indian citizens and CSC operators a single unified interface to discover, apply for, and track government schemes and services — including DigiLocker document flows, grievance filing, and multilingual voice support.

---

## Architecture Diagram

```
┌─────────────┐     ┌──────────────────────────────────────┐     ┌──────────────────────────────────────┐     ┌────────────────────────────────────────┐
│   Users     │────▶│     Frontend · React 18 / TypeScript  │────▶│     Backend API · FastAPI / Python    │────▶│         AI Intelligence                │
│             │     │   Vite · Tailwind · React Router      │     │                                      │     │                                        │
│  Citizen    │     │   · i18next                           │     │  REST API · request routing          │     │  AI Agent                              │
│             │     │                                       │     │                                      │     │  Intent · orchestration · responses    │
│  CSC        │     │  Pages / Views:                       │     │  Microservices:                      │     │          │                             │
│  Operator   │     │  · Home                               │     │  · Scheme service                    │     │          ▼                             │
└─────────────┘     │  · Scheme directory                   │     │  · Eligibility service               │     │  Tool Calling                          │
                    │  · Scheme details                     │     │  · Chat service      ◀── chat/stream │     │  Schemes · eligibility · payments      │
                    │  · Eligibility wizard                 │     │  · DigiLocker service                │     │  Documents · grievances                │
                    │  · AI assistant                       │     │  · CSC service                       │     │          │                             │
                    │  · CSC portal                         │     │  · Grievance service                 │     │  if unavailable ▼                      │
                    │  · Voice input                        │     │                                      │     │  Rule-based Fallback                   │
                    │  · DigiLocker flow                    │     │                                      │     │  Database retrieval · multilingual      │
                    └──────────────────────────────────────┘     └──────────────────────────────────────┘     └────────────────────────────────────────┘
                                                                              │
                              ┌───────────────────────────────────────────────┴───────────────────────────┐
                              │                                                                            │
                    ┌─────────────────────┐                               ┌──────────────────────────────────────────────┐
                    │  Cache · Redis       │                               │  Data · SQLAlchemy ORM                       │
                    │  (optional)          │                               │  SQLite default · PostgreSQL compatible      │
                    │                     │                               │                                              │
                    │  · Scheme metadata  │◀──────────────────────────────│  Databases:                                  │
                    │  · Categories       │                               │  · Schemes                                   │
                    │  · FAQs             │                               │  · Grievances                                │
                    │  · In-memory        │                               │  · CSC users                                 │
                    │    fallback         │                               │  · Citizen query logs                        │
                    └─────────────────────┘                               └──────────────────────────────────────────────┘

                    ┌──────────────────────────────────────────────────────┐
                    │  External Integrations                               │
                    │                                                      │
                    │  · Anthropic Claude API                              │
                    │  · DigiLocker · authorization / verification        │
                    │  · Government scheme portals                        │
                    │  · Web Speech API                                   │
                    └──────────────────────────────────────────────────────┘
```

---

## Layer Breakdown

### 1. Users
| Actor | Role |
|---|---|
| **Citizen** | Browses schemes, checks eligibility, files grievances, interacts via voice/chat |
| **CSC Operator** | Uses CSC portal to assist citizens at Common Service Centres |

---

### 2. Frontend — React 18 / TypeScript
**Stack:** Vite · Tailwind CSS · React Router · i18next

| View / Page | Purpose |
|---|---|
| Home | Landing, navigation entry point |
| Scheme directory | Browse and search all government schemes |
| Scheme details | Full information, documents needed, apply links |
| Eligibility wizard | Step-by-step eligibility check for a scheme |
| AI assistant | Chat/voice interface to SETU's AI agent |
| CSC portal | Operator dashboard |
| Voice input | Microphone capture → Web Speech API |
| DigiLocker flow | OAuth/document fetch from DigiLocker |

---

### 3. Backend API — FastAPI / Python

**Entry point:** REST API with unified request routing

| Service | Responsibility |
|---|---|
| **Scheme service** | CRUD and search for scheme catalogue |
| **Eligibility service** | Evaluates user profile against scheme criteria |
| **Chat service** | Handles streaming chat sessions with AI agent |
| **DigiLocker service** | Manages DigiLocker OAuth, document verification |
| **CSC service** | CSC operator actions, assisted service flows |
| **Grievance service** | File, track, and resolve citizen grievances |

---

### 4. AI Intelligence

```
User query
    │
    ▼
AI Agent  (Anthropic Claude API)
Intent detection · response orchestration
    │
    ├──▶ Tool Calling  (if intent matched)
    │    · Schemes lookup
    │    · Eligibility check
    │    · Payments info
    │    · Document retrieval
    │    · Grievance filing
    │
    └──▶ Rule-based Fallback  (if AI unavailable)
         · Database retrieval
         · Multilingual canned replies
```

---

### 5. Data Layer — SQLAlchemy ORM

**Default DB:** SQLite (dev) | **Production:** PostgreSQL

| Table / Collection | Contents |
|---|---|
| `schemes` | Scheme metadata, eligibility criteria, categories |
| `grievances` | Filed complaints, status, resolution notes |
| `csc_users` | CSC operator accounts and permissions |
| `citizen_query_logs` | Interaction history, analytics |

---

### 6. Cache — Redis *(optional)*

| Cached Data | Fallback |
|---|---|
| Scheme metadata | In-memory dict |
| Categories | In-memory dict |
| FAQs | In-memory dict |

Redis is optional; the system degrades gracefully to in-memory fallback if Redis is unavailable.

---

### 7. External Integrations

| Integration | Purpose |
|---|---|
| **Anthropic Claude API** | Powers the AI agent — intent, tool use, response generation |
| **DigiLocker** | OAuth authorization and document verification for citizens |
| **Government scheme portals** | Live data feeds / deep-links for scheme applications |
| **Web Speech API** | Browser-native voice input capture (no third-party STT cost) |

---

## Key Data Flows

### Citizen scheme discovery
```
Citizen → Home → Scheme directory → Scheme details
                                         │
                                    REST API → Scheme service → DB (schemes) → Redis cache
```

### AI-assisted eligibility check
```
Citizen → Eligibility wizard / AI assistant
               │
          FastAPI (Chat service) ──stream──▶ AI Agent (Claude)
                                                   │
                                            Tool: Eligibility service
                                                   │
                                            DB (schemes) → response → Citizen
```

### DigiLocker document flow
```
Citizen → DigiLocker flow (Frontend)
               │
          FastAPI (DigiLocker service) → DigiLocker OAuth → Document fetch
               │
          Response → Frontend → Citizen
```

### Grievance filing
```
Citizen → AI assistant / form
               │
          FastAPI (Grievance service) → DB (grievances) → Citizen query logs
               │
          [Optional] → Government scheme portals for status updates
```

---

## Tech Stack Summary

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, React Router, i18next |
| Backend | FastAPI, Python |
| ORM | SQLAlchemy |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Cache | Redis (optional, in-memory fallback) |
| AI | Anthropic Claude API |
| Voice | Web Speech API |
| Auth / Docs | DigiLocker OAuth |
| Deployment | (to be defined) |

---

## Design Principles

- **Graceful degradation** — Redis and AI agent both have fallbacks; system stays operational
- **Multilingual-first** — i18next on frontend, multilingual replies in rule-based fallback
- **Voice-accessible** — Web Speech API integration so low-literacy users can interact
- **CSC operator support** — Dedicated portal so operators can assist citizens offline
- **DB portability** — SQLite for zero-config dev, PostgreSQL-compatible for production scale
