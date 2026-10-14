# Assisted-payment subscription activation: transactional contract

**Status: design contract only; activation is not enabled.** The approval endpoint must remain absent until the dedicated seller identity provider, fresh MFA assertion verification, and settlement evidence checks are implemented and tested.

## Preconditions
- Authenticate an active, separately provisioned seller operator; never accept customer or organization sessions as seller authorization.
- Verify a fresh, server-side MFA assertion bound to the operator, payment order, action, and short expiration. A timestamp in the database or a client-submitted token is insufficient without a trusted verifier.
- Independently reconcile merchant settlement evidence with the order method, reference, PHP currency, amount in centavos, payee account and recipient; never trust the customer's reference alone.
- Confirm billing period, seat count, plan price, and subscription term are explicitly configured and accepted by the customer. These are not yet modeled in payment orders and **must not be guessed**.

## Required atomic operation
Within one database transaction:
1. Lock the payment order with `SELECT ... FOR UPDATE`.
2. Require its state to be `submitted` or `under_review` and revalidate scope, price, evidence and verified MFA authorization.
3. Enforce idempotency with `subscriptions.payment_order_id` unique index from migration 007; retrying an already-verified order must not extend the paid period or grant extra seats.
4. Insert exactly one subscription with the same organization/user ownership as the order, explicit term, seat count and approved tier.
5. Mark the payment order `verified`, set `verified_at` and `verified_by`, and record the seller review event and audit event in the same transaction.
6. Update effective plan entitlement only after the same transaction succeeds. Do not expose a paid plan if any step fails.

## Failure handling
- Duplicate settlement reference: reject or queue for manual investigation.
- Concurrent review: the row lock serializes decisions; a second decision returns the existing result without new entitlement.
- Missing or expired MFA: deny approval.
- Evidence mismatch: deny approval and record a non-activation review outcome.
- Database failure: roll back order, subscription, plan and audit changes.
- Refund or chargeback: use a separately authorized reversal workflow and maintain audit history.

## Release gates
Integration tests must exercise two concurrent approvals, repeat requests, operator privilege revocation, MFA expiry/replay, payment evidence mismatch, rollback on audit failure, and entitlement visibility for individual and organization accounts. Perform a real pilot settlement reconciliation and restore rehearsal before enabling production approvals.

No migration alone guarantees these invariants; the future approval service must enforce them.
