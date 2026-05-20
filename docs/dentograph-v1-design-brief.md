# DentoGraph v1 Product and Design Brief

Last updated: May 19, 2026

## Purpose

This document summarizes the current DentoGraph product direction, the latest design feedback, and the next implementation tasks for the patient homepage and provider portal. It is written as a handoff brief for engineers, designers, founders, or another LLM model continuing the work.

## Product Positioning

DentoGraph is a patient-owned dental record platform with two distinct product surfaces:

1. Patient Portal: helps patients collect, understand, and share dental records.
2. Provider Portal: helps dental teams explain findings chairside, draft documentation, and manage compliant record exchange.

The two flows should not look or behave like the same app with different labels. They share the same underlying record layer, but the UI, content hierarchy, and emotional tone should be different.

## Patient Portal v1 Feature Spec

### Goal

Deliver a focused patient-owned layer that turns dental records into a visual, plain-language, shareable story the patient can understand and carry to other providers.

### Core Value Proposition

"DentoGraph gives you a 3D-style visual story of your teeth, plain-language explanations of what changed, and a secure way to share your history with any dentist."

### Patient User Flow

1. Onboarding
   - User signs up or is invited by a dentist.
   - Patient imports records: scans, X-rays, prescriptions, clinical notes, or PDFs.

2. Home View
   - 3D tooth-map or tooth-timeline summary.
   - One-sentence headline, for example: "Your last visit: cavity treated on tooth 19."
   - Primary action: "See full timeline."

3. Timeline View
   - Chronological visits.
   - Each visit card includes date, visit type, one-line plain-language summary, and a small X-ray/scan thumbnail.

4. Visit Detail
   - Visual-first 3D-style record preview for that visit.
   - Plain-language findings: 2-4 bullets explaining what changed and why it matters.
   - Secure share button: generates a time-limited, view-only link for the visit or full history.
   - No separate left navigation in the record view. A record should behave like a focused report with a clear "Back to dashboard" action.
   - DentoBot should remain collapsed by default so opening a record starts with the visual record, not a chat experience.
   - Use one patient-language explanation mode for v1; avoid Doctor/My Speak toggles until the content model is stronger.
   - Show "Questions for your dentist" as concrete prompts instead of long clinical follow-up paragraphs.
   - Keep source files in a dedicated page labeled as original documents.

5. DentoBot
   - Visible as "DentoBot" for now. The team may rename this later, but avoid the generic "Ask DentoGraph" label in current implementation.
   - Explains records and dental terms in plain language.
   - Uses controlled sources: uploaded patient records, provider notes/recommendations, and a curated clinic-approved FAQ.
   - Does not diagnose, prescribe, choose treatment, or recommend products unless the recommendation exists in the clinic-approved knowledge base.
   - Escalates with: "For personalized advice, please ask your dentist."

6. Secure Sharing
   - Share as PDF or share link per visit or full history.
   - Links are view-only, optionally password-protected, time-limited, and audit-trailable.
   - Audit log is visible to clinics/admins, not necessarily to patients in v1.

### Patient MVP Features

- 3D-style tooth map: visual, interactive-feeling view; not necessarily a full physics-based 3D engine in v1.
- Plain-language findings per visit.
- Chronological timeline history.
- Secure share link: time-limited, view-only, audit-trailable.
- DentoBot: basic, non-diagnostic, record-grounded explanation plus limited FAQ guidance.

### Patient Future Features

- Advanced referral or specialist export formats.
- Clinic-approved treatment-plan previews.
- Appointment-related reminders.
- Multi-patient family view for parents or guardians.

### DentoBot Hard Boundaries

- No diagnosis.
- No "you need X treatment" statements.
- No personalized product recommendations unless the clinic uploaded approved recommendations.
- No replacement for a dentist.
- Always routes uncertain or clinical advice questions back to a licensed dental professional.

## Current Patient Homepage Gaps

Current file: `app/page.tsx`

The redesigned homepage now includes:

- Patient-owned dental record positioning.
- Product-first hero visual.
- Patient workflow: collect records, understand findings, share with care.
- Explicit DentoBot v1 feature copy.
- Privacy and AI boundary section.
- Contact path in nav/footer.
- Transparent DentoGraph logo assets.

Watch items:

- The patient homepage should not over-index on provider language or compliance-heavy language.
- Continue testing whether the DentoBot name feels trustworthy to patients.

## Patient Homepage Design Decision

The patient homepage should remain patient-first, warm, plain-language, and reassuring.

Recommended homepage content sections:

