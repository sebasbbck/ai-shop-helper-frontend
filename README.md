# AI Shop Helper Frontend

Frontend for the AI Shop Helper application. Built with Next.js, MUI, and TanStack Query.

> AI Shop Helper was a SaaS platform where online stores connect their website (WordPress) and analytics (Google Analytics 4, Search Console) to run AI agents on their projects. It was developed by a small team during 2026; this repository is republished with the company's permission. The API lives in [ai-shop-helper-backend](https://github.com/sebasbbck/ai-shop-helper-backend).

## My contribution

I worked on this frontend as a developer intern (June–September 2026), building each feature end to end together with its backend API, through pull requests reviewed by the tech lead:

- **Notifications** — topbar bell with unread badge (polling), a dedicated `/notifications` inbox with all/unread filter, pagination, read/unread toggle, mark all as read and organization filter, plus per-type mute preferences in settings. Messages are rendered client-side from `type` + `payload` with `next-intl` (English/Spanish).
- **Google sign-in** — "Continue with Google" on the login and register forms.
- **Google connection UI** — per-project card to connect Google Analytics 4 / Search Console, showing the connected account.
- **Onboarding and navigation** — merged organization and project creation into a single step that then redirects to billing; made project and agent cards fully clickable.
- **Testing** — raised overall coverage to ~87% (350+ Vitest + Testing Library tests) together with another intern, introduced shared mock helpers to remove duplicated test boilerplate, and wrote the testing conventions guide ([TESTING.md](TESTING.md)).

## Prerequisites

- [bun](https://bun.sh/) — package manager and runtime
- [pre-commit](https://pre-commit.com/) — for the git hooks
- A running backend (see the backend repo) reachable at `BACKEND_ORIGIN`

## Setup

```bash
# Install dependencies
bun install

# Install pre-commit hooks
pre-commit install

# Copy environment variables
cp .env.example .env

# Generate the API client
bun run generate-client
```

## Running the application

```bash
# Development server
bun run dev

# Production build + serve
bun run build
bun run start
```

The app runs on port **3000**. It proxies API calls to `BACKEND_ORIGIN` (default `http://localhost:8080`).

## API client

```bash
# Regenerate from the backend's openapi.json
bun run generate-client
```

## Testing

```bash
# Watch mode
bun run test

# Single run
bun run test:run

# With coverage
bun run test:coverage
```

Patch coverage on new/changed lines is enforced at **80%** minimum — the CI pipeline will reject PRs below this threshold.

## Code quality

```bash
# Format
bun run format

# Lint with auto-fix
bun run lint --fix

# Type check
bun run typecheck
```
