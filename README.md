# AI Shop Helper Frontend

Frontend for the AI Shop Helper application. Built with Next.js, MUI, and TanStack Query.

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
