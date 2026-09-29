# Testing

This document describes how the frontend test suite is organised and the conventions and pitfalls that are not
obvious from reading the tests themselves. For the basic commands, see the "Testing" section of the README.

## 1. Structure

| Path                          | Purpose                                                                                             |
| ----------------------------- | --------------------------------------------------------------------------------------------------- |
| `tests-vitest/`               | All tests, flat. One file per component/module: `<Name>.test.tsx` (or `.test.ts`)                   |
| `tests-vitest/mocks/`         | Shared mock helpers and test-data factories (see section 2)                                         |
| `tests-vitest/test-utils.tsx` | `renderWithProviders()`: renders with React Query, next-intl (real `en` messages) and the MUI theme |
| `vitest.config.ts`            | jsdom environment, `@/` alias to `src/`, coverage settings                                          |
| `vitest.setup.ts`             | Loads the `jest-dom` matchers and runs `cleanup()` after each test                                  |

Tests are unit/component tests with [Vitest](https://vitest.dev) and
[Testing Library](https://testing-library.com/docs/react-testing-library/intro). They never hit the backend: the
Orval-generated API hooks (`@/api/endpoints/...`) are mocked in every test that uses them.

Always render components with `renderWithProviders()` rather than `render()`, so that translations, the theme
and React Query behave as in the app. Its `QueryClient` has `retry: false`, so a failing query fails immediately
instead of retrying.

## 2. Shared mock helpers

`tests-vitest/mocks/` contains the helpers that replace boilerplate that used to be copy-pasted between tests.
Each one returns a complete object with harmless defaults, so a test only passes the fields it cares about.

| File                | Helper                                                  | Replaces                                                   |
| ------------------- | ------------------------------------------------------- | ---------------------------------------------------------- |
| `router.ts`         | `makeRouter({ push?, replace?, prefetch?, refresh? })`  | The `useRouter()` return value from `next/navigation`      |
| `active-context.ts` | `makeActiveContext({ activeOrgId?, activeOrg?, ... })`  | The `useActiveContext()` return value (active org/project) |
| `query-state.ts`    | `makeListQueryState({ data?, isLoading?, isError? })`   | The state of a paginated list query hook                   |
| `entities.ts`       | `makeUser`, `makeOrg`, `makeMember`, `makeNotification` | Domain objects built by hand in each test                  |

Typical usage:

```tsx
const h = vi.hoisted(() => ({ push: vi.fn(), orgId: "org1" }));

vi.mock("next/navigation", () => ({
  useRouter: () => makeRouter({ push: h.push }),
}));

vi.mock("@/features/shell/ActiveContext", () => ({
  useActiveContext: () => makeActiveContext({ activeOrgId: h.orgId }),
}));
```

If a component needs a field a helper does not have yet, add it to the helper (with a harmless default) instead
of building the object by hand in the test.

## 3. Common patterns

### 3.1 General

**Mutable mock state with `vi.hoisted`.** `vi.mock` factories are hoisted above the imports, so they cannot use
normal variables from the test file. Declare the state they read with `vi.hoisted()` (by convention, an object
called `h`) and change it in each test or in `beforeEach`:

```tsx
const h = vi.hoisted(() => ({ activeOrgId: null as string | null }));

beforeEach(() => {
  h.activeOrgId = "org1";
});
```

**Query hooks.** Mock the generated hook to return the state the test needs. For paginated lists, use
`makeListQueryState`:

```tsx
vi.mock("@/api/endpoints/org-members/org-members", () => ({
  useOrgMembersGetOrgMembers: () =>
    makeListQueryState({ data: { items: [makeMember()], total: 1 } }),
}));
```

**Mutation hooks.** Capture the options the component passes to the hook, return a `mutate` spy, and trigger
`onSuccess`/`onError` manually inside `act()`. This tests what the component does after the request without
simulating the request itself:

```tsx
vi.mock("@/api/endpoints/billing/billing", () => ({
  useBillingConfirmCheckout: (options: ConfirmOptions) => {
    h.options = options;
    return { mutate: h.confirmMutate };
  },
}));

// in the test
act(() => h.options?.mutation?.onSuccess?.(response, variables));
```

**Child components.** When a screen composes several sections that have their own tests, replace them with a
placeholder and only check that the screen renders them:

```tsx
vi.mock("@/features/billing/LedgerTable", () => ({
  default: () => <div data-testid="ledger-table" />,
}));
```

**Translations.** `renderWithProviders()` loads the real `messages/en.json`, so assertions use the actual English
text (`screen.getByText("Buy credits")`). Prefer queries by role and accessible name (`getByRole("button",
{ name: ... })`) over `data-testid` for real UI.

### 3.2 Billing, agents, org, project, settings and infrastructure

These tests cover `features/billing`, `features/agents`, `features/referrals`, `features/org`, `features/project`,
`features/settings`, `i18n`, plus two infrastructure modules. Most of them follow the patterns in 3.1; the
non-obvious cases are:

- **`proxy.ts`** (auth middleware). It is a plain function, so it is tested without rendering anything: build a
  real `NextRequest` (with or without a `refresh_token` cookie) and assert on the response status and `location`
  header (307 redirect to `/login` on protected routes without a session, no redirect on public routes).
- **`custom-instance.ts`** (axios client). The repo has no `axios-mock-adapter`, so the test passes a small custom
  adapter (`stepAdapter`) that returns a sequence of responses (for example `401` and then `200`). The adapter
  applies axios's `validateStatus` itself, so a `401` is rejected like a real axios error and the refresh-and-retry
  interceptor runs as it would in the app. The token store (`@/lib/api/token-store`) is mocked to check which token
  is attached and when it is replaced or cleared.
- **Screens that read redirect query params** (`BillingScreen` after a Stripe checkout returns with `session_id`).
  Mock `useSearchParams` from `next/navigation` to return a `URLSearchParams` built from the mutable `h` state,
  then assert that the param is used (the checkout is confirmed) and cleared with `router.replace("/billing")`.
- **Excluded from coverage:** `src/app/providers.tsx` is pure provider composition (no logic), so it is listed in
  `coverage.exclude` in `vitest.config.ts` instead of being tested.

### 3.3 Layout, shell and auth

Inside layout, each file tests one layer and replaces the layer below it with a stand-in.

Overall, layout follows the usual pattern found inside the tests:

- uses the vi.hoisted state before rendering.

- uses the identity translator.

- the tests make use of capturing mutation options so a call onSuccess and onError can happen.

- use of stand-ins that expose their props as data-* attributes.

Inside shell, each test file replaces its neighbours with mocks, so each piece is checked on its own,
that shapes both what the tests prove and what they miss.

Only the API hook useOrgsGetMyOrgs is replaced, and it returns a fixed fixture of two orgs.

Inside auth, each test cuts the component off from the outside world at a few seams:

- **`next/navigation (useRouter, useSearchParams)`:** There is no Next.js app router in jsdom. Mocking it also lets the test assert redirects (replace("/login")) and set URL parameters (?token=…).

- **`API hooks and functions (@/api/endpoints/...)`:** No real network calls. The test decides whether a request is loading, successful or failed.

- **`next-intl (in some files)`:** Replaced with an identity translator (key) => key, so the assertions check translation keys like "resetPassword.error" rather than English parts that may change.

- **`next/link (in some files)`:** Replaced with a plain <a>, so href can be asserted without the router context.

As for BootstrapGate, two mocks isolate it: **`useActiveContext`** and **`BootstrapWizard`**.

And for BootstrapWizard, there are two main helpers:

- **`reachProjectStep(orgId)`:** types a name, submit, wait for createOrg, call onSuccess({ id: orgId }), and waits for projectHeading. The orgId parameter is useful. Later tests check whether that id is passed through to the project request.

- **`selectProjectType(name)`:** handles MUI's Select. It opens on mouseDown, not click. Its options appear in a portal as a listbox, so within(listbox) it finds the option.

**Special Cases:**

In the case of shell, vi.hoisted can't be used. Instead the mock factory refers to orgs, an ordinary const declared in the test file. The factory is moved above that declaration. The factory only builds the arrow function () => ({ data: { items: orgs } }), and orgs is read later, when the provider renders. By then the file has finished running and orgs exists.

If the factory touched orgs directly, the test would crash. This relies on the lazy read, and it's the reason other files use vi.hoisted instead.

The Probe pattern is also noteworthy, a context can't be tested on its own, so the test uses a tiny consumer component called "Probe". It prints "activeOrgId" and "activeProjectId" as text and turns each action into a button. The test then works the context only through its public API, the same way real consumers do.

Afterwards, the code below stops a selection saved by one test from leaking into the next.

```tsx
beforeEach(() => localStorage.clear());
```

In the case of the pattern "vi.hoisted", Vitest moves every vi.mock(...) call to the top of the file, above the imports.

A mock factory therefore can't use an ordinary variable declared further down, because that variable doesn't exist yet when the factory runs.

Regarding controllable promises, "deferred()" creates a promise that the test resolves by hand.

This is how the tests freeze a component in its "waiting" state and then decide exactly when the async work finishes.

For translations, "useTranslations" normally returns a function t that looks up a key in the message files for the current locale:

```tsx
const t = useTranslations("Auth");
t("resetPassword.error");
```

The mock sometimes swaps that function for one that returns the key unchanged:

```tsx
vi.mock("next-intl", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next-intl")>()),
  useTranslations: () => (key: string) => key,
}));
```

With it in place, the component renders the literal text resetPassword.error, and the test checks for that string.

This is done because the "importOriginal" spread matters. "renderWithProviders" wraps the component in "NextIntlClientProvider", which also comes from next-intl, so doing a plain:

```tsx
vi.mock("next-intl", () => ({ useTranslations: ... }))
```

would replace the whole module, "NextIntlClientProvider" would be undefined, and every render would crash. Spreading the real module and overriding only useTranslations keeps the provider working.

## 4. Coverage and CI

Run coverage locally with:

```bash
bun run test:coverage
```

The text report prints to the console; the HTML report is at `coverage/index.html`. Coverage only counts
`src/**`, excluding `src/api/**` (generated), `layout.tsx`/`page.tsx` files, `providers.tsx` and `src/theme/**`.

**CI** (`.github/workflows/test.yml`) runs on pull requests to `dev` and `main` only, in this order:

1. `bun run generate-client` (generates `src/api/`).
2. Pre-commit checks on the changed files: prettier, eslint and `tsc --noEmit`.
3. `bun run test:coverage`: the whole suite must pass.
4. **Patch coverage:** `diff-cover` requires at least **80% of new or changed lines** to be covered. A PR that adds
   a component without tests fails here, even if every test passes.

To check the patch coverage before pushing:

```bash
bun run test:coverage
python -m diff_cover.diff_cover_tool coverage/cobertura-coverage.xml --compare-branch=origin/dev --fail-under=80
```

The same pre-commit hooks run locally on `git commit` (and `no-commit-to-branch` blocks commits directly on
protected branches). PRs between feature branches (for example into a shared branch) do **not** run CI, so run
the checks manually before merging them.

## 5. Known pitfalls

- **Never run `bun run format` unscoped.** It runs `prettier --write .` on the whole repo and, on Windows, rewrites
  the line endings of every file. `git status` then shows the whole repo as modified with no real diff. Format only
  your files: `bunx prettier --write tests-vitest/MyComponent.test.tsx`. If it happens, `git restore` the files you
  did not change.
- **`prettier --check` reports every file on Windows.** With `core.autocrlf`, files are checked out with CRLF and
  prettier flags them all, including ones that are correctly formatted. Check the committed content instead:
  `git show HEAD:tests-vitest/MyComponent.test.tsx | bunx prettier --stdin-filepath tests-vitest/MyComponent.test.tsx --check`.
- **`src/api/` must exist before running tests.** It is generated by Orval and gitignored, so a fresh clone or a
  new worktree fails with "Cannot find module '@/api/...'". Run `bun run generate-client` first.
- **Type errors in tests only show up in `tsc`.** Vitest strips types without checking them, so a test can pass
  locally and still fail the pre-commit `tsc` step (for example, a helper typed `name: string` called with a
  RegExp). Run `bun run typecheck` before committing.
