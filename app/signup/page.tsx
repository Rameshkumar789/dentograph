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
    }

    router.push('/dashboard');
  }

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <div className={styles.authLogo}>DentoGraph</div>
        <h1 className={styles.authTitle}>Create your account</h1>
        <p className={styles.authSubtitle}>Own your dental health records forever</p>

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
            <input id="password" type="password" className="input" placeholder="min. 8 characters"
              value={password} onChange={e => setPassword(e.target.value)} required minLength={8} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create free account →'}
          </button>
        </form>

        <p className={styles.authSwitch}>
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
        <p className={styles.authNote}>Free plan includes 1 record · No credit card required</p>
      </div>
    </div>
  );
}
