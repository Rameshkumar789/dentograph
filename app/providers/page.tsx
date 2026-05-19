import Link from 'next/link';
import { ArrowRight, ClipboardCheck, FileText, MonitorUp, ShieldCheck } from 'lucide-react';
import styles from './providers.module.css';

export default function ProvidersLandingPage() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logoWrap}>
          <img src="/dentograph-logo.png" alt="DentoGraph" className={styles.logo} />
        </Link>
        <div className={styles.navLinks}>
          <Link href="/">For patients</Link>
          <Link href="/dentist/login">Provider login</Link>
          <Link href="/dentist/signup" className={styles.navCta}>Join beta</Link>
        </div>
      </nav>

      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>For dental practices</p>
          <h1>Show patients the problem. Document the need. Share the record safely.</h1>
          <p className={styles.lede}>
            DentoGraph gives clinics a patient-explanation and record-sharing layer on top of existing practice software.
          </p>
          <div className={styles.ctaRow}>
            <Link href="/dentist/signup" className={styles.primaryCta}>Join founding practice beta <ArrowRight size={18} /></Link>
            <Link href="#workflow" className={styles.secondaryCta}>View workflow</Link>
          </div>
        </div>
        <div className={styles.providerConsole}>
          <div className={styles.consoleHeader}>
            <span>Clinical pipeline</span>
            <strong>Audit-ready</strong>
          </div>
          <div className={styles.consoleGrid}>
            <div className={styles.previewJaw}>
              <img src="/jaw-render.png" alt="Chairside dental model preview" />
            </div>
            <div className={styles.consolePanel}>
              <span>Chairside script</span>
              <p>This early decay is easier to treat now. Waiting can make the treatment more complex and expensive.</p>
            </div>
            <div className={styles.consolePanel}>
              <span>Insurance note</span>
              <p>Radiographic findings support restorative treatment due to structural compromise.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.pillars}>
        {[
          { icon: MonitorUp, title: 'Chairside Storyteller', text: 'Turn findings into a visual explanation patients can understand while they are still in the chair.' },
          { icon: FileText, title: 'Insurance Narrative Builder', text: 'Draft clearer CDT-aligned narratives and treatment summaries from the same clinical workflow.' },
          { icon: ShieldCheck, title: 'Compliance Vault', text: 'Fulfill patient record requests with consent, time-stamped activity, and a reviewable audit trail.' },
        ].map((pillar) => {
          const Icon = pillar.icon;
          return (
            <article key={pillar.title} className={styles.pillar}>
              <Icon size={24} />
              <h2>{pillar.title}</h2>
              <p>{pillar.text}</p>
            </article>
          );
        })}
      </section>

      <section className={styles.workflow} id="workflow">
        <div>
          <p className={styles.kicker}>Workflow</p>
          <h2>One clinical record, three jobs done.</h2>
          <p>Use DentoGraph after an X-ray, consultation, or record request. The same source files can power patient education, documentation, and sharing.</p>
        </div>
        <div className={styles.workflowSteps}>
          {['Upload record', 'Explain chairside', 'Generate narrative', 'Share with consent'].map((step, index) => (
            <div key={step}>
              <strong>{String(index + 1).padStart(2, '0')}</strong>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.operations}>
        <div>
          <ClipboardCheck size={24} />
          <h3>Designed as an add-on, not a replacement</h3>
          <p>Keep Dentrix, Open Dental, Eaglesoft, or your existing stack. DentoGraph focuses on the patient-facing explanation and portability layer.</p>
        </div>
        <div>
          <ShieldCheck size={24} />
          <h3>Built for consent-aware exchange</h3>
          <p>Record requests, share links, exports, and provider views should be tied to authorization and audit events.</p>
        </div>
      </section>

      <footer className={styles.footer}>
        <img src="/dentograph-logo.png" alt="DentoGraph" />
        <div>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/security">Security</Link>
        </div>
      </footer>
    </main>
  );
}