1. Hero
   - Headline: "Your dental records, explained clearly."
   - Support: visual record, timeline, DentoBot, share with trusted dental professionals.
   - CTAs: "Create free beta account" and "Request my records."

2. Product proof visual
   - Phone or dashboard product mockup with tooth map, timeline, DentoBot, and share state.
   - Avoid generic stock dental imagery.

3. How DentoGraph works
   - Collect your records.
   - See what they mean.
   - Ask DentoBot.
   - Share with care.

4. V1 feature strip
   - 3D-style tooth map.
   - Timeline history.
   - Plain-language findings.
   - Ask DentoBot.
   - Secure share link.

5. Trust and boundaries
   - Patient controls sharing.
   - AI explains records, but dentists make clinical decisions.
   - Link to Privacy, Consent, Security, and AI Disclaimer.

## Provider Portal Product Direction

Current file: `app/providers/page.tsx`

The provider portal must feel like a real B2B healthcare startup product, not a school-project landing page. It should be denser, more operational, and more credible than the patient homepage.

### Provider Core Value Proposition

"DentoGraph helps dental teams turn records into chairside explanations, insurance-ready narratives, and consent-aware sharing workflows."

### Provider Pillars

1. Chairside Storyteller
   - Tablet/computer view next to the patient.
   - Converts X-rays and findings into a visual story.
   - Shows problem areas on a 3D-style mouth/tooth map.
   - Provides plain-language chairside scripts for hygienists and dentists.

2. Insurance Narrative Builder
   - Generates professional documentation from selected findings.
   - Uses insurance-aligned clinical phrasing.
   - Connects visual findings to narrative justification.
   - Must clearly state generated documentation needs clinical review/sign-off.

3. Compliance Vault
   - Handles record requests, exports, share links, consent checkpoints, and audit logging.
   - Tracks who accessed what, when, and under what authorization.
   - Should be framed as "audit-aware" and "compliance-ready roadmap," not as a legal guarantee.

### Compliance Vault Naming Direction

"Compliance Vault" is accurate internally, but too legalistic and hard to understand for dentists. Use friendlier names on the provider page and keep the technical meaning underneath.

Recommended public feature name:

- Record Release Desk

Why: dentists and front-office teams understand "records release" immediately. It sounds operational, not scary, and it maps to the actual workflow: requests, exports, consent, sharing, and audit trail.

Other acceptable options:

- Records Release Hub
- Record Request Center
- Secure Records Desk
- Audit-Ready Records

Avoid:

- Compliance Vault as the primary marketing name.
- Federal Audit Shield as a primary feature name because it sounds like a legal guarantee.
- Sovereign Share for dentists because it sounds abstract.

### Provider Homepage Structure

1. Provider Hero
   - Product-first hero with a realistic clinical pipeline mockup.
   - Headline should emphasize outcome: explain, document, share.
   - CTAs: "Join provider beta," "Request demo," and "View workflow."

2. Product Console Visual
   - Replace the current simple jaw-card with a polished generated or composed product mockup.
   - Visual should include:
     - Clinical pipeline.
     - Audit-ready status.
     - Chairside dental model preview.
     - Chairside script:
       "This early decay is easier to treat now. Waiting can make the treatment more complex and expensive."
     - Insurance note:
       "Radiographic findings support restorative treatment due to structural compromise."
   - The visual should look like real healthcare SaaS, not a decorative card.

3. Three Jobs Section
   - Chairside explanation.
   - Insurance documentation.
   - Record Release Desk.
   - Each needs a specific workflow outcome and UI cue.

4. Workflow Section
   - Upload record.
   - Highlight finding.
   - Explain chairside.
   - Draft narrative.
   - Share/export with consent.
   - Audit event captured.

5. Record Release Desk Deep Section
   - Record requests.
   - Secure exports.
   - Share access logs.
   - Consent checkpoints.
   - Audit review.
   - Plain-language explanation on page: when a patient, specialist, or new dentist asks for records, the team confirms consent, packages the right files, sends a secure link/export, and keeps a reviewable log.

6. Clinic Role Section
   - Dentist or hygienist: chairside consult.
   - Billing or treatment coordinator: documentation after the exam.
   - Front desk: records requested later.
   - This section should make the page feel like a real dental visit instead of a disconnected feature list.

7. Today vs Roadmap Section
   - Add-on layer, not a Dentrix/Open Dental replacement.
   - Works around existing practice-management software.
   - Available in v1: upload records, review AI drafts, explain findings visually, and create share-ready outputs.
   - Future sync language should be cautious unless integration is real.
   - Direct third-party integrations are roadmap items: future provider workflows should export records directly into DentoGraph from practice-management or imaging tools.
   - Privacy and review controls: consent checkpoints, role-based access, audit logs, and clinical review before information is shared.

