-- Action 16: assisted payment intake. This migration does not grant plan entitlements.
CREATE TABLE IF NOT EXISTS payment_orders (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
 user_id uuid REFERENCES users(id) ON DELETE CASCADE,
 plan_tier text NOT NULL CHECK (plan_tier IN ('pro','business','enterprise')),
 amount_minor bigint NOT NULL CHECK (amount_minor > 0),
 currency text NOT NULL DEFAULT 'PHP' CHECK (currency='PHP'),
 method text NOT NULL CHECK (method IN ('gcash','maya')),
 status text NOT NULL DEFAULT 'awaiting_payment' CHECK (status IN ('awaiting_payment','submitted','under_review','verified','rejected','cancelled')),
 customer_reference text,
 customer_note text,
 submitted_at timestamptz,
 verified_at timestamptz,
 verified_by uuid REFERENCES users(id) ON DELETE SET NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK ((organization_id IS NOT NULL)::integer + (user_id IS NOT NULL)::integer = 1),
 CHECK (status <> 'verified' OR (verified_at IS NOT NULL AND verified_by IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS payment_orders_org_idx ON payment_orders(organization_id,created_at DESC);
CREATE INDEX IF NOT EXISTS payment_orders_user_idx ON payment_orders(user_id,created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS payment_orders_method_reference_unique ON payment_orders(method,lower(customer_reference)) WHERE customer_reference IS NOT NULL AND status <> 'rejected' AND status <> 'cancelled';
