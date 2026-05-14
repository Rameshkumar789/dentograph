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
      <section className={styles.hero} style={{ background: 'linear-gradient(180deg, var(--bg-base) 0%, var(--bg-surface) 100%)', padding: '80px 24px' }}>
        <div className={styles.heroBadge}>
          <span className="glow-dot" style={{ background: 'var(--green)' }} />
          <span>Practice Performance OS</span>
        </div>
        <h1 style={{ maxWidth: '800px', margin: '0 auto' }}>
          Increase case acceptance.<br />
          <span className="gradient-text">Automate compliance.</span>
        </h1>
        <p className={styles.heroSubtitle} style={{ maxWidth: '700px' }}>
          DentoGraph transforms clinical records into high-fidelity 3D models to enhance case presentation, 
          while our AI assists with clinical documentation to streamline your administrative workflows.
        </p>
        <div className={styles.heroCta} style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link href="/dentist/signup" className="btn btn-primary btn-lg" style={{ background: '#000', color: '#fff' }}>
            Claim Clinic Spot — Founding Partner
          </Link>
          <Link href="#roi" className="btn btn-secondary btn-lg" style={{ background: '#fff', color: '#000' }}>
            View Clinical ROI
          </Link>
        </div>
      </section>

      {/* B2B Clinical Outcomes Grid */}
      <section className={styles.features}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Measureable Clinical Outcomes</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Designed to integrate seamlessly with your existing workflow and maximize practice efficiency.
            </p>
          </div>
          
          <div className={styles.featureGrid}>
            <div className={`card ${styles.featureCard}`}>
              <div className={styles.featureIcon} style={{ background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <TrendingUp size={24} strokeWidth={2} />
              </div>
              <h3>Visual Case Acceptance</h3>
              <p>Patients schedule what they understand. Transform 2D X-rays into interactive 3D models chairside, making clinical findings visually undeniable.</p>
            </div>
            
            <div className={`card ${styles.featureCard}`}>
              <div className={styles.featureIcon} style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--green)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <FileCheck size={24} strokeWidth={2} />
              </div>
              <h3>Automated Narratives</h3>
              <p>Eliminate manual narrative writing. Our AI analyzes clinical data to generate audit-ready CDT narratives, reducing claim denials and administrative overhead.</p>
            </div>

            <div className={`card ${styles.featureCard}`}>
              <div className={styles.featureIcon} style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--orange)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Network size={24} strokeWidth={2} />
              </div>
              <h3>Cures Act Interoperability</h3>
              <p>Exceed federal EHI standards. Provide a secure portal for instant record retrieval, shielding your practice from Information Blocking penalties.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className={styles.beforeAfter} id="roi">
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Clinical Performance Metrics</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '48px', lineHeight: 1.7 }}>
            The average practice loses significant revenue to unaccepted treatment plans and administrative friction. 
            DentoGraph provides an immediate path to clinical and financial optimization.
          </p>          <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', textAlign: 'left', padding: '32px' }}>
            <div style={{ paddingRight: '24px', borderRight: '1px solid var(--border)' }}>
              <div style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '16px', textTransform: 'uppercase' }}>Current Industry Baseline¹</div>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li style={{ display: 'flex', gap: '12px' }}><span style={{ color: 'var(--red)' }}>✗</span> 46.2% Case Acceptance Rate</li>
                <li style={{ display: 'flex', gap: '12px' }}><span style={{ color: 'var(--red)' }}>✗</span> 10+ hours/week on clinical narratives</li>
                <li style={{ display: 'flex', gap: '12px' }}><span style={{ color: 'var(--red)' }}>✗</span> Risk of $1M Information Blocking fines²</li>
              </ul>
            </div>
            <div style={{ paddingLeft: '8px' }}>
              <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '16px', textTransform: 'uppercase' }}>DentoGraph Target³</div>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li style={{ display: 'flex', gap: '12px' }}><CheckCircle2 size={18} color="var(--primary)" /> <strong>75%+ Case Acceptance</strong></li>
                <li style={{ display: 'flex', gap: '12px' }}><CheckCircle2 size={18} color="var(--primary)" /> <strong>Automated Clinical Narratives</strong></li>
                <li style={{ display: 'flex', gap: '12px' }}><CheckCircle2 size={18} color="var(--primary)" /> <strong>Full ONC Cures Act Compliance</strong></li>
              </ul>
            </div>
          </div>
          
          <div style={{ marginTop: '32px', textAlign: 'left', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li style={{ fontSize: '0.65rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                ¹ <strong>CastHub (2025).</strong> Dental Performance Industry Report: Analysis of U.S. Practice Benchmarks.
              </li>
              <li style={{ fontSize: '0.65rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                ² <strong>HHS OIG (2024).</strong> Final Rule on Information Blocking Penalties (42 CFR Part 1003). 
              </li>
              <li style={{ fontSize: '0.65rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                ³ <strong>American Dental Association (ADA).</strong> Clinical KPI Benchmarks for Modern Practice Management.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* B2B Pricing / Founding Partner */}
      <section className={styles.pricing}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span className="badge badge-accent" style={{ marginBottom: '16px', display: 'inline-block' }}>Founding Partner Program</span>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Enterprise tools. Beta access.</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Secure a spot in our Founding Partner program to lock in complimentary access during our initial rollout phase.
            </p>
          </div>
          
          <div className={`card ${styles.planPro}`} style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center', position: 'relative', overflow: 'hidden', borderColor: 'var(--primary)' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'var(--primary)', color: '#fff', padding: '6px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Limited Partner Spots
            </div>
            <div className={styles.planName} style={{ marginTop: '24px', color: 'var(--primary)' }}>Founding Partner Clinic</div>
            <div className={styles.planPrice} style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '12px' }}>
              <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '1.5rem' }}>$299</span>
              <span>$0 <span>/partner access</span></span>
            </div>
            
            <ul className={styles.planFeatures} style={{ textAlign: 'left', margin: '32px auto', maxWidth: '280px', listStyle: 'none', padding: 0 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}><CheckCircle2 size={16} color="var(--primary)" /> <span>Interactive 3D Model Gen</span></li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}><CheckCircle2 size={16} color="var(--primary)" /> <span>AI Clinical Narratives</span></li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}><CheckCircle2 size={16} color="var(--primary)" /> <span>EHI Interoperability Portal</span></li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}><CheckCircle2 size={16} color="var(--primary)" /> <span>Direct Product Support</span></li>
            </ul>
            
            <Link href="/dentist/signup" className="btn btn-primary btn-lg" style={{ width: '100%', background: '#000', color: '#fff' }}>
              Apply for Partner Spot →
            </Link>
          </div>
        </div>
      </section>

      <footer className={styles.footer} style={{ background: '#f8fafc', padding: '60px 0 40px 0', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '32px', marginBottom: '48px' }}>
            <div>
              <div className="navbar-logo" style={{ marginBottom: '16px', fontSize: '1.25rem', display: 'block', height: 'auto' }}>
                Dento<span style={{ color: 'var(--primary)' }}>Graph</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '280px' }}>
                The modern platform for interactive 3D dental records and clinical transparency.
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-primary)' }}>Platform</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li><Link href="/signup" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>Founding Patient Beta</Link></li>
                <li><Link href="/dentist/signup" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>For Providers</Link></li>
                <li><Link href="/pricing" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>Pricing Strategy</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-primary)' }}>Support</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li><Link href="/" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>Patient Home</Link></li>
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
