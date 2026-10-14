# Digi-IP Hub — Netlify Pilot Deployment and Monitoring

## Release source
Deploy from the approved release commit only after PR review. Do not treat a successful GitHub CI build as a production deployment. The repository uses Next.js 15 and Netlify's Next.js integration.

## Site setup
1. Create a Netlify project connected to the intended GitHub repository and explicitly select the approved branch/commit.
2. Confirm build command `npm run build`, publish directory `apps/web/.next`, and Node.js 22 match `netlify.toml`.
3. Provision managed PostgreSQL separately. Complete schema and migrations 002 and 003 before exposing customer traffic.
4. Configure environment secrets in Netlify settings; never in repository files or client-side `NEXT_PUBLIC_*` variables.
5. Set `NEXT_PUBLIC_APP_URL` to the **actual** HTTPS hostname, not the suggested placeholder.
6. Validate the Netlify-provisioned certificate and redirects to HTTPS before onboarding customers.

## Required production configuration
`DATABASE_URL`, `DB_SSL_REJECT_UNAUTHORIZED=true`, `SESSION_SECRET`, `ANALYTICS_SALT`, `WORKER_SECRET`, `WEBHOOK_ENCRYPTION_KEY`, and `NEXT_PUBLIC_APP_URL`. The signing/encryption secrets must be randomly generated and stored privately. Configure commercial display variables separately; no payment merchant credentials are active until provider approval.

## Deployment smoke test
- Verify `GET /api/health` returns HTTP 200 with `status=ok` and `database=ok`; HTTP 503 is a release blocker.
- Verify valid TLS certificate, HTTPS navigation, expected security headers and no secrets in HTML/client bundles.
- Test registration, login/logout, card CRUD/publish, public profile, QR PNG/SVG, vCard, links, leads, analytics, organization membership and webhook administration with non-production test accounts.
- Test invalid auth, revoked/unpublished cards, restricted roles, error responses and a controlled rollback.
- Validate webhook worker scheduling separately; do not enable delivery before credentials, migrations and endpoint restrictions are checked.

## Monitoring and incident response
Configure an external HTTPS monitor for `/api/health` with an alert for non-200 responses, repeated failures and certificate expiry. Add platform build/function failure alerts and database capacity/backup alerts. Keep secrets and personal data out of monitoring payloads. Assign a named incident owner and escalation route before pilot onboarding.

On an incident, suspend onboarding and write operations as needed; inspect Netlify deployment/function logs, database health and the most recent deploy. Roll back to the last validated deployment or restore the database using `docs/PRODUCTION_DATABASE_RECOVERY.md`. Record recovery time, affected customers and verification evidence.

## Release evidence checklist
Capture actual project URL, deploy ID, commit SHA, TLS/certificate validation, health response timestamp, environment-variable presence (never values), database restore rehearsal result, monitor alert test, smoke-test results and rollback test.

## External acceptance boundary
Repository configuration alone does **not** confirm a Netlify project exists, HTTPS works, monitors are active, secrets are configured, or the pilot is live. These require account access and recorded validation. Production launch and PR merge remain separately authorized actions.
