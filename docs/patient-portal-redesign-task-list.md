# DentoGraph Patient Portal Redesign Task List

Last updated: May 19, 2026

## Goal

Redesign the logged-in patient portal so it feels like a calm, mobile-friendly personal dental record app rather than an internal project dashboard. The patient should quickly understand:

- What is in my record?
- What changed?
- What should I ask my dentist?
- How do I share this safely?
- Where do I update my profile, insurance, and emergency details?

## Research-Informed UX Direction

Use patient language, not clinical system language. Patient portals work best when they show a simplified dashboard, recent results, health records, profile data, and clear next actions. Mobile-first navigation matters because patients often use portals on phones rather than desktop.

Design implications for DentoGraph:

- Use a small set of stable navigation destinations: Home, Records, DentoBot, Share, Profile.
- Put the most important next action first.
- Keep clinical terms behind plain-language summaries.
- Make sharing feel controlled and reversible.
- Make profile and insurance information easy to find and edit.
- Keep trust language short and action-oriented.

References:

- Healthcare portal UX should use simplified dashboards and patient language: https://www.proactivechart.com/resources/patient-portal-features/
- Healthcare mobile app navigation commonly benefits from bottom tabs for Home, Records, and Support-style destinations: https://www.healthcareuiux.com/articles/healthcare-mobile-app-ui
- Patient portal dashboards should summarize key information and recent results: https://visimpact.com/patient-portal-ux-best-practices-that-raise-adherence/
- Personal health record apps commonly include insurance, emergency contacts, medications, physicians, and profile information: https://www.famlove.care/

## Current Findings From Local Audit

Pages audited:

- `/dashboard`
- `/records/7040daf2-5df7-48bd-add9-2828950c0a3f`

Observed issues:

- Dashboard navigation is too thin and does not feel like a real patient portal.
- There is no clear patient profile area for age/date of birth, blood type, insurance, emergency contact, allergies/conditions, or preferred clinic.
- Dashboard uses metrics, but patients need a "what should I do now?" story first.
- "Share for a second opinion" wording should be softened to "Share with a dental professional" or "Share with care team."
- Record detail page is visually dense and clinical.
- Record detail page puts too many controls in a narrow top bar.
- Record detail page mobile has horizontal overflow.
- Record detail sharing is hard to understand; the patient needs a dedicated share panel with status, recipient, expiry, copy link, revoke, and PDF export.
- DentoBot exists, but should be framed around safe record explanation and question preparation.
- The profile storage model is partially present: `patients` table has `date_of_birth`, `gender`, `blood_type`, and `medical_history`.
- Insurance and emergency contact are not explicit schema columns today.

## Database / Data Model Tasks

Current schema:

- `profiles`: `id`, `full_name`, `role`, `tier`, provider fields.
- `patients`: `id`, `date_of_birth`, `gender`, `blood_type`, `medical_history`.

Recommended MVP storage:

- Use `patients.medical_history` JSON for flexible beta fields:
  - `insurance`: provider, member ID, group ID, plan type, phone.
  - `emergency_contact`: name, relationship, phone.
  - `allergies`: array of strings.
  - `conditions`: array of strings.
  - `medications`: array of strings.
  - `preferred_dentist`: clinic name, dentist name, phone.

Future hardened schema:

- Add dedicated `patient_profiles` or expand `patients` with explicit columns/tables after data requirements stabilize.
- Add audit events for profile updates because this is PHI.

## Patient Portal Information Architecture

Recommended logged-in navigation:

1. Home
   - Overview, latest visit, next best action, timeline preview.
2. Records
   - Full dental timeline and filters.
3. DentoBot
   - Record-aware questions and safe explanations.
4. Share
   - Active shares, export PDFs, revoke links.
5. Profile
   - Personal info, insurance, emergency contact, dental preferences.

Mobile:

- Use a bottom navigation bar with Home, Records, DentoBot, Share, Profile.
- Keep top bar simple: logo/avatar and sign out hidden in profile/menu.

Desktop:

- Use a left sidebar or clean top navigation with clear active state.
- Avoid scattered buttons and metric-heavy layout as the first impression.

## Dashboard Redesign Tasks

Primary file:

- `app/dashboard/page.tsx`
- `app/dashboard/dashboard.module.css`

Tasks:

- [x] Replace current sparse nav with a real patient portal shell.
- [x] Add navigation items: Home, Records, DentoBot, Share, Profile.
- [x] Add mobile bottom nav.
- [x] Add profile entry point in nav and dashboard.
- [x] Replace "Good to see you" hero with patient-first record summary:
  - "Your latest dental update"
  - Latest visit date and clinic.
  - Plain-language summary from `ai_findings.patient_summary`.
  - CTA: "Review latest record."
- [x] Add "What to do next" panel:
  - Review latest findings.
  - Ask DentoBot what to ask the dentist.
  - Share record with care team.
  - Complete profile.
- [x] Replace broad metric cards with patient-useful status cards:
  - Records in timeline.
  - Findings to discuss.
  - Active shares.
  - Profile completeness.
- [x] Add "Dental timeline" preview with clearer cards.
- [x] Add "DentoBot" card with safe prompt examples:
  - "What should I ask about this finding?"
  - "Explain tooth #38 in plain English."
  - "What does this dental code mean?"
