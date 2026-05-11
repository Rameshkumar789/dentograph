import Link from 'next/link';
import styles from './page.module.css';

export default function LandingPage() {
  return (
    <main className={styles.main}>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">
          <span>🦷</span>
          Dento<span>Graph</span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/login" className="btn btn-secondary btn-sm">Log in</Link>
          <Link href="/signup" className="btn btn-primary btn-sm">Get started free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBadge}>
          <span className="glow-dot" />
          <span>Patient-Owned Dental Records</span>
        </div>
        <h1>
          Finally understand<br />
          <span className="gradient-text">your dental health</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Upload your X-rays and prescriptions. Our AI explains everything in plain English,
          maps findings to an interactive 3D model, and lets you share securely for a second opinion.
        </p>
        <div className={styles.heroCta}>
          <Link href="/signup" className="btn btn-primary btn-lg">Start for free — $0</Link>
          <Link href="/login" className="btn btn-secondary btn-lg">I have an account</Link>
        </div>
        <p className={styles.heroNote}>$2/month for unlimited records & sharing • Cancel anytime</p>
      </section>

      {/* Feature Cards */}
      <section className={styles.features}>
        <div className="container">
          <div className={styles.featureGrid}>
            {FEATURES.map((f) => (
              <div className={`card ${styles.featureCard}`} key={f.title}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className={styles.pricing}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '48px' }}>Simple, honest pricing</h2>
          <div className={styles.pricingGrid}>
            <div className="card">
              <div className={styles.planName}>Free</div>
              <div className={styles.planPrice}>$0</div>
              <ul className={styles.planFeatures}>
                <li>✅ 1 dental record</li>
                <li>✅ AI plain English analysis</li>
                <li>✅ Interactive 3D jaw view</li>
                <li>❌ Shareable second opinion links</li>
                <li>❌ Unlimited records</li>
                <li>❌ AI chat on records</li>
              </ul>
              <Link href="/signup" className="btn btn-secondary" style={{ width: '100%' }}>Get started</Link>
            </div>
            <div className={`card ${styles.planPro}`}>
              <div className={styles.planBadge}>Most popular</div>
              <div className={styles.planName}>Pro</div>
              <div className={styles.planPrice}>$2 <span>/month</span></div>
              <ul className={styles.planFeatures}>
                <li>✅ Unlimited dental records</li>
                <li>✅ AI plain English analysis</li>
                <li>✅ Interactive 3D jaw view</li>
                <li>✅ Second opinion share links</li>
                <li>✅ AI chat on every record</li>
                <li>✅ Dentist QR upload portal</li>
              </ul>
              <Link href="/signup" className="btn btn-primary" style={{ width: '100%' }}>Upgrade to Pro →</Link>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>© 2025 DentoGraph · Built for patients, by patients</p>
      </footer>
    </main>
  );
}

const FEATURES = [
  { icon: '🦷', title: '3D Jaw Visualizer', desc: 'See exactly which teeth have issues highlighted in color on an interactive 3D model you can rotate.' },
  { icon: '📄', title: 'Plain English Reports', desc: 'No medical jargon. Get a simple report card grading your dental health with clear next steps.' },
  { icon: '🔗', title: 'Second Opinion Links', desc: 'Share your full dental record with any doctor in one click. No login required for them.' },
  { icon: '💬', title: 'Ask Your Records', desc: 'Chat with your X-ray. Ask "is this serious?" or "how much does this cost?" and get honest answers.' },
  { icon: '📋', title: 'Prescription Mapping', desc: 'Upload your dentist\'s prescription. We map every recommendation to the 3D model and explain it.' },
  { icon: '📱', title: 'Dentist QR Portal', desc: 'Show your dentist a QR code. They upload your records directly — no signup needed from them.' },
];
