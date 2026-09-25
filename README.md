# Digi-IP Hub

**Digi-IP Hub** is the commercial digital identity platform by **FS Softwares**, operated and sold by **TophComm Systems**.

## Commercial pilot

The active pilot is a multi-tenant Next.js/PostgreSQL SaaS for professional digital identity: card creation and publishing, public profiles, QR/vCard sharing, consent-based lead capture, analytics and organization governance.

Payment priority for the pilot:
1. GCash — primary online checkout.
2. Maya — secondary.
3. Bank transfer / credit or debit card — supported commercial paths as merchant integrations are activated.

No payment credential, merchant secret or production database secret belongs in source control.

## Run locally

Requirements: Node.js 20+ and PostgreSQL.

```bash
npm install
npm run dev
```

## Netlify pilot deployment

This repository is prepared for a Netlify-connected Git deployment. Configure production environment variables in the Netlify project settings, not in Git. The pilot site name can use `digi-ip-hub` if available; Netlify determines final `.netlify.app` availability at project creation.

Required application secrets are documented in `.env.example`. Run the database schema/migrations against the production PostgreSQL instance before enabling customer access.

## Current release boundary

Core card, public profile, lead and organization flows are implemented. Self-service billing, production merchant integration, privileged MFA/OAuth, full webhook administration, dependency/security closure and broad E2E validation remain commercial release gates. Do not represent those target capabilities as live until validated.

## Ownership

Product: Digi-IP Hub  
Brand: FS Softwares  
Seller/operator: TophComm Systems
