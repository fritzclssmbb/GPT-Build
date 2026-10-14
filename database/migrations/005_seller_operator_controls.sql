-- Seller operator authorization is separate from customer/organization RBAC.
-- Provisioning is performed only by a trusted database administrator.
CREATE TABLE IF NOT EXISTS seller_operators (
 user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
 active boolean NOT NULL DEFAULT false,
 can_verify_payments boolean NOT NULL DEFAULT false,
 mfa_verified_at timestamptz,
 provisioned_at timestamptz NOT NULL DEFAULT now(),
 provisioned_by text NOT NULL
);
CREATE TABLE IF NOT EXISTS payment_review_events (
 id bigserial PRIMARY KEY,
 payment_order_id uuid NOT NULL REFERENCES payment_orders(id) ON DELETE RESTRICT,
 operator_user_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
 action text NOT NULL CHECK(action IN ('review_started','verified','rejected','reopened')),
 evidence_reference text,
 note text,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS payment_review_events_order_idx ON payment_review_events(payment_order_id,created_at DESC);
-- No default seller operator. Existing application sessions do not grant seller rights.
-- A separate MFA verification mechanism must be implemented before enabling approval.
