'use client';
import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import styles from '../auth.module.css';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name, role: 'patient' } }
    });
    
    if (error) { 
      setError(error.message); 
      setLoading(false); 
      return; 
    }

    // Client-side Profile Creation (Fallback for when DB triggers are not yet deployed)
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: name,
        role: 'patient',
      });
      await supabase.from('patients').insert({
        id: data.user.id,
      });
      await supabase.from('consents').insert([
        { user_id: data.user.id, consent_type: 'terms', metadata: { source: 'patient_signup' } },
        { user_id: data.user.id, consent_type: 'privacy', metadata: { source: 'patient_signup' } },
      ]);
    }

    router.push('/dashboard');
  }

  return (
    <div className={styles.authPage}>
      <section className={styles.authStory}>
        <Link href="/"><img src="/dentograph-logo.png" alt="DentoGraph" className={styles.authStoryLogo} /></Link>
        <div className={styles.authStoryContent}>
          <h2>Start with one record. Build your dental timeline.</h2>
          <p>Upload records, request files from a clinic, understand findings, and share your dental story when it matters.</p>
          <div className={styles.authBullets}>
            <span>Unlimited beta records</span>
            <span>DentoBot included</span>
            <span>No credit card</span>
          </div>
        </div>
      </section>

      <section className={styles.authPanel}>
        <div className={styles.authCard}>
          <div className={styles.authLogo}><img src="/dentograph-logo.png" alt="DentoGraph" /></div>
          <p className={styles.authEyebrow}>Founding patient beta</p>
          <h1 className={styles.authTitle}>Create your account</h1>
          <p className={styles.authSubtitle}>Own a clear, shareable version of your dental history.</p>

          {error && <div className={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSignup} className={styles.authForm}>
            <div className="form-group">
              <label className="label" htmlFor="name">Full name</label>
              <input id="name" type="text" className="input" placeholder="Alex Johnson"
                value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="label" htmlFor="email">Email</label>
              <input id="email" type="email" className="input" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="label" htmlFor="password">Password</label>
              <input id="password" type="password" className="input" placeholder="Minimum 8 characters"
                value={password} onChange={e => setPassword(e.target.value)} required minLength={8} />
            </div>
            <label style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} required style={{ marginTop: '3px' }} />
              <span>I agree to the <Link href="/terms">Terms</Link>, <Link href="/privacy">Privacy Policy</Link>, and understand DentoGraph AI is educational, not a dental diagnosis.</span>
            </label>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Creating account...' : 'Create free account'}
            </button>
          </form>

          <p className={styles.authSwitch}>
            Already have an account? <Link href="/login">Sign in</Link>
          </p>
          <p className={styles.authNote}>Founding beta includes full access.</p>
        </div>
      </section>
    </div>
  );
}
