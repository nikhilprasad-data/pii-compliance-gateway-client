# AGENTS.md

## Project

This repository contains the frontend client for the PII Compliance Gateway.

The application is a Next.js dashboard that communicates with a separate FastAPI backend. The frontend is responsible for the user interface and presentation of backend scan results.

The backend performs PII detection and sanitization. **Do not** move backend PII-processing logic into the frontend unless explicitly requested.

---

## Technology

- Next.js
- React
- TypeScript
- Tailwind CSS
- REST API
- npm

Use the versions and APIs installed in this repository rather than assuming compatibility with older or newer versions.

---

## Repository structure

Keep responsibilities separated.

- `src/app/` — Next.js application routes and application-level structure
- `src/components/` — reusable UI and feature components
- `src/features/` — feature-specific application logic
- `src/hooks/` — reusable React hooks
- `src/lib/` — shared utilities and API-related logic
- `src/types/` — shared TypeScript types

Follow the existing structure before introducing a new folder or architectural pattern.

**Do not** create duplicate utilities, components, hooks, or API clients when an existing implementation can be reused.

---

## Backend integration

The frontend communicates with the FastAPI backend through HTTP.

**Primary scan endpoint:**

`POST /api/v1/scan`

The frontend should treat the backend response as the source of truth for:

- Sanitized text
- Detected PII entities
- Processing time
- Cache-related metrics returned by the API

**Do not** hardcode backend metrics or fabricate API responses for the production UI.

Keep API-specific logic separate from presentation components.

---

## Next.js instructions

The repository may contain a Next.js-generated agent-rules block.

**Do not** remove or rewrite that generated block.

Before making changes that depend on Next.js behavior, check the installed Next.js version and follow the documentation available with the installed package when required.

**Do not** assume that APIs or conventions from an older Next.js version are still valid.

---

## Code style

Prefer simple, readable TypeScript and React code.

Follow the existing project conventions before introducing new patterns.

**Prefer:**

- Small, focused components
- Explicit TypeScript types
- Reusable components where reuse is meaningful
- Clear naming
- Predictable state management
- Accessible interactive elements
- Existing project utilities over duplicate implementations

**Avoid:**

- Unnecessary abstractions
- Duplicated code
- Large monolithic components
- Unnecessary dependencies
- `any` when a meaningful type can be defined
- Hardcoded API data presented as real backend data

**Do not** rewrite working code simply for stylistic preference.

---

## UI changes

Preserve the existing visual language unless the task explicitly requests a redesign.

When changing the UI:

1. Inspect the existing component and its surrounding layout.
2. Reuse existing components and styles where possible.
3. Keep responsive behavior intact.
4. Avoid introducing duplicate cards, metrics, navigation, or information.
5. Verify that displayed values come from real application state or API responses.
6. Keep the interface clear and professional rather than adding visual effects for their own sake.

---

## Environment

Local development uses the FastAPI backend at:

`http://127.0.0.1:8000`

The Next.js development server normally runs at:

`http://localhost:3000`

Environment-specific configuration belongs in `.env.local` or the appropriate environment configuration.

**Never** commit API keys, credentials, tokens, or other secrets.

---

## Verification

After making a meaningful change, use the repository's available checks.

**Common commands:**

```bash
npm run lint
npm run build
```

For UI changes, also verify the affected workflow in the browser when possible.

**Do not** claim that a change was tested if it was not actually tested.

If a check fails because of an unrelated existing issue, report that clearly instead of hiding or rewriting the failure.

---

## Change discipline

Make the smallest change that correctly solves the requested task.

**Before editing:**

- Inspect the relevant files
- Understand the existing implementation
- Identify dependencies and affected components

**After editing:**

- Review the diff
- Remove accidental changes
- Run appropriate checks
- Verify the affected user flow

**Do not** modify unrelated files unless the task requires it.

---

## Git

Use clear conventional commits when committing changes.

**Examples:**

```
feat(client): add scan result display
fix(client): handle scan API errors
refactor(client): separate scan API logic
docs(readme): update frontend project documentation
test(client): add scanner component tests
chore(client): update dependencies
```

Keep commits focused on one logical change.

**Do not** create commits automatically unless explicitly requested.

---

## Working with AI tools

AI-assisted development is allowed and may be used to accelerate implementation.

However, generated code must be reviewed against the existing architecture and verified before being considered complete.

**Do not** introduce code solely because an AI tool suggested it.

When requirements are ambiguous and the ambiguity could change the implementation, ask for clarification rather than making a large architectural assumption.

When the requested change is clear, make the smallest reasonable implementation and verify it.

---

## Documentation

Keep documentation accurate to the actual implementation.

**Do not** add unsupported performance numbers, security claims, compliance certifications, or architectural claims.

If the implementation changes an important architectural decision, update the relevant documentation.

---

## Important principle

Optimize for correctness, maintainability, clarity, and verifiable behavior.

Do not optimize for making the repository look more complex or more "AI-powered" than it actually is.