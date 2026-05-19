import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="legal-shell">
      <Link href="/" className="legal-brand"><img src="/dentograph-logo.png" alt="DentoGraph" style={{ width: "188px", height: "auto" }} /></Link>
      <section className="legal-card">
        <p className="legal-kicker">Terms of Service</p>
        <h1>Use DentoGraph as a record and explanation tool</h1>
        <p>
          DentoGraph is an early access dental record platform. It helps patients and providers organize records,
          explain dental information in plain language, and share records with consent.
        </p>
        <h2>Not medical advice</h2>
        <p>DentoGraph does not diagnose, prescribe, or replace a licensed dentist. Always confirm clinical decisions with a qualified dental professional.</p>
        <h2>Accounts and roles</h2>
        <p>Patients may manage their own records. Providers must be authorized to act for their clinic and must only access records they are permitted to view.</p>
        <h2>Uploads and sharing</h2>
        <p>You are responsible for uploading records you have the right to use and for sharing records only with intended recipients. Shared links can be revoked.</p>
        <h2>Beta access</h2>
        <p>During the MVP beta, features may change, fail, or be limited while we improve reliability, security, and compliance workflows.</p>
        <h2>Contact</h2>
        <p>Questions about these terms can be sent to support@dentograph.us.</p>
        <p className="legal-note">Last updated: May 19, 2026. These terms should be reviewed by counsel before launch.</p>
      </section>
    </main>
  );
}