8. Footer
   - Use transparent logo asset.
   - Enterprise-style grouped links.
   - Include Provider login, Contact, Privacy, Security, Terms, Consent, AI Disclaimer.

## Provider Design Direction

Design should be closer to enterprise healthcare SaaS than consumer marketing.

Use:

- Product UI screenshots/mockups above abstract illustration.
- Dense but organized cards.
- High contrast labels for states: Review, Draft, Shared, Audit logged.
- Clear role language: dentist, hygienist, front desk, billing/admin.
- Short, specific claims.
- Trust and governance sections with concrete controls.

Avoid:

- Oversized hero text that leaves no room for product context.
- Generic dental stock imagery.
- Overclaiming HIPAA compliance or legal protection.
- Consumer-style warmth in provider workflows where speed and precision matter.
- Reusing patient homepage components one-for-one.

## Research-Informed Design Notes

These references are directional inputs for design strategy:

- Anthropic Enterprise emphasizes governance, data controls, audit infrastructure, regulated-industry use, and a strong trust center. DentoGraph provider pages should copy the pattern of making control and auditability visible, not just saying "secure." Source: https://www.anthropic.com/product/enterprise
- Healthcare UX guidance emphasizes clear language, trust cues, privacy, accessibility, and task completion under stress. Patient pages should reduce anxiety and avoid clinical jargon. Source: https://www.easternstandard.com/blog/healthcare-website-agency/
- Healthcare SaaS UX should use distinct role-based views. Patient-facing screens optimize for reassurance and clarity; clinical/provider screens optimize for density, efficiency, expert workflows, and decision support. Source: https://designpixil.com/blog/healthcare-saas-ui-design
- TrumpRx demonstrates a public healthcare product pattern with bold claims, searchable/browsable action, proof via comparisons, FAQ split by audience, and a clear browse CTA. DentoGraph should borrow the clarity of audience-specific FAQ/action paths, not the political/overclaim tone. Source: https://trumprx.gov/
- Footer UX research supports semantically grouped footer links so users can find trust, support, product, and legal paths quickly. Source: https://baymard.com/blog/footer-links-ecommerce

## HIPAA and Healthcare Trust Direction

This design brief is not a legal compliance certification. The product should present controls accurately and avoid saying "HIPAA compliant" unless the business has the required policies, BAAs, risk analysis, security operations, and vendor controls in place.

Required product/data controls to preserve or build:

- Consent checkpoints for upload, AI processing, sharing, and provider access.
- Audit logs for record upload, record view, share creation, share access, export/download, AI analysis, and admin/provider actions.
- Time-limited share links.
- Optional password-protected sharing.
- Role-based access control for patient/provider/admin roles.
- Data minimization in logs and analytics.
- Clear AI disclaimer and clinical review requirement.
- Security and privacy pages linked from footer and relevant flows.
- Supabase RLS policies must be reviewed after schema changes.

## HIPAA Readiness in Plain English

HIPAA does not require a single official outside certificate that makes a startup "HIPAA compliant." HHS states that covered entities are not required to certify Security Rule compliance, and an outside certification does not prevent HHS from later finding a violation.

For DentoGraph, HIPAA readiness is a set of business, legal, and technical practices. Because DentoGraph handles dental records for or with dental providers, it will likely be treated as a business associate when working with covered dental practices. That means DentoGraph needs appropriate safeguards and written business associate agreements when handling PHI for providers.

Minimum startup readiness checklist:

- Identify whether DentoGraph is acting as a business associate for each provider relationship.
- Have a Business Associate Agreement template reviewed by a healthcare attorney.
- Sign BAAs with vendors/subprocessors that create, receive, maintain, or transmit PHI, such as cloud, database, storage, logging, support, and AI vendors where applicable.
- Perform and document a Security Risk Analysis.
- Assign one person as the internal HIPAA/security owner, even if the team is small.
- Create simple written policies: access control, incident response, breach response, workforce training, device/security practices, vendor review, and data retention/deletion.
- Train everyone with access to PHI on those policies.
- Use technical safeguards: MFA, role-based access, least privilege, encryption in transit/at rest, audit logs, access review, secure backups, and logging that avoids unnecessary PHI.
- Avoid marketing claims like "HIPAA certified" or "fully HIPAA compliant" until legal/security review confirms the company can support those claims.

Recommended website wording for now:

"Built with HIPAA-aware safeguards, consent checkpoints, and audit logging as part of our healthcare privacy roadmap."

