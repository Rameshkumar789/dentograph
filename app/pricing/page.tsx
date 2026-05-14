'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-default)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
      <nav className="navbar">
        <div className="navbar-logo" onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>
          Dento<span>Graph</span>
        </div>
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
          Whether you need a quick second opinion or want to maintain your complete lifetime dental record, we have a plan for you.
        </p>

        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', justifyContent: 'center', textAlign: 'left' }}>
          
          {/* Free Tier */}
          <div className="card" style={{ flex: '1 1 300px', padding: '40px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Basic</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '24px', fontFamily: 'var(--font-display)' }}>$0<span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>/forever</span></div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', minHeight: '48px' }}>Perfect for tracking your annual checkups.</p>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0', display: 'flex', flexDirection: 'column', gap: '16px', color: 'var(--text-secondary)' }}>
              <li>✅ Store up to 3 dental records</li>
              <li>✅ Basic 2D AI Analysis</li>
              <li>✅ DentoBot Chat (5 queries/mo)</li>
              <li>❌ 3D Analytical Models</li>
              <li>❌ Shareable 2nd Opinion Links</li>
            </ul>
            
            <Link href="/dashboard" className="btn btn-secondary btn-lg" style={{ width: '100%', textAlign: 'center' }}>
              Current Plan
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="card" style={{ flex: '1 1 300px', padding: '40px', background: 'linear-gradient(145deg, #DBEAFE, #EFF6FF)', border: '1px solid var(--accent)', position: 'relative', transform: 'scale(1.05)', zIndex: 10, boxShadow: 'var(--accent-glow)' }}>
            <div style={{ position: 'absolute', top: '-12px', right: '32px', background: 'var(--accent)', color: '#fff', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 800 }}>MOST POPULAR</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--accent)' }}>Pro</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '24px', fontFamily: 'var(--font-display)' }}>$5<span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>/mo</span></div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', minHeight: '48px' }}>Comprehensive tools to never get overcharged again.</p>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0', display: 'flex', flexDirection: 'column', gap: '16px', color: 'var(--text-primary)' }}>
              <li>✨ Unlimited records storage</li>
              <li>✨ Advanced 3D Jaw Analytics</li>
              <li>✨ Unlimited DentoBot Chat</li>
              <li>✨ Secure 2nd Opinion Share Links</li>
              <li>✨ Automatic Multi-file contextualization</li>
            </ul>
            
            <button className="btn btn-primary btn-lg" style={{ width: '100%', textAlign: 'center' }} onClick={() => alert('Stripe checkout would open here!')}>
              Upgrade to Pro
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
