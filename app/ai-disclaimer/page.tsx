import Link from 'next/link';

export default function AiDisclaimerPage() {
  return (
    <main className="legal-shell">
      <Link href="/" className="legal-brand"><img src="/dentograph-logo.png" alt="DentoGraph" style={{ width: "188px", height: "auto" }} /></Link>
      <section className="legal-card">
        <p className="legal-kicker">AI Disclaimer</p>
        <h1>DentoGraph AI explains records. It does not practice dentistry.</h1>
        <p>
          DentoBot and DentoGraph analysis are educational tools that summarize uploaded records and help patients
          ask better questions. They are not a diagnosis, prescription, treatment plan, or emergency service.
        </p>
        <h2>Clinical decisions</h2>
        <p>A licensed dentist or qualified clinician must verify findings and decide treatment. AI output can be incomplete or incorrect.</p>
        <h2>Urgent symptoms</h2>
        <p>If you have severe pain, swelling, fever, trauma, trouble breathing, or symptoms that feel urgent, contact a dentist, urgent care, or emergency services.</p>
        <h2>Data use</h2>
        <p>AI processing should occur only after consent and only with vendors and configurations approved for the intended health data use.</p>
      </section>
    </main>
  );
}
