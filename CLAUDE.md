# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

TEM (Territorial Effectuation Monitoring) — a Laravel 12 platform for filling out a 20-block ("card") business
questionnaire, with autosave, versioned backups, a reviewer dashboard, and PDF report generation. Backend is
Laravel; the questionnaire frontend is plain modular JavaScript (no SPA framework) served from `public/assets/js/`.

## Commands

Local dev runs via Laravel Sail, exposed on **port 8090** (`APP_URL=http://localhost:8090`, `APP_PORT=8090` in `.env`).

```bash
# Start the stack (Sail/Docker: php, mysql)
./vendor/bin/sail up -d
# or, without Sail, all-in-one dev (server + queue + logs + vite):
composer dev

# Install deps
composer install
npm install

# Run PHP test suite (PHPUnit, Feature + Unit)
php artisan test
composer test                    # same, but clears config cache first
php artisan test --filter=TestName
php artisan test tests/Feature/ReportControllerTest.php

# Frontend build
npm run dev                      # vite dev server
npm run build                    # vite production build

# E2E (Playwright) — see AGENTS.md, mandatory for any UI/form/report-screen change
npx playwright test
npx playwright test tests/e2e/questionnaire.spec.js
npx playwright test --ui
```

There is no `playwright.config.*` at the repo root — tests hardcode `http://localhost:8090` as the base URL, so
the Sail/local server must already be running on that port before running Playwright. A local-only test route,
`GET /_test_login/{userId}`, logs in as a given user id without credentials (only registered when
`app()->environment('local')`) — this is what the E2E suite uses to authenticate.

## Architecture

### Questionnaire data model

A `Business` (table `business`, soft-deletes) belongs to a `User` via `id_user` and is addressed publicly by a
UUID `url_hash` (never by its numeric id, in routes). All questionnaire answers live in one column,
`business_data_json`, keyed by **card number as a string** (`"1"`..`"20"`), each value being an object of field
names to values (see `BusinessCompletionService::$requiredChecks` and `forms-schema.js` for the field map).
Every autosave also writes a full-snapshot row to `BusinessDataBackup` (business_id, business_data_json,
created_at — no `updated_at`), which is how the backup/version restore UI works
(`DashboardController::backupShow` / `backupRestore`).

`Business::is_complete` is recomputed on every save by `BusinessCompletionService::isBusinessComplete()`, a
**hardcoded** list of dotted-path required fields (e.g. `1.cnpj`, `19.milestones.0.year`) checked against the
decoded JSON. If the questionnaire's required fields change, this list (and the mirrored logic in
`resume.blade.php`) must be updated together — there's no shared schema between PHP and JS for this.

### Request flow for the questionnaire

- `GET /dashboard/{url_hash}` → `DashboardController::show` renders `dashboard/business.blade.php` with the
  decoded `businessData` and the last 50 backups.
- The page boots `public/assets/js/form-renderer.js` + `forms-schema.js`, which render each of the 20 cards from
  `public/assets/js/forms/*-form.js` (HTML generation) paired with a `cardN-*.js` controller (dynamic selects,
  repeatable "other" fields, checkboxes, ordering) — see README.md's "Como Funciona a Lógica dos Formulários" for
  the per-card file naming convention (form file vs. logic file).
- `public/assets/js/app-save-later.js` is the autosave core: it mirrors state to `localStorage` on every
  interaction and POSTs to `dashboard/{url_hash}/autosave` (`DashboardController::autosave`), which is the
  single place that updates `business_name`/`business_cnpj` from card 1's answers, persists the full JSON, and
  recomputes `is_complete`.
- `public/assets/js/app-carrosel.js` (Swiper-based card carousel), `app-navigation-buttons.js`
  (prev/next/save/finish button logic + dynamic labels), and `app-card-status.js` (visual completion state per
  card) drive the UI chrome around the forms.
- `GET /dashboard/{url_hash}/resume` → `dashboard/resume.blade.php`, the read-only summary/timeline view.
  Reviewers (`users.is_reviewer = true`) can open **any** business's resume by hash; normal users only their own
  (`DashboardController::resume`). Reviewers also get a distinct `/dashboard` view (`dashboard/reviewer.blade.php`
  listing every business) instead of the normal per-user dashboard.

### PDF report generation (separate subsystem)

`routes/web.php`'s `api/report/*` prefix is a **stateless, public** JSON→PDF API, unrelated to the
`business_data_json` persistence flow above: `ReportController` validates the payload with
`GenerateReportRequest` (expects `titleDocument`, `Timeline`, `BusinessModel`, `Contacts`, `partnerships`,
`summary`) and hands it to `ReportService`, which deduplicates/cleans the data, builds HTML
(`ReportHtmlHelper` + `resources/views/pdf/styles.css`), and renders it with Dompdf. `generate`/`preview` return
inline; `download` sets a `Content-Disposition: attachment` filename. `HandleReportCors` middleware is scoped to
these endpoints since they may be called cross-origin.

### Auth

Session auth via `auth:sanctum` guard (not API tokens) protects all `/dashboard*` routes. `is_reviewer` (boolean
on `users`) is the only role distinction in the system — checked ad hoc in controllers, not via policies/gates.

## Testing & PR evidence (see AGENTS.md)

Any UI/UX, form, questionnaire-flow, or report-screen change **must** ship with Playwright E2E coverage and
screenshot evidence under `tests/e2e/screenshots/`, documented in the PR description (scenario/status table +
screenshots), before opening or updating a PR. See `AGENTS.md` for the exact PR template expectations.
