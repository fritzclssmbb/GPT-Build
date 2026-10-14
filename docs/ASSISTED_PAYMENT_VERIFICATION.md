# Digi-IP Hub — Assisted Payment Verification Controls

## Seller verification authority

Customer, organization-owner, and organization-admin sessions must never grant payment-verification authority. A separate seller-operator identity and authorization system is required. Do not use a publicly callable route guarded only by a shared secret as the final verification solution.

## Required approval transaction

1. Seller operator authenticates with a dedicated, MFA-protected identity.
2. Server checks an explicit seller-operator entitlement independent of customer roles.
3. Server retrieves the order with row-level locking inside a database transaction.
4. Only `submitted` or `under_review` orders may advance to `verified`; rejection must be separately recorded.
5. Operator compares actual settlement evidence with the method, PHP amount, customer reference, and seller account statement.
6. Store verifier ID, timestamp, evidence reference, and immutable audit event.
7. Apply plan entitlements only after verified settlement, in the same transaction as subscription activation. Enforce idempotency to prevent double activation.
8. Notify customer of approval or rejection without disclosing private settlement evidence.

## Separation of duties and fraud controls

Require a second approver for high-value or disputed payments; thresholds must be approved by TophComm Systems. Never accept screenshots or customer-supplied references as settlement proof by themselves. Reject duplicate provider references and record any overrides. No customer-facing endpoint may set `verified_at`, `verified_by`, `status='verified'`, or subscription `status='active'`.

## Commercial release gates

- Seller's legal identity and merchant settlement account confirmed.
- Pricing and plan periods approved.
- Seller-operator access model implemented and tested.
- Manual verification with real settlement evidence demonstrated.
- Approval/rejection/idempotency/race-condition tests passed.
- Refund, chargeback and reversal procedure approved.
- Payment terms and privacy notice published.

This document is a control specification, **not** a claim that seller verification or automatic subscription activation is implemented.