- [x] Rename "Share for a second opinion" to "Share with a dental professional" or "Share with care team."
- [x] Add empty-state flow that feels premium and useful.
- [x] Reduce desktop sidebar width and add a collapse control.
- [x] Add a dedicated records index that shows timeline records with upload/request actions.
- [x] Point DentoBot and Share navigation to the latest record anchors instead of blank pages.
- [x] Add a dashboard loading state to avoid the home hero changing from a temporary name to latest-record content.
- [ ] Ensure dashboard renders well at 390px width.

## Profile Feature Tasks

New route recommended:

- `app/profile/page.tsx`
- `app/profile/profile.module.css`

Tasks:

- [x] Add profile page.
- [x] Fetch from `profiles` and `patients`.
- [x] Edit personal information:
  - Full name.
  - Date of birth.
  - Age display derived from date of birth, not manually stored.
  - Gender optional.
  - Blood type optional.
- [x] Edit insurance:
  - Insurance provider.
  - Member ID.
  - Group ID.
  - Plan type.
  - Insurance phone.
- [x] Edit emergency contact:
  - Name.
  - Relationship.
  - Phone.
- [x] Edit dental/medical notes:
  - Allergies.
  - Conditions.
  - Medications.
  - Preferred dentist/clinic.
- [x] Store flexible beta details in `patients.medical_history`.
- [x] Save profile updates with loading, success, and error states.
- [x] Insert audit log event: `update_patient_profile`.
- [x] Add profile completeness indicator on dashboard.

## Record Detail Redesign Tasks

Primary files:

- `app/records/[id]/page.tsx`
- `app/records/[id]/record.module.css`
- `components/ShareButton.tsx`
- `components/EHIExportButton.tsx`

Tasks:

- [x] Replace current top action bar with a patient-friendly record header:
  - Back to dashboard.
  - Visit date.
  - Clinic/dentist.
  - Record status.
  - Compact actions: Share, Export, Source files.
- [x] Add plain-language visit summary at top:
  - `ai_findings.patient_summary`.
  - Recommended follow-up if present.
  - "Questions to ask your dentist."
- [x] Redesign visual area:
  - Keep one 3D-style visual preview.
  - Give the model a stable responsive height.
  - Avoid horizontal overflow on mobile.
- [x] Rework findings into patient-first sections:
  - "Needs a conversation soon."
  - "Monitor."
  - "Routine / background."
- [x] Avoid clinical-sounding phrases like "Urgent Care Needed" unless the record truly indicates emergency action.
- [x] Keep one plain-language explanation mode for v1 instead of adding a "Doctor speak / My speak" toggle.
- [x] Move DentoBot into a clear side panel or expandable mobile drawer:
  - "Ask DentoBot about this visit."
  - Remind: educational, not diagnosis.
- [x] Create a dedicated sharing card:
  - Link status: private/shared.
  - Expiry.
  - Recipient label/email optional.
  - Copy link.
  - Revoke link.
  - Download PDF.
  - View source files.
- [x] Rename `Provider Share` button to `Share record`.
- [x] Rename `Close Report` to `Back to dashboard`.
- [x] Fix mobile horizontal overflow on record page.
- [ ] Verify `ShareButton` popover does not overflow mobile viewport.
- [x] Remove record-page sidebar/navigation so the visit detail behaves like a focused report.
- [x] Make the record view visual-first so opening a timeline record starts with the 3D preview, not DentoBot.
- [x] Remove tooth-map toggle from the record detail page for now.
- [x] Keep DentoBot collapsed as a support action instead of loading/opening chat by default.
- [x] Add share-link fallback for beta databases that still use `records.share_token` before `record_shares` is applied.
- [x] Replace the confusing "What to ask" paragraph with clear question prompts for the dentist.
- [x] Make "Why it matters" expandable inside findings to reduce visual clutter.
- [x] Simplify the 3D hover message so it does not cover the patient with dense clinical text.

## Share / Export UX Tasks

- [x] Make share state visible before the user clicks.
- [ ] Use plain labels:
  - "Private"
  - "Shared until [date]"
  - "Read-only link"
  - "Revoke access"
- [x] Avoid "second opinion" as default language.
- [x] Add explanation that sharing creates a read-only link for a trusted dental professional.
- [x] Keep PDF export as a secondary action, not mixed into the main clinical header.
- [x] Add audit copy: "Sharing activity is logged for your safety."

## Visual Design Direction

Patient portal should feel:

- Calm.
- Personal.
- Clear.
- Mobile-first.
- Less clinical than provider workflows.
- More like a personal health wallet than an analytics dashboard.

Avoid:

- Too many metric cards.
- Dense top bars.
- Tiny buttons.
- Clinical labels without explanation.
- Sticky sidebars on mobile.
- Horizontal scroll.

## Suggested Implementation Order

1. Patient portal shell/navigation.
2. Dashboard redesign.
3. Profile page and data save.
4. Record detail layout cleanup.
5. Share panel and button copy.
6. Mobile QA.
7. Optional polish: DentoBot drawer, profile completeness meter, timeline filters.

## Test Plan

- [x] `npx tsc --noEmit`
- [x] Targeted ESLint for edited files.
- [ ] Browser desktop smoke test:
  - `/dashboard`
  - `/profile`
  - `/records/7040daf2-5df7-48bd-add9-2828950c0a3f` [x]
- [ ] Browser mobile smoke test at 390x844:
  - No horizontal overflow.
  - Navigation usable by thumb.
  - Record sharing panel fits viewport.
  - Profile form fields stack cleanly.
- [ ] Verify profile saves to Supabase.
- [ ] Verify record share link still works.
- [ ] Verify PDF export still opens printable report.
