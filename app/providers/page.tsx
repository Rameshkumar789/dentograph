'use client';
import { useState } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  FileCheck, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2,
  Lock,
  Zap,
  Layers,
  Activity,
  History
} from 'lucide-react';
import styles from '../page.module.css';

export default function ProvidersLandingPage() {
  return (
    <main className={styles.main} style={{ background: '#fff' }}>
      {/* Precision Navbar */}
      <nav className="navbar" style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
        <div className="navbar-logo" style={{ fontSize: '1.2rem' }}>
          Dento<span style={{ fontWeight: 800 }}>Graph</span> <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Provider OS</span>
        </div>
        <div className="navbar-links" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link href="/dentist/login" className="btn btn-ghost" style={{ fontWeight: 600 }}>Sign In</Link>
          <Link href="/dentist/signup" className="btn btn-primary" style={{ padding: '12px 24px', borderRadius: '12px' }}>Join Founding Partners</Link>
        </div>
      </nav>

      {/* Pure Enterprise Hero */}
      <section style={{ padding: '140px 24px 100px', textAlign: 'center', position: 'relative', background: 'radial-gradient(circle at 50% -20%, #f1f5f9 0%, #fff 50%)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#0f172a', padding: '10px 20px', borderRadius: '100px', marginBottom: '40px' }}>
            <span className="glow-dot" style={{ background: '#16a34a' }} />
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.15em' }}>The Clinical Operating System</span>
          </div>
          
          <h1 style={{ fontSize: '5rem', fontWeight: 900, letterSpacing: '-0.06em', lineHeight: 0.9, marginBottom: '40px', color: '#0f172a' }}>
            See with Certainty.<br />
            <span style={{ color: '#64748b' }}>Lead with Trust.</span>
          </h1>
          
          <p style={{ fontSize: '1.4rem', color: '#475569', maxWidth: '750px', margin: '0 auto 56px', lineHeight: 1.4, fontWeight: 500, letterSpacing: '-0.01em' }}>
            DentoGraph is the high-fidelity Operating System designed to augment, not replace, the clinician. Translate your expertise into <strong>plain-English diagnostics</strong> that improve the experience for both you and your patients.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link href="/dentist/signup" className="btn btn-primary" style={{ padding: '20px 48px', fontSize: '1.1rem', fontWeight: 800, borderRadius: '12px', background: '#0f172a', color: '#fff', border: 'none', boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)' }}>
              Initialize Practice OS
            </Link>
            <Link href="#roi" style={{ padding: '20px 48px', fontSize: '1.1rem', fontWeight: 800, borderRadius: '12px', background: '#fff', border: '1px solid #e2e8f0', color: '#0f172a', textDecoration: 'none' }}>
              Operational ROI
            </Link>
          </div>
        </div>
      </section>

      {/* The Three Modules: Clinical Studio, Ledger, Interop */}
      <section style={{ padding: '120px 24px', background: '#fff' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '48px' }}>
            {/* Module 1: The Clinical Studio */}
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '56px', height: '56px', background: '#f8fafc', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a', marginBottom: '32px', border: '1px solid #f1f5f9' }}>
                <Activity size={24} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '20px', letterSpacing: '-0.03em' }}>Plain-English Studio</h3>
              <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: '1.05rem', marginBottom: '32px', fontWeight: 500 }}>
                Translate complex findings into plain-English storytelling. DentoGraph augments your chairside expertise with a 3D Digital Twin that makes every diagnosis clear and undeniable to the patient.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 'auto 0 0 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                  <span style={{ color: '#16a34a', flexShrink: 0, display: 'flex', alignItems: 'center' }}>✓</span>
                  <span>Visual Vocabulary for Patient Trust</span>
                </li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                  <span style={{ color: '#16a34a', flexShrink: 0, display: 'flex', alignItems: 'center' }}>✓</span>
                  <span>Augmented Diagnostic Assistance</span>
                </li>
              </ul>
            </div>

            {/* Module 2: The Operational Ledger */}
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '56px', height: '56px', background: '#f8fafc', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a', marginBottom: '32px', border: '1px solid #f1f5f9' }}>
                <Layers size={24} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '20px', letterSpacing: '-0.03em' }}>The Operational Ledger</h3>
              <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: '1.05rem', marginBottom: '32px', fontWeight: 500 }}>
                Automate the daily burden of manual insurance notes. Generate CDT-aligned narratives and secure clinical timelines for every treatment in real-time.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 'auto 0 0 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                  <span style={{ color: '#16a34a', flexShrink: 0, display: 'flex', alignItems: 'center' }}>✓</span>
                  <span>Automated Insurance Narratives</span>
                </li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                  <span style={{ color: '#16a34a', flexShrink: 0, display: 'flex', alignItems: 'center' }}>✓</span>
                  <span>Provable Treatment History</span>
                </li>
              </ul>
            </div>

            {/* Module 3: Regulatory Interop */}
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '56px', height: '56px', background: '#f8fafc', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a', marginBottom: '32px', border: '1px solid #f1f5f9' }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '20px', letterSpacing: '-0.03em' }}>Regulatory Interop</h3>
              <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: '1.05rem', marginBottom: '32px', fontWeight: 500 }}>
                Manage secure patient record requests with total confidence. Provision complete clinical data files with one-click automated fulfillment to any verified specialist.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 'auto 0 0 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                  <span style={{ color: '#16a34a', flexShrink: 0, display: 'flex', alignItems: 'center' }}>✓</span>
                  <span>Cures Act Readiness Guardrails</span>
                </li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                  <span style={{ color: '#16a34a', flexShrink: 0, display: 'flex', alignItems: 'center' }}>✓</span>
                  <span>Automated Clinical Data Engine</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Clinical Performance Comparison (ROI) */}
      <section id="roi" style={{ padding: '120px 24px', background: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-0.04em' }}>The Operational Edge.</h2>
            <p style={{ color: '#64748b', fontSize: '1.25rem', marginTop: '16px', fontWeight: 500 }}>Quantifying the shift from traditional records to high-fidelity diagnostics.</p>
          </div>

          <div style={{ padding: 0, overflow: 'hidden', borderRadius: '32px', border: '1px solid #e2e8f0', background: '#fff', boxShadow: '0 30px 60px rgba(0,0,0,0.02)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#fff', borderBottom: '1px solid #f1f5f9' }}>
                  <th style={{ padding: '32px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8' }}>Metric</th>
                  <th style={{ padding: '32px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8' }}>Traditional Legacy</th>
                  <th style={{ padding: '32px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#0f172a' }}>DentoGraph OS</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '32px', fontWeight: 700, color: '#0f172a' }}>Diagnostic Clarity</td>
                  <td style={{ padding: '32px', color: '#64748b', fontSize: '0.9rem' }}>Static 2D Ambiguity</td>
                  <td style={{ padding: '32px', color: '#0f172a', fontWeight: 800, fontSize: '0.9rem' }}>High-Fidelity 3D Assets</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '32px', fontWeight: 700, color: '#0f172a' }}>Regulatory Defense</td>
                  <td style={{ padding: '32px', color: '#64748b', fontSize: '0.9rem' }}>Manual Compliance Risk</td>
                  <td style={{ padding: '32px', color: '#0f172a', fontWeight: 800, fontSize: '0.9rem' }}>Automated Cures Act Shield</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '32px', fontWeight: 700, color: '#0f172a' }}>Practice Integrity</td>
                  <td style={{ padding: '32px', color: '#64748b', fontSize: '0.9rem' }}>Fragmented Admin Burden</td>
                  <td style={{ padding: '32px', color: '#0f172a', fontWeight: 800, fontSize: '0.9rem' }}>Unified Operational Ledger</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '120px 24px', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-0.05em', marginBottom: '32px' }}>Lead the Future.</h2>
          <p style={{ fontSize: '1.2rem', color: '#64748b', marginBottom: '56px', maxWidth: '600px', margin: '0 auto 56px', fontWeight: 500, lineHeight: 1.5 }}>
            Join our Clinical Vanguard program. Collaborate with the pioneers of high-fidelity diagnostics and define the roadmap of the modern dental ecosystem.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <Link href="/dentist/signup" className="btn btn-primary" style={{ padding: '24px 64px', fontSize: '1.25rem', fontWeight: 800, borderRadius: '16px', background: '#0f172a', color: '#fff', border: 'none', textDecoration: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
              Join the Clinical Vanguard
            </Link>
          </div>
          <div style={{ marginTop: '40px', display: 'flex', gap: '32px', justifyContent: 'center', opacity: 0.6 }}>
             <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Clinical Data Privacy</span>
             <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Enterprise-Grade Security</span>
             <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Universal Record Standards</span>
          </div>
        </div>
      </section>

      <footer style={{ padding: '80px 24px', background: '#fff', borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: '1200px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>DentoGraph</div>
          <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>&copy; 2026 DentoGraph Systems Inc. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '32px' }}>
            <Link href="/privacy" style={{ fontSize: '0.9rem', color: '#64748b', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link href="/terms" style={{ fontSize: '0.9rem', color: '#64748b', textDecoration: 'none' }}>Terms of Service</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
