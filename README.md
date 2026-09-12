# PII Compliance Gateway — Client

A Next.js dashboard for interacting with the PII Compliance Gateway API.

The frontend provides a simple interface for submitting text for PII scanning, viewing sanitized output, inspecting detected entities, and observing scan performance and Redis caching behavior.

The frontend is maintained as a separate repository from the FastAPI backend so the API can be used independently by other clients or services.

---

## What this application does

The dashboard acts as the client interface for the PII Compliance Gateway.

A user can:

- Submit text containing sensitive information
- Send the request to the FastAPI scanning API
- View the sanitized result
- View detected PII entities
- View backend processing time
- Observe cache-related performance information
- Handle loading and API error states

The frontend does not perform the core PII detection itself. Detection and sanitization are handled by the backend gateway.

The frontend is responsible for presenting the workflow and making the backend functionality easier to use.

---

## Demo

[▶ Watch the full demo on LinkedIn](YOUR_LINKEDIN_POST_URL)

The main workflow is:

```
Enter text
    ↓
Submit scan request
    ↓
FastAPI PII Gateway
    ↓
PII detection + sanitization
    ↓
Frontend receives response
    ↓
Display sanitized result
    ↓
Display detected PII + metrics
```

**[▶ Watch the full demo on LinkedIn](#)**

The LinkedIn demo link is a temporary placeholder and will be replaced with the actual project post after publication.

---

## Architecture

The frontend is intentionally separated from the backend.

```
┌─────────────────────────────┐
│      Next.js Dashboard      │
│          Frontend           │
└──────────────┬──────────────┘
               │
               │ HTTP
               ▼
┌─────────────────────────────┐
│       FastAPI Gateway       │
│        PII Scan API         │
└──────────────┬──────────────┘
               │
       ┌───────┼────────┐
       │       │        │
       ▼       ▼        ▼
    Redis   LangGraph PostgreSQL
    Cache   PII Engine Audit Data
```

The frontend communicates with the backend through the scan API.

This separation keeps the client independent from the backend implementation and allows the same API to be consumed by other applications.

---

## Frontend structure

The application follows a feature-oriented structure inside `src/`:

```
src/
│
├── app/
│   └── Next.js application routes and application shell
│
├── components/
│   ├── analytics/
│   ├── dashboard/
│   ├── layout/
│   ├── scanner/
│   └── ui/
│
├── features/
│   └── Feature-specific application logic
│
├── hooks/
│   └── Reusable React hooks
│
├── lib/
│   └── Shared utilities and API-related logic
│
└── types/
    └── Shared TypeScript types
```

The goal is to keep presentation components, reusable utilities, application logic, and shared types separated instead of putting everything inside a single page component.

---

## Main frontend areas

### Scanner

The scanner interface allows users to submit text to the PII Gateway API and view the resulting sanitized output.

It also presents the detected PII information returned by the backend.

### Dashboard

The dashboard brings the main scanning workflow and system information into one place.

It is designed to make the gateway easy to demonstrate and inspect without requiring users to interact directly with the API.

### Analytics

The analytics section presents scan-related metrics such as processing time and cache performance returned by the backend.

The goal is to display actual backend results rather than hardcoded performance values.

### Reusable UI

Common interface elements are kept in reusable UI components so the dashboard does not depend on duplicated markup for every screen.

---

## Backend integration

The frontend communicates with the separate FastAPI backend through the scan API.

The main endpoint used by the dashboard is:

`POST /api/v1/scan`

**Example request:**

```json
{
  "text": "My email is guest@email.com"
}
```

**Example response:**

```json
{
  "original_text": "My email is guest@email.com",
  "sanitized_text": "My email is [REDACTED]",
  "detected_pii": [
    {
      "entity_type": "EMAIL",
      "start_index": 17,
      "end_index": 34
    }
  ],
  "processing_time_ms": 12
}
```

The frontend uses the response from the backend to render the sanitized text, detected entities, and processing information.

---

## Technology stack

**Frontend:** Next.js, React, TypeScript, Tailwind CSS
**Backend integration:** FastAPI, REST API, JSON
**Development:** npm, ESLint, Git, GitHub

---

## Running locally

**1. Clone the repository**

```bash
git clone https://github.com/nikhilprasad-data/pii-compliance-gateway-client
cd pii-compliance-gateway-client
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure the backend API**

Create the required local environment file:

```
.env.local
```

Configure the frontend with the URL of the running FastAPI backend.

For local development, the backend runs on:

```
http://127.0.0.1:8000
```

Do not commit `.env.local` or any file containing private credentials or secrets.

**4. Start the development server**

```bash
npm run dev
```

Open the application at:

```
http://localhost:3000
```

---

## Development commands

Start the development server:

```bash
npm run dev
```

Run linting:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

Start the production server after building:

```bash
npm run start
```

---

## Running the complete project locally

The frontend is only the client portion of the PII Compliance Gateway.

For the complete workflow, the backend API, PostgreSQL, and Redis services also need to be running.

```
Next.js
localhost:3000
      │
      ▼
FastAPI
localhost:8000
      │
      ├── LangGraph
      ├── Redis
      └── PostgreSQL
```

The backend repository contains the API, AI workflow, caching, rate limiting, database persistence, and infrastructure configuration.

---

## AI-assisted development

Antigravity was used as an AI coding assistant during frontend development to accelerate implementation.

I used it primarily to speed up UI implementation and frontend development while working against the existing PII Compliance Gateway API.

The generated code was reviewed, integrated with the backend, and tested as part of the development process.

---

## Project relationship

This repository is the frontend client for the PII Compliance Gateway.

```
pii-compliance-gateway-client
        │
        │ Next.js frontend
        ▼
pii-compliance-gateway-api
        │
        │ FastAPI backend
        ▼
PII detection + sanitization
        │
        ├── Redis
        └── PostgreSQL
```

Keeping the repositories separate allows the backend API to remain independently usable while the frontend can evolve as its own application.

---

## Current status

The frontend dashboard is implemented and connected to the PII Compliance Gateway API.

Current work focuses on completing the remaining project-readiness steps, including deployment, final documentation, and production-oriented improvements.

---

## Related project

**[PII Compliance Gateway API](https://github.com/nikhilprasad-data/pii-compliance-gateway-api)**

The backend repository contains the FastAPI gateway, LangGraph PII workflow, Redis caching and rate limiting, PostgreSQL persistence, Docker configuration, and performance benchmarking.

---

## Author

**Nikhil Prasad**

AI & Backend Engineer focused on LLM applications, AI agents, RAG systems, and backend engineering.