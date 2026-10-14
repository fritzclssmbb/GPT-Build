-- Policy publication records are deliberately separate from draft documents.
-- No records are seeded; an authorized, externally reviewed approval workflow is required.
CREATE TABLE IF NOT EXISTS legal_policy_approvals (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 policy_type text NOT NULL CHECK (policy_type IN ('commercial_terms','privacy_notice','refund_policy')),
 version text NOT NULL CHECK (length(version) BETWEEN 1 AND 80),
 document_sha256 text NOT NULL CHECK (document_sha256 ~ '^[0-9a-f]{64}$'),
 document_path text NOT NULL CHECK (length(document_path) BETWEEN 1 AND 512),
 approved_by text NOT NULL CHECK (length(trim(approved_by)) > 0),
 approval_reference text NOT NULL CHECK (length(trim(approval_reference)) > 0),
 approved_at timestamptz NOT NULL,
 effective_at timestamptz NOT NULL,
 revoked_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(policy_type,version),
 CHECK (revoked_at IS NULL OR revoked_at >= approved_at)
);
CREATE INDEX IF NOT EXISTS legal_policy_approvals_active_idx
 ON legal_policy_approvals(policy_type,version,effective_at)
 WHERE revoked_at IS NULL;
