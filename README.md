# FS Softwares — Digital Business Card Platform

A full product baseline for a multi-tenant digital business card SaaS under **FS Softwares**, by **TophComm Engineering & System Solutions Inc.**

## Included in this build branch

- `prototype/index.html` — interactive responsive product prototype covering card builder, public card, organization administration, analytics, leads and plan gating.
- `database/schema.sql` — PostgreSQL-oriented core schema for organizations, users, memberships, cards, links, media, leads, analytics, webhooks, subscriptions and audit logs.
- `docs/FS_DIGITAL_CARD_BUILD_PLAN.md` — end-to-end production architecture, modules, API surface, security baseline, acceptance tests and delivery stages.

## Run the prototype

Open `prototype/index.html` in a modern browser. It is intentionally dependency-free and demonstrates the primary UX without pretending to provide production persistence or payment/auth services.

## Production direction

The recommended first production implementation uses a Next.js/TypeScript web application, a dedicated API, PostgreSQL, object storage, Redis-backed background jobs and server-enforced RBAC. Public cards should be server-rendered and edge-cacheable; privileged operations should be audited.

See `docs/FS_DIGITAL_CARD_BUILD_PLAN.md` for the complete build plan.