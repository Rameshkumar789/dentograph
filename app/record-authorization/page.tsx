import Link from 'next/link';

export default function RecordAuthorizationPage() {
  return (
    <main className="legal-shell">
      <Link href="/" className="legal-brand"><img src="/dentograph-logo.png" alt="DentoGraph" style={{ width: "188px", height: "auto" }} /></Link>
      <section className="legal-card">
        <p className="legal-kicker">Record Authorization</p>
        <h1>Patient authorization for dental record retrieval and sharing</h1>
        <p>
          DentoGraph record requests should include explicit patient authorization, requested record categories,
          target clinic details, delivery method, and a timestamped consent record.
        </p>
        <h2>Common requested records</h2>
        <p>X-rays, intraoral images, scans, treatment plans, clinical notes, prescriptions, procedure codes, and referral documents.</p>
        <h2>Patient control</h2>
        <p>Patients may choose to store records in DentoGraph, download them, share them with another provider, or revoke a share link.</p>
        <h2>Provider upload links</h2>
        <p>Upload links should be connected to a patient request and should not be reused outside the authorized record fulfillment workflow.</p>
      </section>
    </main>
  );
}
