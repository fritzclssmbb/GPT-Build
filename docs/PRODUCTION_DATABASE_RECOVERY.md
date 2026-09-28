# Digi-IP Hub — Production PostgreSQL Recovery Runbook

## Production requirements

Use a managed PostgreSQL service with TLS, automated backups, point-in-time recovery where available, and provider-side encryption at rest. Set `DATABASE_URL` only in the deployment secret store and keep `DB_SSL_REJECT_UNAUTHORIZED=true`.

The application production pool rejects untrusted TLS certificates by default. Do not disable certificate verification for a customer-facing deployment.

## Migration order

For a new database, apply and record these files in order:

1. `database/schema.sql`
2. `database/migrations/002_product_completion.sql`
3. `database/migrations/003_webhook_operations.sql`

Take a provider snapshot or logical backup immediately before any production schema migration. Apply migrations first to a staging/restored copy when possible.

## Logical backup

Run from a trusted administration host with a PostgreSQL client compatible with the server:

```bash
pg_dump --format=custom --no-owner --no-acl --file=digi-ip-hub-YYYYMMDD-HHMM.dump "$DATABASE_URL"
```

Store backups outside the application host in access-controlled storage. Do not commit dumps to Git.

## Restore rehearsal

Restore into an empty, isolated recovery database — never over the live database:

```bash
createdb "$RECOVERY_DATABASE_NAME"
pg_restore --exit-on-error --no-owner --no-acl --dbname="$RECOVERY_DATABASE_URL" digi-ip-hub-YYYYMMDD-HHMM.dump
```

After restore, point a non-production Digi-IP Hub instance at the recovery database and verify:

- `/api/health` returns HTTP 200 and database status is OK.
- Required tables and migrations are present.
- Authentication and a representative card can be read.
- Published card, links, QR/vCard, lead and analytics reads work.
- Webhook delivery records can be read; do not enable the webhook worker during a restore rehearsal.

Record the backup timestamp, restore start/end time, operator, database/provider identifiers, verification results and any errors.

## Incident recovery

1. Stop customer writes or place the application in maintenance mode.
2. Identify the recovery point and preserve the affected database for investigation.
3. Restore the selected provider snapshot/PITR point or verified logical backup into a new database.
4. Validate schema and application health against the restored database.
5. Rotate database credentials if compromise is suspected.
6. Change the deployment `DATABASE_URL` to the validated restored database.
7. Re-enable traffic, then monitor health, authentication, writes, webhook queues and error logs.
8. Preserve an incident record and document data-loss window and recovery time.

## Recovery acceptance gate

Production database readiness is not complete until a real managed PostgreSQL instance has been provisioned, TLS verified, automated backups confirmed, and at least one restore rehearsal has succeeded. Repository configuration and this runbook alone do not prove those external controls.
