'use client';
import { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  TrendingUp, 
  FileCheck, 
  ShieldCheck, 
  Network, 
  Clock, 
  ArrowRight,
  Stethoscope,
  CheckCircle2
} from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import styles from '../page.module.css';

export default function ProvidersLandingPage() {
  return (
    <main className={styles.main}>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">
          Dento<span>Graph</span> <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '8px', fontWeight: 500 }}>For Providers</span>
        </div>
        <div className="navbar-links" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link href="/" className="navbar-link" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Patient Portal
          </Link>
          <Link href="/dentist/login" className="btn btn-ghost">Sign In</Link>
          <Link href="/dentist/signup" className="btn btn-primary" style={{ background: '#000', color: '#fff' }}>Claim Clinic</Link>
        </div>
      </nav>

      {/* B2B Hero */}
      <section className={styles.hero} style={{ background: 'linear-gradient(180deg, var(--bg-base) 0%, var(--bg-surface) 100%)' }}>
        <div className={styles.heroBadge}>
          <span className="glow-dot" style={{ background: 'var(--green)' }} />
          <span>The Operating System for Modern Dentistry</span>
        </div>
        <h1 style={{ maxWidth: '800px', margin: '0 auto' }}>
          Double case acceptance.<br />
          <span className="gradient-text">Automate insurance.</span>
        </h1>
        <p className={styles.heroSubtitle} style={{ maxWidth: '700px' }}>
          Stop losing thousands of dollars to "I'll think about it." DentoGraph's chairside 3D models make clinical findings undeniable, while our AI automates your CDT narratives to eliminate claim denials.
        </p>
        <div className={styles.heroCta} style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link href="/dentist/signup" className="btn btn-primary btn-lg" style={{ background: '#000', color: '#fff' }}>
            Claim Your Clinic Spot — Free Beta
          </Link>
          <Link href="#roi" className="btn btn-secondary btn-lg" style={{ background: '#fff', color: '#000' }}>
            View ROI Calculator
          </Link>
        </div>
      </section>

      {/* B2B Value Proposition Grid */}
      <section className={styles.features}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Built to grow your practice.</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              We built DentoGraph to solve the three biggest bottlenecks in clinical dentistry: case presentation, administrative overhead, and data interoperability.
            </p>
          </div>
          
          <div className={styles.featureGrid}>
            <div className={`card ${styles.featureCard}`}>
              <div className={styles.featureIcon} style={{ background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <TrendingUp size={24} strokeWidth={2} />
              </div>
              <h3>Unfair Case Acceptance</h3>
              <p>Patients reject what they don't understand. Instantly convert 2D X-rays into interactive 3D digital twins chairside. When patients see the decay themselves, they schedule the procedure.</p>
            </div>
            
            <div className={`card ${styles.featureCard}`}>
              <div className={styles.featureIcon} style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--green)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <FileCheck size={24} strokeWidth={2} />
              </div>
              <h3>Automated Narratives</h3>
              <p>Stop wasting hours typing insurance narratives. Our AI reads the X-ray and automatically generates an audit-ready, CDT-coded clinical narrative to fight claim denials instantly.</p>
            </div>

            <div className={`card ${styles.featureCard}`}>
              <div className={styles.featureIcon} style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--orange)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Network size={24} strokeWidth={2} />
              </div>
              <h3>ONC Cures Act Ready</h3>
              <p>Eliminate the CD-ROM. Provide an enterprise-grade patient portal where records can be legally requested and retrieved with one click, satisfying full federal compliance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className={styles.beforeAfter} id="roi">
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>The Cost of Doing Nothing</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '48px', lineHeight: 1.7 }}>
            The average clinic loses $40,000+ per month in unaccepted treatment plans and denied insurance claims. DentoGraph pays for itself within the first 48 hours of use.
          </p>

          <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', textAlign: 'left', padding: '32px' }}>
            <div style={{ paddingRight: '24px', borderRight: '1px solid var(--border)' }}>
              <div style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '16px', textTransform: 'uppercase' }}>Without DentoGraph</div>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li style={{ display: 'flex', gap: '12px' }}><span style={{ color: 'var(--red)' }}>✗</span> 35% Case Acceptance Rate</li>
                <li style={{ display: 'flex', gap: '12px' }}><span style={{ color: 'var(--red)' }}>✗</span> 12 hours/week writing narratives</li>
                <li style={{ display: 'flex', gap: '12px' }}><span style={{ color: 'var(--red)' }}>✗</span> 15% Claim Denial Rate</li>
              </ul>
            </div>
            <div style={{ paddingLeft: '8px' }}>
              <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '16px', textTransform: 'uppercase' }}>With DentoGraph</div>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li style={{ display: 'flex', gap: '12px' }}><CheckCircle2 size={18} color="var(--primary)" /> <strong>70%+ Case Acceptance</strong></li>
                <li style={{ display: 'flex', gap: '12px' }}><CheckCircle2 size={18} color="var(--primary)" /> <strong>0 hours</strong> (AI Generated)</li>
                <li style={{ display: 'flex', gap: '12px' }}><CheckCircle2 size={18} color="var(--primary)" /> <strong>&lt; 2% Claim Denials</strong></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* B2B Pricing / Early Access */}
      <section className={styles.pricing}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span className="badge badge-accent" style={{ marginBottom: '16px', display: 'inline-block' }}>Clinic Beta Program</span>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Enterprise tools. Beta pricing.</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              We are offering early access to our first 50 founding clinics. Secure your spot now to lock in free lifetime usage in exchange for your product feedback.
            </p>
          </div>
          
          <div className={`card ${styles.planPro}`} style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center', position: 'relative', overflow: 'hidden', borderColor: 'var(--primary)' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'var(--primary)', color: '#fff', padding: '6px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              12 Spots Remaining
            </div>
            <div className={styles.planName} style={{ marginTop: '24px', color: 'var(--primary)' }}>Founding Partner Clinic</div>
            <div className={styles.planPrice} style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '12px' }}>
              <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '1.5rem' }}>$299</span>
              <span>$0 <span>/month</span></span>
            </div>
            
            <ul className={styles.planFeatures} style={{ textAlign: 'left', margin: '32px auto', maxWidth: '280px', listStyle: 'none', padding: 0 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}><CheckCircle2 size={16} color="var(--primary)" /> <span>Chairside 3D Generation</span></li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}><CheckCircle2 size={16} color="var(--primary)" /> <span>AI Insurance Narratives</span></li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}><CheckCircle2 size={16} color="var(--primary)" /> <span>Enterprise EHI Integration</span></li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}><CheckCircle2 size={16} color="var(--primary)" /> <span>White-Glove Onboarding</span></li>
            </ul>
            
            <Link href="/dentist/signup" className="btn btn-primary btn-lg" style={{ width: '100%', background: '#000', color: '#fff' }}>
              Claim Clinic Spot →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} DentoGraph Systems Inc. Enterprise Provider Portal.</p>
        </div>
      </footer>
    </main>
  );
}
