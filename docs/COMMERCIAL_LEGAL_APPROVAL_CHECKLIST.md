# Digi-IP Hub — Commercial and Legal Approval Checklist (DRAFT)

**Status:** NOT APPROVED / NOT PUBLISHED. This document is an operational drafting checklist, not legal advice or customer terms.

**Brand:** FS Softwares · **Product:** Digi-IP Hub · **Seller/operator:** TophComm Systems (registered legal name and registration details require verification).

## Publication prerequisites
- [ ] Verify seller registered entity name, business address, registration, tax and contact details.
- [ ] Approve plan descriptions, PHP prices inclusive/exclusive of applicable taxes, billing periods, seat limits and renewal policy.
- [ ] Publish complete customer-facing terms of service, with version and effective date.
- [ ] Publish a privacy notice explaining collected profile/contact data, lawful bases, recipients, retention, rights requests and breach contacts.
- [ ] Approve refund, cancellation, disputed transfer, failed payment and non-activation procedures.
- [ ] Verify official GCash/Maya collection channels and independent settlement checks; do not publish account numbers from unverified sources.
- [ ] Define support hours, service commitments, complaint escalation and response channels.
- [ ] Review Philippine consumer, e-commerce, data privacy and applicable tax obligations with qualified advisers.
- [ ] Capture explicit customer acceptance of the exact published terms version, plan, price, billing period and seat count.
- [ ] Conduct a runtime test of the versioned terms URL and approval gates before enabling PILOT_TERMS_PUBLISHED.

## Launch controls
Keep `PILOT_TERMS_PUBLISHED` unset or false until approved text is actually deployed. Do not set `PILOT_TERMS_URL` to a placeholder page. Prices and billing duration are separately disabled until approved. Manual payment verification, seller MFA, refunds and activation controls require implementation and testing.

**Approval record (to be completed):** legal reviewer, business approver, approved version, effective date, document hash, approval timestamp and deployment evidence.
