# EcoQadam — Climate Learning & Action

EcoQadam is a mobile-first climate learning and action platform for school students in Khorazm, Uzbekistan. The MVP combines bilingual lessons, adaptive quizzes, verified eco-challenges, measurable impact, tree-survival monitoring, role-based dashboards, and offline synchronization.

## What works

- Uzbek (Latin, default) and English learning content.
- Six short lessons across water, drought, tree care, waste, and air.
- Thirty four-option questions with adaptive follow-ups, scoring, weak-topic detection, and personalized recommendations.
- Four practical challenge flows with dates, daily check-offs, comments, photo evidence, and submit-for-review.
- Verification workflow: `DRAFT → SUBMITTED → APPROVED/REJECTED`; rejection requires a reason.
- Editable water, waste, tree, completion, and engagement calculations in `config/impact-formulas.json`.
- Student, class, school, mahalla, and district dashboard scopes with Recharts visualizations.
- Twenty-tree monitoring demo with ID, species, planting date, place, geolocation, photos, watering, health, checks, and survival.
- Email or phone + password authentication, signed HTTP-only sessions, and server-side RBAC.
- PWA manifest, install icon, service worker, offline lesson/quiz caching, queued results, and online resynchronization.
- Local file adapter with a single interface that can later be replaced by S3, R2, or another cloud store.

## Architecture

```text
config/                         Editable impact formulas
prisma/
  migrations/                  PostgreSQL migration
  schema.prisma                Complete relational model
  seed.ts                      Deterministic demo dataset
public/
  offline.html                 Offline fallback
  og.png                       Social preview image
  sw.js                        PWA cache and sync worker
src/
  app/
    (platform)/                Authenticated pages
    api/                       Auth, learning, quiz, action, evidence, verify, dashboard, tree APIs
    login/                     Public sign-in
    icon.tsx / manifest.ts     Installable PWA metadata
  components/                  Product modules and reusable UI
  config/                      Typed config loaders
  data/                        Bilingual demo curriculum
  generated/prisma/            Generated client (not committed)
  i18n/                        UZ/EN interface dictionaries
  lib/
    auth/                      Sessions, guards, permissions
    storage/                   Swappable storage interface and local adapter
    impact.ts / quiz.ts        Tested domain logic
```

## Requirements

- Node.js 20 or newer
- npm 11 or newer
- PostgreSQL 15 or newer
- Optional: Docker Desktop for the included PostgreSQL service

## Local setup

1. Install dependencies:

   ```powershell
   npm install
   ```

2. Create local environment variables:

   ```powershell
   Copy-Item .env.example .env
   ```

   Replace `SESSION_SECRET` with a random value containing at least 32 characters.

3. Start PostgreSQL. With Docker Desktop:

   ```powershell
   docker compose up -d postgres
   ```

   Or create a local PostgreSQL database and update `DATABASE_URL` in `.env`.

4. Apply the migration and seed demo data:

   ```powershell
   npm run db:migrate
   npm run db:seed
   ```

5. Start EcoQadam:

   ```powershell
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000).

## Demo accounts

All demo users use `EcoQadam123!`.

| Role | Login |
|---|---|
| Student | `student01@ecoqadam.uz` or `+998901000000` |
| Teacher/coordinator | `teacher01@ecoqadam.uz` |
| School administrator | `schooladmin@ecoqadam.uz` |
| District/project administrator | `admin@ecoqadam.uz` |

The seed includes 1 district, 2 mahallas, 2 schools, 2 classes per school, 20 students, 3 teachers, 6 lessons, 30 questions, 4 required challenge templates, 3 submitted demo reviews, and 20 monitored trees.

## Validation and tests

```powershell
npm run typecheck
npm run lint
npm test
npm run build
```

The unit tests cover impact calculations and the adaptive quiz queue, score, and weak-topic rules. Prisma schema validation and client generation are available through:

```powershell
npm run db:generate
npx prisma validate
```

## Offline behavior

After an authenticated visit, the service worker warms the core lesson and quiz routes. Static application assets use cache-first delivery; lesson/quiz pages use network-first delivery with cached fallback. Lesson progress, quiz attempts, and challenge check-ins that fail offline are stored on the device and retried after the browser reports connectivity.

Browsers permit service workers on `localhost`; production deployments require HTTPS. Logging out clears the private page cache and queued user results.

## Storage and impact configuration

- Uploaded images are written to `storage/uploads` by `LocalStorageAdapter`. The folder is ignored by Git.
- `src/lib/storage/index.ts` is the only binding to replace when adding an S3-compatible adapter.
- Measurement constants live in `config/impact-formulas.json`; domain functions in `src/lib/impact.ts` consume that file.
- Approved submissions create `ImpactMetric` records. Rejected submissions never affect dashboards.

## Production notes

Use `npm run build` followed by `npm start`. Apply committed migrations with `npx prisma migrate deploy`. Set a strong `SESSION_SECRET`, a production PostgreSQL `DATABASE_URL`, persistent object storage, HTTPS, upload scanning, rate limiting, and an SMS/email verification provider before a public rollout.
