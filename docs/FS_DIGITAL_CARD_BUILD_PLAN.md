# FS Softwares Digital Business Card Platform

**Brand:** FS Softwares  
**Company:** TophComm Engineering & System Solutions Inc.  
**Status:** Product build baseline / implementation plan

## 1. Product objective
Build a multi-tenant digital business card SaaS for both individuals and organizations. Each card publishes to a mobile-first public page with vCard download, QR code, social/CTA links, portfolio/media, lead capture, analytics, and organization-level governance.

## 2. Recommended delivery pattern
Start with a lean production stack and preserve a clear path to enterprise scale.

- Frontend/public rendering: Next.js + TypeScript.
- API: Node.js/NestJS or FastAPI.
- Data: PostgreSQL with migrations.
- Cache / background work: Redis + queue worker for webhooks, exports, notifications and analytics aggregation.
- File/media storage: S3-compatible object storage.
- Auth: email/password + Google OAuth; MFA for privileged roles.
- Public card delivery: SSR/edge-cacheable pages at `/u/:slug`.
- Billing: Stripe-equivalent subscription/seat billing abstraction.
- Deployment: containerized services, reverse proxy, managed PostgreSQL, CDN for public assets.

## 3. Functional modules
### Card builder
- Profile fields: name, title, company, photo, phones, emails, address, public slug.
- Live preview.
- Template selection and organization template lock.
- Link blocks: social/custom/CTA with sort order.
- Media blocks: image, video and PDF.
- Primary CTA configuration.
- Draft/publish lifecycle.

### Public card
- Mobile-first SSR page.
- Call, email and save-contact actions.
- vCard generated from current published fields.
- QR PNG/SVG to current public URL.
- Clean inactive / not-found states.
- SEO/OpenGraph metadata.

### Lead capture
- Visitor form: name, email, phone, note.
- Owner and organization dashboards.
- CSV/XLSX export.
- Optional outbound CRM webhook with retries and delivery log.
- Consent text configurable per organization.

### Analytics
- Views and unique visitors.
- vCard downloads.
- Link click breakdown.
- Lead submissions.
- Daily/weekly/monthly time series.
- Organization aggregate roll-up.
- Exportable datasets.

### Organization administration
- Brand kit: logo, primary/secondary colors, default template.
- Bulk member invite via CSV or invitation links.
- Field/template locking policy.
- Seat/status management.
- Immediate card deactivation on offboarding.
- Audit log for sensitive changes.

### Billing and plans
- Free: one card, basic template, vCard + QR.
- Pro: links/media, lead capture, analytics, custom slug.
- Business: organization workspace, brand kit, bulk issuance, admin analytics, export and CRM webhook.
- Enterprise: SSO, white-label domain, SLA, managed onboarding.

## 4. Roles and authorization
- **Org Owner:** billing, brand kit, administrators, all organization controls.
- **Org Admin:** member management, templates, analytics, card activation/deactivation.
- **Member:** manage own permitted card fields, own analytics and leads.
- **Individual:** full control of own cards without organization constraints.
- **Public Visitor:** view card, vCard, QR and lead form only.

Authorization must be enforced server-side and not depend on hidden UI controls.

## 5. Core data model
- organizations
- users
- organization_memberships
- cards
- card_versions
- link_blocks
- media_blocks
- lead_captures
- analytics_events
- daily_analytics_rollups
- webhook_endpoints
- webhook_deliveries
- subscriptions
- audit_logs
- invitations

## 6. API surface
Version API under `/api/v1`.

- `/auth/*` login, OAuth, MFA and session operations.
- `/cards/*` CRUD, publish, activate/deactivate, slug availability.
- `/cards/:id/vcard` server-side VCF.
- `/cards/:id/qr` PNG/SVG QR.
- `/cards/:id/links` and `/media` ordered blocks.
- `/cards/:id/leads` capture/query/export.
- `/cards/:id/analytics` metrics and time series.
- `/orgs/*` workspace, branding, member and invitation management.
- `/webhooks/*` endpoint configuration and delivery history.
- `/billing/*` checkout/customer-portal/seat synchronization.

## 7. Security baseline
- Argon2id/bcrypt password hashing.
- CSRF protection where applicable; secure same-site cookies.
- MFA for owner/admin roles.
- Rate limiting on login, public lead capture, slug checks and exports.
- Input validation and output encoding.
- Signed object-storage uploads with type/size controls.
- Server-side RBAC checks for every protected route.
- Audit logs for role changes, billing, deactivation and brand-policy changes.
- Webhook signing secret and replay protection.
- Data retention and deletion controls.

## 8. Production reliability
- Health/readiness endpoints.
- Structured logs with request IDs.
- Error tracking and alerting.
- Idempotent background jobs.
- Exponential retry/dead-letter strategy for webhook failures.
- Automated database backups and restore test.
- Blue/green or rolling deployment strategy.

## 9. End-to-end acceptance tests
1. Individual sign-up → card → publish → public SSR page → vCard works.
2. Organization creation → brand kit → bulk invite → member receives pre-branded builder.
3. Admin deactivates a member → public card becomes inactive immediately.
4. Slug change → QR points to current URL.
5. Lead form → member/org dashboards → export rows match UI.
6. Analytics increment for view/link/vCard/lead events.
7. Plan upgrade/downgrade gates the right server-side capabilities.
8. CRM webhook sends signed payload and retries failures.
9. Role escalation attempts are denied and audited.
10. Responsive experience is usable on phone, tablet and desktop.

## 10. Suggested repository structure
```text
apps/
  web/              # Next.js builder, dashboard and public card pages
  api/              # REST API / auth / billing / org management
  worker/           # webhooks, exports, rollups
packages/
  ui/               # design system and card templates
  domain/           # shared validation/types
  config/           # lint/tsconfig/env contracts
database/
  migrations/
  schema.sql
prototype/
  index.html
infra/
  docker/
  deploy/
```

## 11. Delivery stages
- Phase 1: identity, card builder, publish, public card, vCard and QR.
- Phase 2: links/media, leads, analytics and exports.
- Phase 3: organization workspace, brand governance and bulk issuance.
- Phase 4: billing, CRM webhooks, audit logs and operational hardening.
- Phase 5: SSO, white-label domains, Wallet passes and enterprise SLA controls.

The attached interactive prototype is deliberately client-side only. Production authentication, billing, data persistence, webhooks, SSO and API operations belong in the backend implementation above.