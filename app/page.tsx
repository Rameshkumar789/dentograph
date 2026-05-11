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
          <span>The Future of Patient Empowerment</span>
        </div>
        <h1>
          Meet your clinical<br />
          <span className="gradient-text">3D Dental Twin</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Stop guessing what your dentist is saying. Upload your X-rays and instantly generate a photorealistic, interactive 3D model of your mouth with AI-powered, plain-English diagnostics. 
        </p>
        <div className={styles.heroCta}>
          <Link href="/signup" className="btn btn-primary btn-lg">Generate Your 3D Model — $0</Link>
          <Link href="/login" className="btn btn-secondary btn-lg">Sign In</Link>
        </div>
        <p className={styles.heroNote}>$5/month for lifetime tracking & unlimited 2nd opinion links</p>
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
              <div className={styles.planPrice}>$5 <span>/month</span></div>
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
        <p>© 2026 DentoGraph · Built for patients, by patients</p>
      </footer>
    </main>
  );
}

const FEATURES = [
  { icon: '🦷', title: 'Interactive 3D Jaw Visualizer', desc: 'Experience a state-of-the-art interactive 3D rendering of your jaw. Instantly see clinical findings mapped to exact tooth coordinates, making complex diagnoses beautifully simple to understand.' },
  { icon: '📄', title: 'Clinical Intelligence Translation', desc: 'We translate dense medical jargon into a crystal-clear, empathetic report card. Instantly know your health score, urgent risks, and exactly what your treatment entails.' },
  { icon: '🔗', title: 'Instant 2nd Opinion Sharing', desc: 'Generate secure, HIPAA-compliant links to your interactive 3D records. Send them to any specialist globally for a second opinion with zero friction.' },
  { icon: '💬', title: 'Context-Aware AI Chat', desc: 'Have a question about a specific tooth? Chat directly with your medical record. Ask about costs, pain management, or procedures and get instant, honest guidance.' },
  { icon: '🗂️', title: 'Multi-Modal Data Fusion', desc: 'Upload X-rays, 3D scans, and written prescriptions simultaneously. Our Gemini AI cross-references all your documents to build a flawless, unified health profile.' },
  { icon: '📱', title: 'Frictionless Clinic Portal', desc: 'Never carry physical films again. Show your dentist your personalized QR code, and they can drop high-res imagery directly into your private 3D timeline.' },
];
