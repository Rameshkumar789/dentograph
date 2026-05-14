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
        🚀 Early Access Program: DentoGraph is currently free for our first 10 founding patients. <Link href="#pricing" style={{ color: '#fff', textDecoration: 'underline' }}>Learn more</Link>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/login" className="nav-link">Patient Log In</Link>
            <Link href="/signup" className="btn btn-primary btn-sm">Get Started</Link>
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
          Finally understand<br />
          <span className="gradient-text">your dentist.</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Stop leaving the dental office feeling confused. DentoGraph turns your complex X-rays into a clear 3D map of your mouth, with simple explanations you can actually understand.
        </p>
        <div className={styles.heroCta} style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link href="/signup" className="btn btn-primary btn-lg">See Your 3D Model for Free</Link>
          <Link href="/request-records" className="btn btn-secondary btn-lg" style={{ background: '#fff', color: '#000' }}>Get Your Records from Your Dentist</Link>
        </div>
        <p className={styles.heroNote}>Tired of clinical jargon? <Link href="/signup" style={{ textDecoration: 'underline', color: 'var(--text-secondary)' }}>Join our founding patients</Link></p>
      </section>

      {/* Feature Cards */}
      <section className={styles.features}>
        <div className="container">
          <div className={styles.featureGrid}>
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div className={`card ${styles.featureCard}`} key={f.title}>
                  <div className={styles.featureIcon} style={{ background: 'rgba(0, 112, 243, 0.1)', color: 'var(--primary)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                    <Icon size={24} strokeWidth={2} />
                  </div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Before vs After */}
      <section className={styles.beforeAfter}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '16px' }}>See the difference</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto 32px', lineHeight: 1.7 }}>
            Legacy dental portals hand you confusing files. DentoGraph transforms them into something you can actually understand.
          </p>
          <div className={styles.compareGrid}>
            <div className={styles.compareCard}>
              <div className={styles.compareLabel} style={{ background: 'var(--red-dim)', color: 'var(--red)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <XCircle size={18} /> Before DentoGraph
              </div>
              <div className={styles.compareContent}>
                <div className={styles.compareItem}><XCircle size={16} color="var(--red)" style={{ flexShrink: 0, marginTop: '2px' }} /> Sent home with a blurry 2D JPEG attachment</div>
                <div className={styles.compareItem}><XCircle size={16} color="var(--red)" style={{ flexShrink: 0, marginTop: '2px' }} /> Confused by clinical shorthand: "MOD Caries D2392"</div>
                <div className={styles.compareItem}><XCircle size={16} color="var(--red)" style={{ flexShrink: 0, marginTop: '2px' }} /> Anxious about surprise bills and hidden costs</div>
                <div className={styles.compareItem}><XCircle size={16} color="var(--red)" style={{ flexShrink: 0, marginTop: '2px' }} /> Records locked away on the clinic's server</div>
              </div>
            </div>
            <div className={styles.compareCard} style={{ borderColor: 'var(--accent)', boxShadow: 'var(--accent-glow)' }}>
              <div className={styles.compareLabel} style={{ background: 'var(--accent-dim)', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} /> After DentoGraph
              </div>
              <div className={styles.compareContent}>
                <div className={styles.compareItem}><CheckCircle2 size={16} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} /> Take home an interactive 3D digital twin</div>
                <div className={styles.compareItem}><CheckCircle2 size={16} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} /> Read clear English: "Tooth-colored filling needed"</div>
                <div className={styles.compareItem}><CheckCircle2 size={16} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} /> DentoBot AI securely estimates costs and urgency</div>
                <div className={styles.compareItem}><CheckCircle2 size={16} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} /> You own your records, perfectly portable</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Early Access */}
      <section className={styles.pricing} id="pricing">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span className="badge badge-accent" style={{ marginBottom: '16px', display: 'inline-block' }}>DentoGraph Early Access</span>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Take ownership of your dental health.</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              We are offering lifetime free access to our first 10 patient users. Join the beta to generate your 3D digital twin today.
            </p>
          </div>

          <div className={`card ${styles.planPro}`} style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div className={styles.planName} style={{ marginTop: '24px' }}>Founding Patient</div>
            <div className={styles.planPrice} style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '12px' }}>
              <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '1.5rem' }}>$15</span>
              <span>$0 <span>/month</span></span>
            </div>

            <ul className={styles.planFeatures} style={{ textAlign: 'left', margin: '32px auto', maxWidth: '280px', listStyle: 'none', padding: 0 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}><CheckCircle2 size={16} color="var(--primary)" /> <span>Personal 3D Dental Twin</span></li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}><CheckCircle2 size={16} color="var(--primary)" /> <span>Plain English AI Diagnoses</span></li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}><CheckCircle2 size={16} color="var(--primary)" /> <span>Unlimited DentoBot Chat</span></li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}><CheckCircle2 size={16} color="var(--primary)" /> <span>Secure Second Opinion Links</span></li>
            </ul>

            <Link href="/signup" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              Create Free Account →
            </Link>
          </div>
        </div>
      </section>

      <ComingSoonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        featureName="DentoGraph Pro Plan"
      />

      {/* Contact Section */}
      <section className={styles.contact} id="contact">
        <div className="container">
          <div className={`card ${styles.contactCard}`}>
            <div className={styles.contactInfo}>
              <h2>Let's disrupt dentistry, together.</h2>
              <p>Whether you're a patient looking to take control of your clinical data, or a provider looking to modernize case acceptance and compliance, we want to hear from you.</p>
              <div style={{ marginTop: '24px' }}>
                <a href="mailto:support@dentograph.us" className="btn btn-primary btn-lg" style={{ background: 'var(--text-primary)', color: '#fff' }}>Email Our Team</a>
              </div>
            </div>
            <div className={styles.contactFormContainer}>
              <ContactForm />
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
  {
    icon: Box,
    title: 'See Your Mouth in 3D',
    desc: 'We turn your flat X-rays into a 3D model that looks like your actual teeth. It’s the easiest way to see exactly what’s going on inside your mouth.'
  },
  {
    icon: FileText,
    title: 'Simple English Explanations',
    desc: 'No more medical jargon. We translate your dentist’s notes into simple, friendly reports so you know exactly what your next steps are.'
  },
  {
    icon: Bot,
    title: 'Your Personal Dental Expert',
    desc: 'Have a question about a procedure or cost? Ask DentoBot. It’s like having a dental expert in your pocket, available 24/7 to give you honest advice.'
  },
  {
    icon: Network,
    title: 'Take Your Records With You',
    desc: 'Your dental records belong to you, not your clinic. Request your files with one click and take them to any doctor you choose.'
  },
  {
    icon: FileCheck,
    title: 'Share with Your Care Team',
    desc: 'Easily coordinate your treatment between different doctors. Send a secure, private link of your 3D records to any specialist instantly, ensuring everyone has the clearest view of your health.'
  },
  {
    icon: ShieldCheck,
    title: 'Bank-Level Security',
    desc: 'We use the same security as banks and hospitals. Your health data is encrypted and completely private—only you decide who sees it.'
  },
];
