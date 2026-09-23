# AgriSense Engineering Standards & Agent Guidelines

This repository follows a strict multi-tier microservice architecture. All agents must follow the rules defined below:

- **Frontend Isolation**: `frontend/` (V1) and `frontend-v2/` (V2) are isolated independent applications. Never touch `frontend/` when working on V2, and never leak V2 components into V1.
- **Frontend V2 Standards**: Follow `@design-taste-frontend`, `@frontend-design`, and `@improve-animations`. Strict organic-modern palette (Forest `#0E2A1C`, Warm Stone `#F8F7F4`, Amber `#D97706`), zero generic AI purple gradients or floating emojis, Emil Kowalski spring animations (`stiffness: 380, damping: 28`).
- **Shift-Left Quality Gate**: Run `npx tsc --noEmit` before concluding frontend work; run `npm test` before concluding backend work.
- **Security First**: Follow `@security-and-hardening`. Zero hardcoded fallback secrets, mandatory Supabase RLS on all PostgreSQL tables, sanitized UUID file uploads, rate limiting on auth endpoints.
- **Git Commits**: Conventional commits (`feat(v2): ...`, `fix(backend): ...`, `security(auth): ...`).

For the complete SDLC rules and verification checklists, refer to [.agents/rules/sdlc.md](file:///.agents/rules/sdlc.md).
