# DentoGraph: Strategic Context & Vision

## 1. Executive Summary
DentoGraph is a next-generation dental health infrastructure layer designed to bridge the communication gap between providers and patients. It evolves from a visualization tool into a comprehensive platform for Electronic Health Information (EHI) ownership and clinical "Case Acceptance."

**The Core Problem:**
- Patients are confused by 2D X-rays and medical jargon.
- Dentists struggle with low "Case Acceptance" rates and administrative burdens (insurance denials).
- Regulatory mandates (21st Century Cures Act) require clinics to provide easy, electronic access to records, which legacy EHRs fail to do.

---

## 2. Market Strategy: The Dual-Growth Loop

### Phase 1: B2C (The Direct-to-Consumer "Hook")
*The goal is to solve the patient's immediate pain: confusion and lack of data ownership.*

- **The Semantic Decoder:** Uses Multimodal VLM to translate clinical shorthand (e.g., "#3 MOD Caries") and CDT Codes into "Plain English" health advocacy.
- **The 3D "Digital Twin":** Converts flat 2D X-rays and prescriptions into a rotating, interactive 3D map.
- **Data Ownership:** Patients pay for clarity and the ability to own their clinical data, rather than it being "locked" in a clinic's server.
- **Second Opinion Marketplace:** Enable patients to share their 3D map with a network of vetted dentists for virtual consultations.

### Phase 2: B2B2C (The "Trojan Horse" Growth Loop)
*The goal is to use the patient to pull the dentist into the platform.*

- **Compliance as a Moat:** Positions DentoGraph as the "EHI Portability Layer" for 21st Century Cures Act compliance.
- **Visual Reinforcement (Case Acceptance):** Dentists use DentoGraph to *show* patients why they need treatment, drastically increasing high-ticket procedure approvals.
- **Insurance Narrative Generator:** AI-driven generation of clinical justifications for insurance claims. This is the primary B2B "revenue" hook for clinic owners.
- **Frictionless Record Sharing:** Replaces bulky CDs and emails with secure, one-click sharing links.

---

## 3. Product Features & Requirements

### Patient Experience (B2C)
- **3D Jaw Map:** Interactive 2.5D/3D visualization of the mouth.
- **Health Score & Severity:** Numerical health grade (A-D) and 1-10 severity scores for each tooth.
- **Dual-Mode Reports:** "Doctor Speak" (Clinical) vs. "Patient Speak" (Plain English) toggle.
- **Ask-AI Chat:** Context-aware chat with the patient's own dental records.
- **EHI Export:** One-click download of records in PDF and JSON formats.

### Provider Experience (B2B)
- **Dentist Dashboard:** Real-time view of patient EHI requests and shared 3D cases.
- **"Request My Records" Tool:** Legally-backed request generator for patients to pull data from previous dentists.
- **Compliance Tracker:** Big-button indicator for Cures Act compliance status.
- **Clinical Narrative Generator:** Automated generation of justification letters for CDT procedure codes to fight insurance denials.

---

## 4. Technical Architecture
- **Framework:** Next.js (App Router, Turbopack).
- **Backend/Auth:** Supabase (PostgreSQL, Storage, Auth, RLS).
- **AI Core:** Google Gemini 1.5 Pro (Multimodal analysis of X-rays + Prescriptions).
- **3D Engine:** React Three Fiber (R3F) with anatomically accurate tooth geometries.
- **Compliance Standards:** Designed for HIPAA, SOC2 readiness, and USCDI v5 interoperability.

---

## 5. Monetization Strategy
- **B2C:** $5/month (or $9/month) Pro tier for lifetime record tracking, unlimited AI chat, and 2nd opinion links.
- **B2B:** Subscription-based "Case Acceptance" and "Compliance" portal for dental clinics ($200–$500/month).

---

## 6. Long-Term Vision (2026+)
DentoGraph aims to be the **infrastructure layer** for dental data.
- **EHR Integrations:** Direct API sync with Dentrix, Open Dental, and Eaglesoft.
- **DICOM Support:** Native rendering of high-resolution CBCT scans.
- **Global Portability:** The "Gold Standard" for how dental records are shared between generalists and specialists.