Avoid:

"100% HIPAA compliant."

"HIPAA certified."

"Federal audit shield."

## Implementation Task List

### Phase 1: Documentation and Alignment

- [x] Create this v1 product/design handoff document.
- [ ] Review patient v1 scope with founder/team.
- [x] Confirm assistant name for now: use "DentoBot" until a future rename is finalized.
- [x] Confirm provider CTA wording: use both "Join provider beta" and "Request demo."

### Phase 2: Patient Homepage Updates

- [x] Add an explicit DentoBot feature to the patient homepage.
- [x] Convert "How DentoGraph works" from 3 steps to either 4 steps or a separate v1 feature strip.
- [x] Ensure DentoBot copy follows guardrails: explains records, translates terms, does not diagnose.
- [x] Ensure homepage includes the five v1 patient features: tooth map, timeline, findings, DentoBot, secure sharing.
- [ ] Smoke test mobile and desktop after copy/layout changes.

### Phase 3: Provider Portal Redesign

- [x] Generate or compose a new provider hero product visual.
- [x] Replace current provider console with polished clinical pipeline mockup.
- [x] Add a deeper Record Release Desk section.
- [x] Add a workflow that includes audit capture as a visible final step.
- [x] Rework provider pillars into stronger B2B feature modules.
- [x] Update provider footer to transparent logo and grouped enterprise links.
- [ ] Make provider page responsive and verify mobile layout.

### Phase 4: Provider Portal Content

- [x] Rewrite provider headline and lede for a dental-practice buyer.
- [ ] Add role-based benefits for dentist, hygienist, front desk, and billing/admin.
- [x] Add "add-on, not replacement" positioning for Dentrix/Open Dental/Eaglesoft.
- [x] Add compliance disclaimers without weakening trust.
- [ ] Add provider FAQ or objection handling if page length allows.

### Phase 5: Product and Data Follow-Through

- [ ] Verify share links, PDF exports, and audit logs work end to end.
- [ ] Verify Supabase schema has tables/policies for shares, access logs, consents, exports, AI logs, and provider actions.
- [ ] Confirm all patient/provider routes use transparent logo assets where white backgrounds are visible.
- [ ] Review auth, dashboard, request, export, and provider pages for remaining old/school-project UI.

## Suggested Provider Hero Image Prompt

Use this for image generation if creating a raster product visual:

"A polished enterprise healthcare SaaS product mockup for a dental provider portal, shown on a tablet and desktop dashboard. The interface shows a clinical pipeline, audit-ready status, a 3D-style dental model preview, a chairside script panel, an insurance note panel, consent status, and secure share activity. Clean white and soft teal/navy UI, realistic product screenshot style, no patient faces, no readable personal health information, no logos, no stock photo look."

## Suggested Provider Hero UI Copy

Clinical pipeline

Audit-ready

Chairside dental model preview

Chairside script:
"This early decay is easier to treat now. Waiting can make the treatment more complex and expensive."

Insurance note:
"Radiographic findings support restorative treatment due to structural compromise."

Consent and audit:
"Share link created. Access expires in 7 days. Event logged."

## Assistant Naming Ideas

The assistant should feel helpful and safe without sounding like it gives medical advice. Avoid names that imply diagnosis, treatment planning, or clinical authority.

Decision:

- Use DentoBot for now.
- The team may rename later.
- Do not use the generic "Ask DentoGraph" label in current implementation.

Other possible future names:

- DentoGuide: friendly, clear, and implies guidance rather than diagnosis.
- Record Guide: very plain and trustworthy, but less ownable.

Avoid:

- Dental Doctor AI
- Tooth Doctor
- Diagnosis Assistant
- Treatment Advisor
- Care Oracle

Current public copy:

"Ask DentoBot to explain dental terms, summarize your visit, and help you prepare questions for your dentist. It does not diagnose or choose treatment."

## Decisions and Open Questions

Decisions from founder:

- Provider acquisition CTAs should include both "Join beta" and "Request demo."
- Compliance Vault should be renamed to a more dentist-friendly public name. Current recommendation: "Record Release Desk."
- Record Release Desk means the provider workflow for handling patient record requests, secure exports, consent, share links, and audit logs.
- Third-party integrations are roadmap, not current functionality. Future state: integrate with third-party dental tools to export directly into DentoGraph.
- HIPAA readiness is not yet complete; founder needs plain-English guidance on what it means for a startup.
- The company has not yet assigned an internal HIPAA/security owner.

Open questions:

- Should Record Release Desk be visible only on the provider page, or also referenced as a light trust cue on the patient homepage?
