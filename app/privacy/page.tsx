import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="legal-shell">
      <Link href="/" className="legal-brand"><img src="/dentograph-logo.png" alt="DentoGraph" style={{ width: "188px", height: "auto" }} /></Link>
      <section className="legal-card">
        <p className="legal-kicker">Privacy Policy</p>
        <h1>How DentoGraph handles dental health information</h1>
        <p>
          DentoGraph helps patients collect, understand, and share dental records. Dental records can include
          protected health information, so we design the product around clear consent, limited access, audit trails,
          and patient-controlled sharing.
        </p>
        <h2>Information we collect</h2>
        <p>Account details, uploaded dental records, X-rays, treatment notes, AI-generated summaries, sharing activity, support requests, and technical security logs.</p>
        <h2>How we use information</h2>
        <p>We use data to provide record storage, analysis, summaries, secure sharing, support, audit logging, and product safety. We do not sell patient dental records.</p>
        <h2>Sharing</h2>
        <p>Patients control external sharing through time-limited links or explicit record requests. Providers may access records only when authorized by account role, clinic relationship, or patient sharing.</p>
        <h2>Security</h2>
        <p>We use authenticated access, row-level permissions, signed storage URLs, and audit logging. Production HIPAA compliance also depends on signed business associate agreements, policies, risk analysis, and operational controls.</p>
        <h2>Your choices</h2>
        <p>You may request access, correction, export, revocation of shares, or deletion review through support@dentograph.us.</p>
        <p className="legal-note">Last updated: May 19, 2026. This policy should be reviewed by healthcare counsel before production PHI use.</p>
      </section>
    </main>
  );
}
