-- Seller step-up authentication: server-side, short-lived and one-time.
-- Never infer MFA from users.mfa_enabled or seller_operators.mfa_verified_at.
CREATE TABLE IF NOT EXISTS seller_mfa_challenges (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 operator_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 challenge_hash text NOT NULL UNIQUE,
 purpose text NOT NULL CHECK (purpose IN ('payment_approval','payment_rejection')),
 issued_at timestamptz NOT NULL DEFAULT now(),
 expires_at timestamptz NOT NULL,
 consumed_at timestamptz,
 CHECK (expires_at > issued_at)
);
CREATE INDEX IF NOT EXISTS seller_mfa_challenges_operator_idx ON seller_mfa_challenges(operator_user_id,expires_at DESC);
-- Challenges must only be inserted by a server-side trusted MFA assertion verifier.
-- The presence of a row alone is insufficient for granting approval access.
