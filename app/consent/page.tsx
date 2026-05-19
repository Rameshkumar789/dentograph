import Link from 'next/link';

export default function ConsentPage() {
  return (
    <main className="legal-shell">
      <Link href="/" className="legal-brand"><img src="/dentograph-logo.png" alt="DentoGraph" style={{ width: "188px", height: "auto" }} /></Link>
      <section className="legal-card">
        <p className="legal-kicker">Consent Framework</p>
        <h1>Consent should be specific, visible, and revocable</h1>
        <p>DentoGraph uses consent checkpoints for record upload, AI processing, record requests, provider uploads, and sharing.</p>
        <h2>AI processing consent</h2>
        <p>Patients should know when uploaded records may be processed by AI to produce summaries, tooth findings, cost ranges, and plain-language explanations.</p>
        <h2>Record sharing consent</h2>
        <p>Patients should choose when to create a share link, who it is intended for, and when it expires. Revoking a link should stop future access.</p>
        <h2>Provider upload consent</h2>
        <p>Provider upload links should be connected to a patient request or authorization and logged for audit review.</p>
        <h2>Record request authorization</h2>
        <p>Requests sent to clinics should include patient identity, requested files, delivery method, authorization text, and timestamp.</p>
        <p className="legal-note">This page describes product behavior. Final consent language requires legal review.</p>
      </section>
    </main>
  );
}
