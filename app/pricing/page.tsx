'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-default)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
      <nav className="navbar">
        <button
          onClick={() => router.push('/')}
          style={{ cursor: 'pointer', border: 0, background: 'transparent', padding: 0 }}
          aria-label="Go to DentoGraph home"
        >
          <img src="/dentograph-logo.png" alt="DentoGraph" style={{ width: '188px', height: 'auto', display: 'block' }} />
        </button>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => router.push('/dashboard')} className="btn btn-secondary btn-sm">
            ← Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: '80px', paddingBottom: '100px', maxWidth: '1000px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-display)', marginBottom: '16px', fontWeight: 800 }}>
          Take control of your <span className="gradient-text">Dental Health</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '64px', maxWidth: '600px', margin: '0 auto 64px auto' }}>
          During the founding beta, every patient account includes full access while we refine the product.
        </p>

        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', justifyContent: 'center', textAlign: 'left' }}>
          
          {/* Free Tier */}
          <div className="card" style={{ flex: '1 1 300px', padding: '40px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Founding Beta</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '24px', fontFamily: 'var(--font-display)' }}>$0<span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>/beta</span></div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', minHeight: '48px' }}>Full early access for patients helping shape DentoGraph.</p>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0', display: 'flex', flexDirection: 'column', gap: '16px', color: 'var(--text-secondary)' }}>
              <li>Unlimited record storage</li>
              <li>3D dental record views</li>
              <li>Unlimited DentoBot chat</li>
              <li>Shareable second-opinion links</li>
              <li>Multi-file contextualization</li>
            </ul>
            
            <Link href="/dashboard" className="btn btn-secondary btn-lg" style={{ width: '100%', textAlign: 'center' }}>
              Open Dashboard
            </Link>
          </div>

          <div className="card" style={{ flex: '1 1 300px', padding: '40px', background: 'linear-gradient(145deg, #DBEAFE, #EFF6FF)', border: '1px solid var(--accent)', position: 'relative', transform: 'scale(1.05)', zIndex: 10, boxShadow: 'var(--accent-glow)' }}>
            <div style={{ position: 'absolute', top: '-12px', right: '32px', background: 'var(--accent)', color: '#fff', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 800 }}>PRACTICES</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--accent)' }}>Provider Beta</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '24px', fontFamily: 'var(--font-display)' }}>Pilot<span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>/founding clinics</span></div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', minHeight: '48px' }}>Patient education, insurance narratives, and record-sharing workflows for clinics.</p>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0', display: 'flex', flexDirection: 'column', gap: '16px', color: 'var(--text-primary)' }}>
              <li>Chairside visual storytelling</li>
              <li>Clinical narrative drafting</li>
              <li>Patient upload/request workflows</li>
              <li>Share and export audit events</li>
              <li>Founding partner onboarding</li>
            </ul>
            
            <Link href="/dentist/signup" className="btn btn-primary btn-lg" style={{ width: '100%', textAlign: 'center' }}>
              Join Provider Beta
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
