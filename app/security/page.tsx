import Link from 'next/link';

export default function SecurityPage() {
  return (
    <main className="legal-shell">
      <Link href="/" className="legal-brand"><img src="/dentograph-logo.png" alt="DentoGraph" style={{ width: "188px", height: "auto" }} /></Link>
      <section className="legal-card">
        <p className="legal-kicker">Security & Trust</p>
        <h1>Built around patient control, auditability, and limited access</h1>
        <p>DentoGraph is designed for dental workflows where records must be private, portable, and understandable.</p>
        <h2>Technical controls</h2>
        <p>Authenticated access, row-level database rules, signed file URLs, share expiration, revocation, and event logging.</p>
        <h2>Audit trail</h2>
        <p>Record views, uploads, AI processing, exports, provider access, and share activity should be logged for review.</p>
        <h2>Vendor requirements</h2>
        <p>Production PHI workflows require appropriate vendor agreements, including business associate agreements where HIPAA applies.</p>
        <h2>Responsible disclosure</h2>
        <p>Security issues can be reported to support@dentograph.us.</p>
      </section>
    </main>
  );
}
