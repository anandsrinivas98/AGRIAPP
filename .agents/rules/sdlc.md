# AgriSense Enterprise SDLC Workflow & Engineering Rules

## 1. System Architecture & Component Boundaries

The AgriSense repository is a multi-tier microservice architecture. All agents, developers, and workflows must strictly respect service boundaries:

```
cropfinally/
├── frontend/             # V1 Client (Next.js 14, Tailwind, Port 3000) - NEVER POLLUTE WITH V2 CODE
├── frontend-v2/          # Standalone V2 Client (Next.js 14, Port 3001, Design Tokens)
├── backend/              # Core API Gateway (Node.js/Express, TypeScript, Port 5000)
├── ml-service/           # ML Inference Microservice (FastAPI, Python 3.10+, Port 8000)
└── supabase_full_setup.sql # PostgreSQL Database Schema with Row-Level Security (RLS)
```

---

## 2. Core SDLC Rules & Guardrails

### Rule 1: Strict Frontend Isolation
- **Rule**: `frontend/` (V1) and `frontend-v2/` (V2) are completely independent projects.
- **Enforcement**:
  - Never add V2 routes, components, or styles into `frontend/`.
  - Any V2 feature development must occur exclusively inside `frontend-v2/`.
  - `frontend-v2/` must maintain its own `package.json`, `tsconfig.json`, and run on its own port (`3001`).

### Rule 2: Shift-Left Quality Gates (Pre-Commit Verification)
Before any code change is finalized or committed, all applicable verification gates must pass with code 0:
- **Frontend V1 / V2**:
  ```bash
  cd frontend-v2 && npx tsc --noEmit
  ```
  Must compile with zero TypeScript errors.
- **Backend Services**:
  ```bash
  cd backend && npm test
  ```
  All unit and automated security audit test suites must pass (12/12 passing).
- **ML Service**:
  ```bash
  cd ml-service && python test_live_services.py
  ```
  All machine learning models (RandomForest, GradientBoosting, EfficientNet-B0) must load and infer without errors.

### Rule 3: Security & Data Hardening (OWASP Top 10)
- **Zero Fallback Secrets**: Never hardcode default secrets in production configuration (e.g., JWT secret must be dynamically loaded and validated on initialization).
- **Database Row Level Security (RLS)**: Every table created in Supabase/PostgreSQL must have `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;` and explicit tenant-isolation policies.
- **Safe File Uploads**:
  - Filenames must be sanitized with `crypto.randomUUID()` to prevent path traversal.
  - File size must be capped at 5MB for images.
  - MIME types must be strictly validated (`image/jpeg`, `image/png`, `image/webp`).
- **Endpoint Protection**:
  - All public authentication routes (`/api/auth/login`, `/register`, `/verify-otp`) must have rate limiting attached.
  - Never return stack traces or internal exception details in HTTP responses.

### Rule 4: Frontend Design & Anti-Slop Standards
For all frontend interface work (especially in `frontend-v2/`):
- Adhere to the `@design-taste-frontend` and `@frontend-design` principles:
  - No generic AI purple gradients or neon floating orbs.
  - Strict natural palette: Deep Botanical Forest (`#0E2A1C`), Warm Stone (`#F8F7F4`), Harvest Amber (`#D97706`), Deep Charcoal (`#121814`).
  - No childish floating emoji characters in production cards.
  - Asymmetric, functional bento grids with data density and real interactive states.
- Adhere to `@improve-animations` guidelines:
  - Emil Kowalski spring physics (`stiffness: 380, damping: 28`).
  - Tactile micro-press feedback (`:active scale-[0.98]`).
  - No distracting infinite-loop spinning meshes.

---

## 3. Git Workflow & Versioning Protocol

### Conventional Commits
All commit messages must follow the Conventional Commits specification:
```
<type>(<scope>): <short description>

[optional body]
```

#### Allowed Types:
- `feat`: A new feature (e.g., `feat(v2): add leaf pathology edge viewfinder`)
- `fix`: A bug fix (e.g., `fix(v2): prevent substrate label truncation in hero card`)
- `security`: Security remediation or hardening (e.g., `security(backend): add rate limiter to OTP routes`)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `test`: Adding or updating automated tests
- `chore`: Build system, configuration, or dependency updates

#### Allowed Scopes:
`v2`, `v1`, `backend`, `ml-service`, `db`, `auth`, `ui`

---

## 4. Release Checklist (Definition of Done)
1. Code passes `npx tsc --noEmit` with 0 warnings/errors.
2. Automated test suite passes (`npm test`).
3. Browser verification confirms no layout shift, no duplicate navbars, and clean responsive mobile behavior.
4. Security checklist verified (no leaked credentials, RLS enabled, input sanitized).
5. Walkthrough documentation updated with visual evidence and reproduction steps.
