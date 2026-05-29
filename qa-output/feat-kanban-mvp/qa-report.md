# QA Report — feat/kanban-mvp

**Date:** 2026-05-29  
**Tester:** Automated pipeline  
**Scope:** All major flows  
**App URL:** http://localhost:5173  
**Branch:** feat/kanban-mvp

---

## Summary

| Check | Result |
|-------|--------|
| App serves HTTP 200 | ✅ Pass |
| Units tests pass | ✅ 4/4 passed |
| Lint — no errors | ❌ 2 errors |
| Existing E2E tests | ⏭️ None found |
| Playwright regression tests | ⏭️ None generated |
| UI smoke test (manual) | ⚠️ Not attempted |

**Overall:** ⚠️ Needs attention (lint errors)

---

## Unit Tests

**Test file:** `kanban-mvp/src/lib/kanban-utils.test.ts`  
**Framework:** Vitest 3.2  
**Results:** 4 passed, 0 failed

| Suite | Tests | Result |
|-------|-------|--------|
| `reorderIds` | 2 | ✅ Pass |
| `buildItemTree` | 2 | ✅ Pass |

**Command:** `npm test` in `kanban-mvp/`

---

## Lint Results

**Command:** `npm run lint` in `kanban-mvp/`

### Errors (2)

1. **`src/auth/AuthProvider.tsx:58`** — `react-refresh/only-export-components`
   > Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components.

2. **`src/lib/kanban-utils.ts:24`** — `@typescript-eslint/no-explicit-any`
   > Unexpected any. Specify a different type.

### Warnings: 0

---

## Critical Issues

- **Lint error: `no-explicit-any`** in `kanban-utils.ts:24` — The `any` type bypasses TypeScript safety. Should be replaced with a proper type.
- **Lint error: `react-refresh/only-export-components`** in `AuthProvider.tsx:58` — Non-component export breaks Fast Refresh for the file.

---

## Non-Critical

- No E2E tests exist yet — regression coverage is limited to unit tests (4 cases).
- UI was not manually tested by this run; only HTTP 200 was verified.

---

## Outputs

- Report: `qa-output/feat-kanban-mvp/qa-report.md`
- E2E tests: None generated
