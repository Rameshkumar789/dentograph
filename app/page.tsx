import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Bot,
  LockKeyhole,
  MessageCircle,
  Share2,
  UploadCloud,
} from 'lucide-react';
import styles from './page.module.css';

const CONTACT_EMAIL = 'support@dentograph.us';

export default function LandingPage() {
  return (
    <main className={styles.main}>
      <nav className={styles.nav} aria-label="Main navigation">
        <Link href="/" className={styles.logoWrap} aria-label="DentoGraph home">
          <Image src="/dentograph-logo-transparent.png" alt="DentoGraph" width={2508} height={627} className={styles.logo} priority />
        </Link>
        <div className={styles.navLinks}>
          <Link href="/providers">For practices</Link>
          <a href={`mailto:${CONTACT_EMAIL}`}>Contact us</a>
          <Link href="/login">Log in</Link>
          <Link href="/signup" className={styles.navCta}>Try beta</Link>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Patient-owned dental records</p>
          <h1>Your dental records, explained clearly.</h1>
          <p className={styles.lede}>
            DentoGraph turns X-rays, notes, and treatment plans into a visual record you can understand,
            keep, and share with a trusted dental professional when you need care, referrals, or a records transfer.
          </p>
        </div>

        <div className={styles.productScene} aria-label="DentoGraph patient app preview">
          <Image
            src="/dentograph-patient-hero.png"
            alt="DentoGraph patient app preview"
            width={1568}
            height={1003}
            className={styles.heroImage}
            priority
          />
          <div className={styles.heroImageBadge}>Patient-controlled record</div>
          <div className={styles.heroImagePill}>Visual timeline</div>
        </div>

        <div className={styles.heroActions}>
          <div className={styles.ctaRow}>
            <Link href="/signup" className={styles.primaryCta}>
              Create free beta account <ArrowRight size={18} />
            </Link>
            <Link href="/request-records" className={styles.secondaryCta}>
              Request my records
            </Link>
          </div>
          <p className={styles.disclaimer}>Educational summaries only. Your dentist makes clinical decisions.</p>
        </div>
      </section>

      <section className={styles.beforeAfter}>
        <div>
          <p className={styles.kicker}>Before</p>
          <h2>Dental records arrive as files patients cannot use.</h2>
          <p>PDFs, blurry images, procedure codes, and clinical shorthand create anxiety instead of clarity.</p>
        </div>
        <div className={styles.afterCard}>
          <p className={styles.kicker}>After DentoGraph</p>
          <h2>A visual story of what changed, why it matters, and what to ask next.</h2>
          <div className={styles.afterGrid}>
            <span>3D tooth map</span>
            <span>Plain-language findings</span>
            <span>Timeline history</span>
            <span>DentoBot explanations</span>
            <span>Secure share link</span>
          </div>
        </div>
      </section>

      <section className={styles.stepsSection}>
        <div className={styles.sectionHeader}>
          <p className={styles.kicker}>Simple workflow</p>
          <h2>How DentoGraph works for patients</h2>
          <p>Collect scattered files, understand the record, ask DentoBot, and share only when it helps your care.</p>
        </div>
        <div className={styles.steps}>
          {[
            { icon: UploadCloud, title: 'Collect your records', text: 'Upload files or request them from a previous clinic.' },
            { icon: MessageCircle, title: 'See what they mean', text: 'View findings on a visual tooth map and ask plain-language questions.' },
            { icon: Bot, title: 'Ask DentoBot', text: 'Translate dental terms, summarize visits, and prepare questions for your dentist.' },
            { icon: Share2, title: 'Share with care', text: 'Send a time-limited read-only record to a specialist, new dentist, or care team.' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className={styles.stepCard}>
                <Icon size={22} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.audienceSection}>
        <div className={styles.sectionHeader}>
          <p className={styles.kicker}>Shared clarity</p>
          <h2>Use the same record when care moves.</h2>
          <p>Bring a clean, understandable record when you visit your dentist, get referred to a specialist, or switch offices.</p>
        </div>
        <div className={styles.audience}>
          <div>
            <p className={styles.kicker}>For patients</p>
            <h3>Know what to ask before the appointment.</h3>
            <ul>
              <li>Understand why a crown, filling, or implant follow-up was recommended.</li>
              <li>Keep records from different offices in one timeline.</li>
              <li>Share a clean record instead of forwarding scattered PDFs.</li>
            </ul>
            <Link href="/signup" className={styles.textLink}>Create a patient account <ArrowRight size={16} /></Link>
          </div>
          <div>
            <p className={styles.kicker}>For dental teams</p>
            <h3>Receive a clearer record when a patient shares it with you.</h3>
            <ul>
              <li>Review the files, timeline, and visual summary in one place.</li>
              <li>Use the patient&apos;s shared record to speed up conversations.</li>
              <li>See the provider workflow for chairside and documentation tools.</li>
            </ul>
            <Link href="/providers" className={styles.textLink}>See provider workflow <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      <section className={styles.trustSection}>
        <div className={styles.sectionHeader}>
          <p className={styles.kicker}>Trust and privacy</p>
          <h2>Built to help you ask better questions, not replace your dentist.</h2>
          <p>Dental records are personal. DentoGraph keeps the patient in control and makes the limits of AI clear.</p>
        </div>
        <div className={styles.trustBand}>
          <div>
            <LockKeyhole size={22} />
            <h3>You decide who can see your records.</h3>
            <p>Create a read-only link when a dentist, specialist, or care team needs your files. Sharing is time-limited and can be turned off.</p>
          </div>
          <div>
            <Bot size={22} />
            <h3>DentoBot explains the record in everyday language.</h3>
            <p>DentoBot helps translate dental terms so you can prepare for a visit. It does not diagnose, prescribe, or make treatment decisions.</p>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <Image src="/dentograph-logo-transparent.png" alt="DentoGraph" width={2508} height={627} />
          <p>Patient-owned dental records, explained clearly.</p>
          <span>© 2026 DentoGraph. All rights reserved.</span>
        </div>
        <div className={styles.footerGroups}>
          <div>
            <h4>Product</h4>
            <Link href="/signup">Patient beta</Link>
            <Link href="/providers">Provider workflow</Link>
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
            <a href={`mailto:${CONTACT_EMAIL}`}>Contact us</a>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
