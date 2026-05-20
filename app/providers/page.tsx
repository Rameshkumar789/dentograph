import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ClipboardCheck,
  FileText,
  MonitorUp,
  PlugZap,
  ShieldCheck,
  UploadCloud,
} from 'lucide-react';
import styles from './providers.module.css';

const CONTACT_EMAIL = 'support@dentograph.us';

export default function ProvidersLandingPage() {
  const pillars = [
    {
      icon: MonitorUp,
      title: 'Chairside Storyteller',
      text: 'Show patients a visual tooth map, plain-language explanation, and chairside script while the finding is still fresh.',
    },
    {
      icon: FileText,
      title: 'Insurance Narrative Builder',
      text: 'Turn selected findings into review-ready clinical narratives with evidence-based language and matching procedure context.',
    },
    {
      icon: ShieldCheck,
      title: 'Record Release Desk',
      text: 'Handle record requests, secure exports, consent checkpoints, share links, and audit logs from one operational workspace.',
    },
  ];

  const workflow = [
    'Upload or receive records',
    'Highlight clinical findings',
    'Explain chairside',
    'Draft insurance narrative',
    'Share or export with consent',
    'Log the audit event',
  ];

  return (
    <main className={styles.page}>
      <nav className={styles.nav} aria-label="Provider navigation">
        <Link href="/" className={styles.logoWrap} aria-label="DentoGraph home">
          <Image src="/dentograph-logo-transparent.png" alt="DentoGraph" width={2508} height={627} className={styles.logo} priority />
        </Link>
        <div className={styles.navLinks}>
          <Link href="/">For patients</Link>
          <a href={`mailto:${CONTACT_EMAIL}`}>Request demo</a>
          <Link href="/dentist/login">Provider login</Link>
          <Link href="/dentist/signup" className={styles.navCta}>Join beta</Link>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>For dental practices</p>
          <h1>Explain findings. Draft documentation. Release records with confidence.</h1>
          <p className={styles.lede}>
            DentoGraph gives dental teams a visual chairside layer for patient conversations, insurance narratives,
            and consent-aware record sharing without replacing the systems they already use.
          </p>
          <div className={styles.ctaRow}>
            <Link href="/dentist/signup" className={styles.primaryCta}>Join provider beta <ArrowRight size={18} /></Link>
            <a href={`mailto:${CONTACT_EMAIL}`} className={styles.secondaryCta}>Request demo</a>
            <Link href="#workflow" className={styles.textCta}>View workflow</Link>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <Image
            src="/dentograph-provider-hero.png"
            alt="DentoGraph provider portal showing a clinical pipeline, chairside dental model, insurance note, consent, and audit-ready status"
            width={1693}
            height={929}
            className={styles.heroImage}
            priority
          />
        </div>
      </section>

      <section className={styles.pillars} aria-label="Provider product pillars">
        <div className={styles.sectionHeader}>
          <p className={styles.kicker}>Three practice workflows</p>
          <h2>One record can support the conversation, the claim, and the release.</h2>
        </div>
        <div className={styles.pillarGrid}>
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <article key={pillar.title} className={styles.pillar}>
                <Icon size={24} />
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.workflow} id="workflow">
        <div>
          <p className={styles.kicker}>Clinical workflow</p>
          <h2>From uploaded evidence to an audit trail.</h2>
          <p>
            DentoGraph is designed to sit around the visit, not replace your practice-management system. Teams can
            explain, document, share, and review activity from the same record workspace.
          </p>
        </div>
        <div className={styles.workflowSteps}>
          {workflow.map((step, index) => (
            <div key={step}>
              <strong>{String(index + 1).padStart(2, '0')}</strong>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.releaseDesk}>
        <div className={styles.releaseCopy}>
          <p className={styles.kicker}>Record Release Desk</p>
          <h2>A clearer way for the front desk to handle records leaving the clinic.</h2>
          <p>
            In plain English: when a patient, specialist, or new dentist asks for records, the team can confirm
            consent, package the right files, send a secure link or export, and keep a reviewable log.
          </p>
        </div>
        <div className={styles.releaseGrid}>
          {[
            { title: 'Request intake', text: 'Track patient, specialist, and transfer requests without scattered inbox follow-up.' },
            { title: 'Consent checkpoint', text: 'Tie every release or share link to authorization before files leave the workspace.' },
            { title: 'Secure export', text: 'Prepare visit summaries, source files, and PDFs for the right receiving party.' },
            { title: 'Audit trail', text: 'Log views, exports, share creation, and access events for internal review.' },
          ].map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.practiceDay}>
        <div className={styles.sectionHeader}>
          <p className={styles.kicker}>How the clinic uses it</p>
          <h2>Built around the moments that slow the visit down.</h2>
        </div>
        <div className={styles.practiceGrid}>
          <article>
            <MonitorUp size={24} />
            <p className={styles.roleLabel}>Dentist or hygienist</p>
            <h3>Chairside consult</h3>
            <p>Open the patient&apos;s visual record, point to the finding, and use a simple script to explain why treatment matters.</p>
          </article>
          <article>
            <FileText size={24} />
            <p className={styles.roleLabel}>Billing or treatment coordinator</p>
            <h3>Documentation after the exam</h3>
            <p>Review the selected finding and turn it into a draft narrative that supports the recommended procedure.</p>
          </article>
          <article>
            <ClipboardCheck size={24} />
            <p className={styles.roleLabel}>Front desk</p>
            <h3>Records requested later</h3>
            <p>Confirm authorization, export the right files, send a secure link, and keep a record of what was shared.</p>
          </article>
        </div>
      </section>

      <section className={styles.fitSection}>
        <div>
          <p className={styles.kicker}>Where it fits today</p>
          <h2>A focused layer around your existing dental stack.</h2>
          <p>
            DentoGraph is not trying to replace your practice-management system. It gives the team a better way to
            explain findings, prepare supporting documentation, and release records with consent.
          </p>
        </div>
        <div className={styles.fitCards}>
          <article>
            <UploadCloud size={22} />
            <h3>Available in v1</h3>
            <p>Upload records, review AI-generated drafts, explain findings visually, and create share-ready outputs.</p>
          </article>
          <article>
            <PlugZap size={22} />
            <h3>Integration roadmap</h3>
            <p>Direct exports from practice-management and imaging tools are planned future work, not live functionality.</p>
          </article>
          <article>
            <ShieldCheck size={22} />
            <h3>Privacy and review controls</h3>
            <p>Use consent checkpoints, role-based access, audit logs, and clinical review before information is shared.</p>
          </article>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <Image src="/dentograph-logo-transparent.png" alt="DentoGraph" width={2508} height={627} />
          <p>Provider workflows for clearer dental conversations, documentation, and record release.</p>
        </div>
        <div className={styles.footerGroups}>
          <div>
            <h4>Product</h4>
            <Link href="/">Patient portal</Link>
            <Link href="/dentist/signup">Provider beta</Link>
            <Link href="/pricing">Pricing</Link>
          </div>
          <div>
            <h4>Trust</h4>
            <Link href="/privacy">Privacy</Link>
            <Link href="/security">Security</Link>
            <Link href="/consent">Consent</Link>
            <Link href="/ai-disclaimer">AI disclaimer</Link>
          </div>
          <div>
            <h4>Company</h4>
            <a href={`mailto:${CONTACT_EMAIL}`}>Request demo</a>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
