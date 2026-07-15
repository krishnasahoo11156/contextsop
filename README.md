# ContextSOP

ContextSOP turns messy incident transcripts into safe, interactive standard operating procedures. It uses a declarative workflow DSL: commands are displayed and parameterized, never executed by the app.

## Repository layout

- `frontend/` — Next.js 15 application on `http://localhost:3000`
- `backend/` — Flask API on `http://localhost:8080`

## Local setup

```bash
cd frontend && pnpm install && pnpm dev
cd backend && python3.11 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt && flask --app run.py run --port 8080
```

Copy each `.env.example` to `.env.local` (frontend) or `.env` (backend) before connecting external services. Never commit real credentials.

## Quality checks

```bash
cd frontend && pnpm lint && pnpm typecheck && pnpm format:check
cd backend && ruff check . && pytest
```

## Safety principles

- All generated workflows are schema-validated before rendering or persistence.
- The UI only renders trusted DSL primitives and never runs generated commands.
- API input is size-limited, secrets are redacted before external AI calls, and production CORS is allowlisted.
- Tenant isolation belongs in PostgreSQL Row Level Security policies, not only application code.
