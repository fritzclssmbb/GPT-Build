-- Record commercial terms on assisted-payment orders before activation.
-- Legacy pending orders intentionally retain NULL terms and cannot be activated
-- until a separate customer-accepted terms flow is implemented.
ALTER TABLE payment_orders
 ADD COLUMN IF NOT EXISTS billing_period_months integer,
 ADD COLUMN IF NOT EXISTS seat_count integer,
 ADD COLUMN IF NOT EXISTS terms_accepted_at timestamptz,
 ADD COLUMN IF NOT EXISTS terms_version text;
ALTER TABLE payment_orders
 ADD CONSTRAINT payment_orders_billing_period_valid CHECK (billing_period_months IS NULL OR billing_period_months BETWEEN 1 AND 36),
 ADD CONSTRAINT payment_orders_seat_count_valid CHECK (seat_count IS NULL OR seat_count BETWEEN 1 AND 100000),
 ADD CONSTRAINT payment_orders_terms_pair_valid CHECK ((terms_accepted_at IS NULL) = (terms_version IS NULL));
COMMENT ON COLUMN payment_orders.billing_period_months IS 'Customer-accepted billing duration; NULL means not specified and activation blocked.';
COMMENT ON COLUMN payment_orders.seat_count IS 'Customer-accepted seats; NULL means not specified and activation blocked.';
