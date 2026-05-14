'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Box, FileCheck, Bot, Network, FileText, ShieldCheck, XCircle, CheckCircle2 } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import ComingSoonModal from '@/components/ComingSoonModal';
import styles from './page.module.css';

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className={styles.main}>
      {/* Global Beta Banner */}
      <div style={{ background: 'var(--accent)', color: '#fff', padding: '12px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.02em' }}>
        🚀 Founding Patient Program: Join our early access beta for a complimentary Pro upgrade. <Link href="#pricing" style={{ color: '#fff', textDecoration: 'underline' }}>Learn more</Link>
      </div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">
          Dento<span>Graph</span>
        </div>
        <div className="navbar-links" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {/* Provider Portal - Subdued but accessible */}
          <Link
            href="/providers"
            style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
          >
            For Providers
          </Link>

          <div style={{ width: '1px', height: '24px', background: 'var(--border)' }} />

          {/* Patient Portal - Primary Focus */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Link href="/login" className="btn btn-secondary btn-sm">Log in</Link>
            <Link href="/signup" className="btn btn-primary btn-sm">Get started free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBadge}>
          <span className="glow-dot" />
          <span>Take control of your clinical data</span>
        </div>
        <h1>
          Your 3D Digital Twin.<br />
          <span className="gradient-text">Your Dental Health.</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Stop guessing what your dentist is seeing. DentoGraph maps your X-rays and prescriptions to an interactive 3D model, translating complex pathology into plain English.
        </p>
        <div className={styles.heroCta}>
          <Link href="/signup" className="btn btn-primary btn-lg">Join Founding Patient Beta</Link>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-secondary btn-lg">Request Demo</button>
        </div>
        <div style={{ marginTop: '24px', display: 'flex', gap: '24px', justifyContent: 'center', opacity: 0.6 }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 600 }}><ShieldCheck size={16} /> HIPAA Compliant</div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 600 }}><FileText size={16} /> USCDI v3 Ready</div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 600 }}><Bot size={16} /> AI-Powered Analysis</div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className={styles.features}>
        <div className="container">
          <div className={styles.sectionLabel}>The Platform</div>
          <h2 className={styles.sectionTitle}>Interactive Clinical Transparency</h2>
          <div className={styles.featureGrid}>
            <div className={`card ${styles.featureCard}`}>
              <Box className={styles.featureIcon} />
              <h3>3D Digital Twin</h3>
              <p>Map your dental findings to a fully interactive 3D jaw model. Rotate, zoom, and see your health from every angle.</p>
            </div>
            <div className={`card ${styles.featureCard}`}>
              <FileCheck className={styles.featureIcon} />
              <h3>Plain English Insights</h3>
              <p>Our AI translates complex diagnostic codes into simple, narrative-driven insights. Understand the "why" behind every procedure.</p>
            </div>
            <div className={`card ${styles.featureCard}`}>
              <ShieldCheck className={styles.featureIcon} />
              <h3>EHI Portability</h3>
              <p>Download your complete Electronic Health Information (EHI) in USCDI v3 compliant formats with a single click.</p>
            </div>
            <div className={`card ${styles.featureCard}`}>
              <Bot className={styles.featureIcon} />
              <h3>Storyteller AI</h3>
              <p>Chat with your records. Ask questions about your treatment plan, costs, or procedure details in real-time.</p>
            </div>
            <div className={`card ${styles.featureCard}`}>
              <Network className={styles.featureIcon} />
              <h3>Secure Second Opinion</h3>
              <p>Share a cryptographically secure, time-limited link to your records with any specialist for a verified second opinion.</p>
            </div>
            <div className={`card ${styles.featureCard}`}>
              <CheckCircle2 className={styles.featureIcon} />
              <h3>Insurance Advocacy</h3>
              <p>Generate CDT-aligned diagnostic narratives to help justify treatment to your insurance provider and minimize denials.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className={styles.pricing}>
        <div className="container">
          <div className={styles.sectionLabel}>Join The Beta</div>
          <h2 className={styles.sectionTitle}>Founding Patient Membership</h2>
          <div className={styles.pricingGrid}>
             <div className="card">
                <h3>Early Access</h3>
                <div className={styles.price}>$0<span>/year</span></div>
                <p>Limited to the first 5,000 users. Help us shape the future of dental transparency.</p>
                <Link href="/signup" className="btn btn-primary" style={{ width: '100%', marginTop: '24px' }}>Secure My Spot</Link>
             </div>
             <div className="card" style={{ background: '#0f172a', color: '#fff' }}>
                <h3>Founding Partner</h3>
                <div className={styles.price}>$99<span>/lifetime</span></div>
                <p>Support the mission. Get lifetime Pro features and "Founding Partner" badge on all records.</p>
                <Link href="/signup" className="btn btn-secondary" style={{ width: '100%', marginTop: '24px' }}>Become a Partner</Link>
             </div>
          </div>
        </div>
      </section>

      {/* Support / Contact */}
      <section className={styles.contact}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <div className={styles.sectionLabel}>Support</div>
          <h2 className={styles.sectionTitle}>Transforming the Dental Experience</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '40px' }}>
            Whether you are a patient navigating your clinical data or a provider seeking to modernize your practice, our team is here to support you.
          </p>
          <ContactForm />
        </div>
      </section>

      <footer className={styles.footer}>
        <div className="container">
           <div className={styles.footerGrid}>
              <div>
                <div className="navbar-logo">Dento<span>Graph</span></div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '16px' }}>The modern platform for interactive 3D dental records and clinical transparency.</p>
              </div>
              <div>
                <h4>Platform</h4>
                <Link href="#features">Features</Link>
                <Link href="#pricing">Founding Patients</Link>
                <Link href="/providers">For Providers</Link>
              </div>
              <div>
                <h4>Support</h4>
                <Link href="mailto:rameshkumarkorlakunta@gmail.com">Contact Us</Link>
                <Link href="/privacy">Privacy Policy</Link>
              </div>
           </div>
           <div style={{ marginTop: '64px', paddingTop: '32px', borderTop: '1px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
             © 2025 DentoGraph. HIPAA Compliant. SOC2 Type II (Pending). All rights reserved.
           </div>
        </div>
      </footer>

      <ComingSoonModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
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
