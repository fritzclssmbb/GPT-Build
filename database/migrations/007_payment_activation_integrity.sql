-- Idempotency and ownership constraints for future assisted-payment activation.
-- This migration does not authorize or perform payment approval.
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS payment_order_id uuid REFERENCES payment_orders(id) ON DELETE RESTRICT;
CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_payment_order_unique
  ON subscriptions(payment_order_id) WHERE payment_order_id IS NOT NULL;
-- Prevent activating the same verified payment order more than once.
-- Legacy subscriptions with no linked order remain supported.
CREATE INDEX IF NOT EXISTS subscriptions_org_status_idx
  ON subscriptions(organization_id,status,created_at DESC);
CREATE INDEX IF NOT EXISTS subscriptions_user_status_idx
  ON subscriptions(user_id,status,created_at DESC);
