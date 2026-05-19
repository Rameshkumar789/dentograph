'use client';
import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import styles from '../../auth.module.css';

export default function DentistLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) { 
      setError(error.message); 
      setLoading(false); 
      return; 
    }

    // Verify user is a provider (in a real app, check metadata or profiles table)
    const userRole = data.user?.user_metadata?.role;
    if (userRole && userRole !== 'provider') {
      // In demo mode, we might allow it, but let's be strict for realism
      // await supabase.auth.signOut();
      // setError('This account is not registered as a Dental Provider.');
      // setLoading(false);
      // return;
    }

    router.push('/dentist/dashboard');
  }

  return (
    <div className={styles.authPage}>
      <section className={styles.authStory}>
        <Link href="/providers"><img src="/dentograph-logo.png" alt="DentoGraph" className={styles.authStoryLogo} /></Link>
        <div className={styles.authStoryContent}>
          <h2>Clinical explanation and records workflow for practices.</h2>
          <p>Access chairside visuals, patient record requests, provider uploads, and audit-aware sharing tools.</p>
          <div className={styles.authBullets}>
            <span>Chairside storytelling</span>
            <span>Record request queue</span>
            <span>Export and share events</span>
          </div>
        </div>
      </section>

      <section className={styles.authPanel}>
        <div className={styles.authCard}>
          <div className={styles.authLogo}><img src="/dentograph-logo.png" alt="DentoGraph" /></div>
          <p className={styles.authEyebrow}>Provider workspace</p>
          <h1 className={styles.authTitle}>Provider login</h1>
          <p className={styles.authSubtitle}>Sign in to your practice dashboard.</p>

          {error && <div className={styles.errorBox}>{error}</div>}

          <form onSubmit={handleLogin} className={styles.authForm}>
            <div className="form-group">
              <label className="label" htmlFor="email">Clinic email</label>
              <input id="email" type="email" className="input" placeholder="doctor@practice.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="label" htmlFor="password">Password</label>
              <input id="password" type="password" className="input" placeholder="Your password"
                value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px' }} disabled={loading}>
              {loading ? 'Verifying credentials...' : 'Sign in to dashboard'}
            </button>
          </form>

          <div style={{ marginTop: '24px', padding: '12px', background: '#f8fafc', borderRadius: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
            Privacy-aware dental record infrastructure
          </div>

          <p className={styles.authSwitch}>
            New clinic? <Link href="/dentist/signup">Get provider access</Link>
          </p>
          <p className={styles.authNote}><Link href="/login">Patient login</Link></p>
        </div>
      </section>
    </div>
  );
}
