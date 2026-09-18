CREATE EXTENSION IF NOT EXISTS pgcrypto;\nCREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  brand_logo_url text,
  primary_color text,
  secondary_color text,
  default_template text NOT NULL DEFAULT 'emerald-network',
  plan_tier text NOT NULL DEFAULT 'free' CHECK (plan_tier IN ('free','pro','business','enterprise')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email citext NOT NULL UNIQUE,
  display_name text NOT NULL,
  password_hash text,
  auth_provider text NOT NULL DEFAULT 'local',
  mfa_enabled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE organization_memberships (
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('owner','admin','member')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','invited')),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (organization_id, user_id)
);

CREATE TABLE cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
  slug text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','inactive')),
  template_id text NOT NULL DEFAULT 'emerald-network',
  display_name text NOT NULL,
  title text,
  company text,
  photo_url text,
  phones jsonb NOT NULL DEFAULT '[]'::jsonb,
  emails jsonb NOT NULL DEFAULT '[]'::jsonb,
  address jsonb,
  bio text,
  primary_cta jsonb,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX cards_org_idx ON cards(organization_id);
CREATE INDEX cards_owner_idx ON cards(owner_user_id);

CREATE TABLE link_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id uuid NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('social','custom','cta')),
  label text NOT NULL,
  url text NOT NULL,
  icon text,
  sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE media_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id uuid NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('image','video','pdf')),
  url text NOT NULL,
  caption text,
  sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE lead_captures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id uuid NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  submitted_name text NOT NULL,
  email citext,
  phone text,
  note text,
  source text NOT NULL DEFAULT 'public-card',
  consent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX lead_card_created_idx ON lead_captures(card_id, created_at DESC);

CREATE TABLE analytics_events (
  id bigserial PRIMARY KEY,
  card_id uuid NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  event_type text NOT NULL CHECK (event_type IN ('view','link_click','vcard_download','lead_submit')),
  link_block_id uuid REFERENCES link_blocks(id) ON DELETE SET NULL,
  visitor_hash text,
  referrer text,
  device_type text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX analytics_card_created_idx ON analytics_events(card_id, created_at DESC);

CREATE TABLE webhook_endpoints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  card_id uuid REFERENCES cards(id) ON DELETE CASCADE,
  url text NOT NULL,
  signing_secret_hash text NOT NULL,\n  signing_secret_ciphertext text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (organization_id IS NOT NULL OR card_id IS NOT NULL)
);

CREATE TABLE webhook_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint_id uuid NOT NULL REFERENCES webhook_endpoints(id) ON DELETE CASCADE,
  event_name text NOT NULL,
  payload jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','delivered','failed','dead_letter')),
  attempts integer NOT NULL DEFAULT 0,
  next_attempt_at timestamptz,
  last_http_status integer,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  delivered_at timestamptz
);

CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  provider text NOT NULL,
  provider_customer_id text,
  provider_subscription_id text,
  plan_tier text NOT NULL CHECK (plan_tier IN ('free','pro','business','enterprise')),
  seat_count integer NOT NULL DEFAULT 1 CHECK (seat_count > 0),
  status text NOT NULL,
  current_period_end timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (organization_id IS NOT NULL OR user_id IS NOT NULL)
);

CREATE TABLE audit_logs (
  id bigserial PRIMARY KEY,
  organization_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
  actor_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  action text NOT NULL,
  target_type text,
  target_id text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);