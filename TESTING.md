# Testing

This document describes how the frontend test suite is organised and the conventions and pitfalls that are not
obvious from reading the tests themselves. For the basic commands, see the "Testing" section of the README.

## 1. Structure

<!-- Where tests live (tests-vitest/), naming convention, test-utils.tsx, vitest.config.ts. -->

## 2. Shared mock helpers

<!-- What lives in tests-vitest/mocks/ (active-context.ts, entities.ts, query-state.ts, router.ts) and how to use them. -->

## 3. Common patterns

### 3.1 General

<!-- Mocking next-intl, the Next router, React Query queries and mutations. -->

### 3.2 Billing, agents, org, project, settings and infrastructure

<!-- Sebastián: billing, agents, referrals, org, project, settings, i18n, proxy.ts, custom-instance.ts. -->

### 3.3 Layout, shell and auth

<!-- Adrián: components/layout/, BootstrapGate, BootstrapWizard, AdminGuard, AuthGate, auth forms. -->

## 4. Coverage and CI

<!-- test:coverage, 80% patch coverage on changed lines (diff-cover), pre-commit checks, coverage exclusions. -->

## 5. Known pitfalls

<!-- Unscoped `bun run format` rewrites line endings repo-wide, src/api/ must be generated first, prettier --check and CRLF on Windows. -->
