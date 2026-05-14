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
          Stop leaving the dental office feeling confused. DentoGraph turns complex X-rays into an interactive 3D model of your teeth, with simple insights that finally make sense.
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
            <span className="badge badge-accent" style={{ marginBottom: '16px', display: 'inline-block' }}>DentoGraph Founding Patients</span>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Own your dental health. For life.</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Join our Founding Patient program to receive complimentary Pro access and generate your interactive 3D dental record today.
            </p>
          </div>

          <div className={`card ${styles.planPro}`} style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div className={styles.planName} style={{ marginTop: '24px' }}>Founding Patient</div>
            <div className={styles.planPrice} style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '12px' }}>
              <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '1.5rem' }}>$5</span>
              <span>$0 <span>/early access</span></span>
            </div>

            <ul className={styles.planFeatures} style={{ textAlign: 'left', margin: '32px auto', maxWidth: '280px', listStyle: 'none', padding: 0 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}><CheckCircle2 size={16} color="var(--primary)" /> <span>Interactive 3D Dental Record</span></li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}><CheckCircle2 size={16} color="var(--primary)" /> <span>Plain-Language Clinical Insights</span></li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}><CheckCircle2 size={16} color="var(--primary)" /> <span>Intelligent Clinical Guidance</span></li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}><CheckCircle2 size={16} color="var(--primary)" /> <span>Collaborative Care Sharing</span></li>
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

      {/* Mission / Transparency Section */}
      <section className={styles.mission} id="mission">
        <div className="container" style={{ textAlign: 'center', padding: '80px 24px', borderTop: '1px solid var(--border)' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Our Commitment</span>
            <h2 style={{ fontSize: '2.5rem', marginTop: '16px', marginBottom: '24px' }}>Built for clinical integrity.</h2>
            <p style={{ fontSize: '1.15rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
              DentoGraph was founded on a simple principle: <strong>Health data belongs to the patient.</strong>
              Our mission is to bridge the gap between clinical complexity and human understanding,
              empowering you to make informed decisions about your care with high-fidelity 3D technology.
            </p>
            <div style={{ marginTop: '40px', display: 'flex', gap: '32px', justifyContent: 'center', opacity: 0.7, flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: '1.5rem', color: 'var(--text-primary)' }}>100%</div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Data Ownership</div>
              </div>
              <div style={{ width: '1px', background: 'var(--border)', display: 'none' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: '1.5rem', color: 'var(--text-primary)' }}>HIPAA</div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Compliant</div>
              </div>
              <div style={{ width: '1px', background: 'var(--border)', display: 'none' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: '1.5rem', color: 'var(--text-primary)' }}>ONC</div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Cures Act Ready</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className={styles.contact} id="contact">
        <div className="container">
          <div className={`card ${styles.contactCard}`}>
            <div className={styles.contactInfo}>
              <h2>Transforming the Dental Experience.</h2>
              <p>Whether you are a patient navigating your clinical data or a provider seeking to modernize your practice, our team is here to support you.</p>
              <div style={{ marginTop: '24px' }}>
                <a href="mailto:support@dentograph.us" className="btn btn-primary btn-lg" style={{ background: 'var(--text-primary)', color: '#fff' }}>Contact Our Support Team</a>
              </div>
            </div>
            <div className={styles.contactFormContainer}>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer} style={{ background: '#f8fafc', padding: '60px 0 40px 0', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '48px', marginBottom: '64px' }}>
            <div style={{ flex: '1 1 300px', maxWidth: '350px' }}>
              <div className="navbar-logo" style={{ marginBottom: '16px', fontSize: '1.25rem', display: 'block', height: 'auto' }}>
                Dento<span style={{ color: 'var(--primary)' }}>Graph</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                The modern platform for interactive 3D dental records and clinical transparency.
              </p>
            </div>

            <div style={{ minWidth: '150px' }}>
              <h4 style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-primary)' }}>Platform</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li><Link href="/signup" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>Founding Patient Beta</Link></li>
                <li><Link href="/dentist/signup" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>For Providers</Link></li>
                <li><Link href="/pricing" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>Pricing Strategy</Link></li>
              </ul>
            </div>

            <div style={{ minWidth: '150px' }}>
              <h4 style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-primary)' }}>Support</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li><Link href="#contact" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>Contact Us</Link></li>
                <li><Link href="/faq" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>Help Center</Link></li>
                <li><Link href="/privacy" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>Privacy Policy</Link></li>
              </ul>
            </div>
          </div>

          <div style={{ paddingTop: '32px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>&copy; {new Date().getFullYear()} DentoGraph Systems Inc. All rights reserved.</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
              100% HIPAA Compliant &nbsp; | &nbsp; Clinical Precision
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

const FEATURES = [
  {
    icon: Box,
    title: 'Interactive 3D Diagnostics',
    desc: 'Your dental health, visualized in high-fidelity 3D. We transform static clinical records into an interactive anatomical model, allowing you to visualize your health from every angle.'
  },
  {
    icon: FileText,
    title: 'Plain-Language Clinical Insights',
    desc: 'Bridging the gap between jargon and clarity. Our AI translates complex clinical shorthand into empathetic, easy-to-read reports that help you make informed decisions about your care.'
  },
  {
    icon: Bot,
    title: 'Intelligent Clinical Guidance',
    desc: 'Interact securely with your health record via AI-driven guidance. Receive immediate context on procedures, cost estimations, and care timelines directly from your own data.'
  },
  {
    icon: Network,
    title: 'Automated Record Retrieval',
    desc: 'Reclaim ownership of your clinical history. Leverage federal interoperability standards to instantly retrieve your records from any provider without technical friction.'
  },
  {
    icon: FileCheck,
    title: 'Seamless Collaborative Care',
    desc: 'Securely coordinate with your entire care team. Share encrypted, read-only links of your 3D records with specialists instantly, ensuring every provider is aligned on your treatment plan.'
  },
  {
    icon: ShieldCheck,
    title: 'Zero-Trust Security Architecture',
    desc: 'Your privacy is our priority. Built on hospital-grade, HIPAA-compliant infrastructure, your clinical data is protected by end-to-end encryption and strict role-based access.'
  },
];
