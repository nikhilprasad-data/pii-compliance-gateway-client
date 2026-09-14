# PII Compliance Gateway — Client

A Next.js dashboard for the PII Compliance Gateway API. Submit text, watch it get scanned, see what was flagged and redacted, and compare the cached path with the cold path.

Lives in its own repo, separate from the FastAPI backend, so the API stays usable by anything else that wants to talk to it — not just this dashboard.

---

## Live Demo

**Frontend:**
https://pii-compliance-gateway-client.vercel.app/

**Backend API:**
https://pii-compliance-gateway-api.onrender.com/

**API Documentation:**
https://pii-compliance-gateway-api.onrender.com/docs

---

## Demo

[▶ Watch the full demo on LinkedIn](YOUR_LINKEDIN_POST_URL)

The workflow, start to finish:

```text
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

---

## What this application does

This is the client side of the gateway — it doesn't detect or sanitize anything itself, it just gives you a way to actually see the backend work instead of hitting the API with curl.

From here you can:

- Submit text with sensitive info in it
- Fire the request off to the FastAPI scanning endpoint
- See the sanitized result and what entities got flagged
- See backend processing time and whether it hit cache
- Handle loading and API error states clearly

Detection and sanitization live entirely on the backend. This app's job is presentation — make the workflow easy to follow and easy to demo.

---

## Architecture

Frontend and backend are deliberately split.

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

The frontend only ever talks to the backend through the scan API. Everything else — detection, deterministic sanitization, Redis caching, IP rate limiting, Postgres persistence, timing — happens on the other side of that HTTP call.

Keeping that split means the backend API stays usable on its own, and this frontend can change however it wants without touching backend code.

---

## Frontend structure

Feature-oriented layout inside `src/`:

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

UI, application logic, reusable utilities, and shared types stay in their own lanes instead of getting dumped into one giant page component.

---

## Main frontend areas

### Scanner

The main event — submit text, get the sanitized output back, see exactly what the gateway flagged as PII.

### Dashboard

Pulls the scan workflow, results, and system info into one place so the gateway's easy to demo without anyone touching the API directly.

### Analytics

Shows real numbers coming out of the backend — processing time, cache hit/miss, cache performance, scan counts, entity counts. Nothing here is hardcoded; if the backend didn't return it, it doesn't show up.

### Reusable UI

Shared components so the dashboard stays visually consistent instead of every screen reinventing the same card or button.

---

## Backend integration

The frontend talks to the FastAPI backend through one endpoint:

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
  "sanitized_text": "My email is [REDACTED]",
  "detected_pii": [
    {
      "entity_type": "EMAIL_ADDRESS",
      "start_index": 17,
      "end_index": 34
    }
  ],
  "processing_time_ms": 12.34
}
```

The frontend renders the sanitized text, the detected entity metadata, and the processing time straight from this response. The original raw input never comes back — the API doesn't return it.

---

## Privacy-conscious design

This wasn't just a backend concern — it shaped the frontend too. The dashboard shows the sanitized result the gateway hands back; it's not pulling from any stored raw input, because there isn't any to pull from.

On the backend side, the audit record only ever holds:

- Sanitized text
- Detected PII metadata
- Processing time
- Timestamp

Same story for the Redis cache — it stores the sanitized response and its metadata, not the original text, and the cache key itself is just a SHA-256 hash of the input.

Worth saying plainly: this is a privacy-conscious engineering project, not a claim of formal legal or regulatory compliance.

---

## Production deployment

Frontend and backend are deployed as separate services.

```
                    Internet
                       │
          ┌────────────┴────────────┐
          │                         │
          ▼                         ▼
       Vercel                    Render
   Next.js Frontend          FastAPI Backend
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                    ▼             ▼             ▼
                 Upstash        Neon          LangGraph
                  Redis       PostgreSQL       Workflow
```

**Production services**

| Component | Platform | Responsibility |
| --- | --- | --- |
| Next.js | Vercel | Frontend dashboard |
| FastAPI | Render | Backend API |
| PostgreSQL | Neon | Persistent audit data |
| Redis | Upstash | Caching and rate limiting |
| LangGraph | Backend | PII processing workflow |

Production env vars live in the deployment platforms — none of that is in the repo.

---

## Technology stack

**Frontend:** Next.js, React, TypeScript, Tailwind CSS
**Backend integration:** FastAPI, REST API, JSON, HTTP
**Development:** npm, ESLint, Git, GitHub

---

## Running locally

**1. Clone the repository**

```bash
git clone https://github.com/nikhilprasad-data/pii-compliance-gateway-client.git

cd pii-compliance-gateway-client
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure the backend API**

Create a local environment file:

```
.env.local
```

Add the URL of the FastAPI backend:

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

The backend has to actually be running for the dashboard to do anything useful — this is just the client half.

Don't commit `.env.local` or anything else with real credentials in it.

**4. Start the development server**

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## Development commands

Start the dev server:

```bash
npm run dev
```

Lint:

```bash
npm run lint
```

Production build:

```bash
npm run build
```

Start the production server after building:

```bash
npm run start
```

---

## Running the complete project locally

This repo is only the client half. For the full workflow you need the backend API and its supporting services running too.

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

The backend repo has the API, the PII workflow, caching, rate limiting, database persistence, migrations, and infra config.

---

## Performance

The dashboard surfaces whatever processing info the backend hands back for each scan.

The backend repo also has a standalone benchmark comparing cold requests against Redis-cached ones — average, median, P95, min, max latency for both, plus the overall improvement between them.

It's there to show what caching actually does to latency, not to make any claim about production-scale throughput.

---

## AI-assisted development

Antigravity was used as an AI coding assistant to speed up frontend implementation and UI iteration. Generated code got reviewed, wired up against the real backend API, and tested like any other code that ends up in this repo.

---

## Project relationship

This is the frontend half of the gateway:

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

Keeping the repos separate means the API stays usable on its own while the frontend evolves independently.

---

## Current status

The dashboard's built, deployed, and talking to the production API.

Right now this is in the final documentation and cleanup stage — writing up the engineering decisions, double-checking the existing implementation, and figuring out what's actually worth building next instead of adding features just to pad the project out.

---

## Related project

**PII Compliance Gateway API**

https://github.com/nikhilprasad-data/pii-compliance-gateway-api

The backend repo has the FastAPI service, the LangGraph PII workflow, structured detection, deterministic sanitization, Redis caching, IP rate limiting, Postgres persistence, Alembic migrations, Docker config, production deployment setup, and the performance benchmark.

---

## Author

**Nikhil Prasad**

AI & Backend Engineer focused on LLM applications, AI agents, RAG systems, and backend engineering.