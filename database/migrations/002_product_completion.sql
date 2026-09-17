CREATE TABLE IF NOT EXISTS card_versions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 card_id uuid NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
 snapshot jsonb NOT NULL,
 created_by_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS card_versions_card_idx ON card_versions(card_id,created_at DESC);

CREATE TABLE IF NOT EXISTS invitations (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
 email citext NOT NULL,
 role text NOT NULL DEFAULT 'member' CHECK(role IN('admin','member')),
 token_hash text NOT NULL UNIQUE,
 invited_by_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
 expires_at timestamptz NOT NULL,
 accepted_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS invitations_org_idx ON invitations(organization_id,created_at DESC);

CREATE TABLE IF NOT EXISTS daily_analytics_rollups (
 card_id uuid NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
 day date NOT NULL,
 views integer NOT NULL DEFAULT 0,
 unique_visitors integer NOT NULL DEFAULT 0,
 link_clicks integer NOT NULL DEFAULT 0,
 vcard_downloads integer NOT NULL DEFAULT 0,
 lead_submissions integer NOT NULL DEFAULT 0,
 PRIMARY KEY(card_id,day)
);
