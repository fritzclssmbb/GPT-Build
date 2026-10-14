# Payment operator implementation gate

Status: **blocked pending dedicated seller authentication and MFA**.

The existing `users.mfa_enabled` column is a boolean and is **not** proof of a recent MFA challenge. The new `seller_operators.mfa_verified_at` column is administrative metadata and must not be accepted by itself as an authenticated MFA claim. No existing customer or organization session may approve payments.

## Implementation sequence

1. Establish a separate seller-operator authentication flow with phishing-resistant MFA or a trusted identity provider, server-verified challenge assertions, session expiry and revocation.
2. Bind the operator identity to `seller_operators` with `active=true` and `can_verify_payments=true`. Provision these permissions out of band by a trusted administrator.
3. Require fresh MFA at approval time; verify the authentication event server-side rather than trusting a client-supplied timestamp.
4. Add a payment review endpoint with strict CSRF protection, throttling, state validation and evidence-reference requirements.
5. In a single PostgreSQL transaction, lock the order, verify amount/currency/reference and settlement evidence, enforce one-time transition to `verified`, insert review/audit records, and activate the matching subscription.
6. Add compensating workflows for rejection, refunds, reversals, expired subscriptions and disputes.
7. Add integration tests for customer impersonation, missing MFA, duplicate references, concurrent approvals, retries, failed settlement, rollback and entitlement visibility.

## Current protections

- Payment orders and customer-submitted references are scoped to the authenticated customer or organization.
- The pricing catalog is server-side and disabled until seller approval.
- The database defaults all seller operator privileges to disabled.
- The payment submission API cannot mark an order verified or activate a subscription.

## Explicit limitations

No seller approval endpoint or automatic entitlement activation is provided until the authentication and MFA gate is implemented and tested. A shared bearer secret, static password, or organization-owner role is not an acceptable substitute. CI build success is not proof of payment security or production readiness.
