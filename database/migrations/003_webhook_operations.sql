-- Digi-IP Hub webhook operational state
ALTER TABLE webhook_deliveries ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
CREATE INDEX IF NOT EXISTS webhook_delivery_queue_idx ON webhook_deliveries(status,next_attempt_at,created_at);
