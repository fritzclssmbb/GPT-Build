# FS Softwares — Digital Business Card Platform

A full product baseline for a multi-tenant digital business card SaaS under **FS Softwares**, by **TophComm Engineering & System Solutions Inc.**

## Included in this build branch

- `apps/web/` — runnable Next.js + TypeScript Phase 1 application shell with branded landing page, card builder shell, server-rendered public card, vCard download and QR generation.
- `prototype/index.html` — dependency-free interactive product prototype covering card builder, public card, organization administration, analytics, leads and plan gating.
- `database/schema.sql` — PostgreSQL-oriented core schema for organizations, users, memberships, cards, links, media, leads, analytics, webhooks, subscriptions and audit logs.
- `docs/FS_DIGITAL_CARD_BUILD_PLAN.md` — end-to-end production architecture, modules, API surface, security baseline, acceptance tests and delivery stages.

## Run the Next.js application

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

Current implemented routes:

- `/` — branded product landing page.
- `/builder` — Phase 1 card builder implementation shell.
- `/u/fritz-suarez` — server-rendered public demo card.
- `/api/cards/fritz-suarez/vcard` — generated `.vcf` contact download.
- `/api/cards/fritz-suarez/qr` — generated SVG QR code pointing to the public card URL.

## Implementation boundary

The application now has a real runnable frontend/public-card layer, but card data still uses a typed demo fixture. Authentication, persistence, organization policy enforcement, billing and lead submission are deliberately not faked. The next stage is to connect these screens to the PostgreSQL/API architecture already defined in this repository.

## Production direction

The recommended production implementation uses Next.js/TypeScript, a dedicated API/service layer, PostgreSQL, object storage, Redis-backed background jobs and server-enforced RBAC. Public cards are server-rendered and cacheable; privileged operations are audited.

See `docs/FS_DIGITAL_CARD_BUILD_PLAN.md` for the complete build plan.
