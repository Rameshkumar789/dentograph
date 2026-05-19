'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import styles from '../../auth.module.css';

export default function DentistSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'provider',
          clinic_name: clinicName,
          license_number: licenseNumber,
          full_name: fullName,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from('consents').insert([
        { user_id: data.user.id, consent_type: 'terms', metadata: { source: 'provider_signup' } },
        { user_id: data.user.id, consent_type: 'privacy', metadata: { source: 'provider_signup' } },
      ]);
    }

    setIsSuccess(true);
    setLoading(false);
  }

  if (isSuccess) {
    return (
      <div className={styles.authPage}>
        <section className={styles.authStory}>
          <Link href="/providers"><img src="/dentograph-logo.png" alt="DentoGraph" className={styles.authStoryLogo} /></Link>
          <div className={styles.authStoryContent}>
            <h2>Your practice workspace is ready.</h2>
            <p>DentoGraph will help your team explain findings, package records, and track patient-authorized sharing events.</p>
          </div>
        </section>
        <section className={styles.authPanel}>
          <div className={styles.authCard}>
            <div className={styles.authLogo}><img src="/dentograph-logo.png" alt="DentoGraph" /></div>
            <p className={styles.authEyebrow}>Provider beta</p>
            <h1 className={styles.authTitle}>Workspace created</h1>
            <p className={styles.authSubtitle}>Provider identity submitted for {fullName}. Continue to the provider login to enter the dashboard.</p>
            <div style={{ display: 'grid', gap: '12px', marginBottom: '28px' }}>
              <div style={{ padding: '14px', borderRadius: '12px', background: '#f8fafc', color: '#334155', fontWeight: 700 }}>Practice workspace created</div>
              <div style={{ padding: '14px', borderRadius: '12px', background: '#f8fafc', color: '#334155', fontWeight: 700 }}>Consent and audit controls enabled</div>
              <div style={{ padding: '14px', borderRadius: '12px', background: '#f8fafc', color: '#334155', fontWeight: 700 }}>Founding beta access active</div>
            </div>
            <button onClick={() => router.push('/dentist/login')} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              Enter provider login
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className={styles.authPage}>
      <section className={styles.authStory}>
        <Link href="/providers"><img src="/dentograph-logo.png" alt="DentoGraph" className={styles.authStoryLogo} /></Link>
        <div className={styles.authStoryContent}>
          <h2>Join the founding practice beta.</h2>
          <p>Give patients a clearer dental story while your team gets cleaner record requests, narratives, and share activity.</p>
          <div className={styles.authBullets}>
            <span>Chairside patient education</span>
            <span>Insurance narrative drafting</span>
            <span>Record sharing audit events</span>
          </div>
        </div>
      </section>

      <section className={styles.authPanel}>
        <div className={styles.authCard}>
          <div className={styles.authLogo}><img src="/dentograph-logo.png" alt="DentoGraph" /></div>
          <p className={styles.authEyebrow}>Provider onboarding</p>
          <h1 className={styles.authTitle}>Create provider access</h1>
          <p className={styles.authSubtitle}>Set up a founding beta workspace for your practice.</p>

          {error && <p className={styles.errorBox}>{error}</p>}

          <form onSubmit={handleSignup} className={styles.authForm}>
            <div className="form-group">
              <label className="label">Provider full name</label>
              <input className="input" placeholder="Dr. Jane Patel" value={fullName} onChange={e => setFullName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="label">License number</label>
              <input className="input" placeholder="State dental license" value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="label">Practice name</label>
              <input className="input" placeholder="Modern Dental Group" value={clinicName} onChange={e => setClinicName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="label">Professional email</label>
              <input type="email" className="input" placeholder="doctor@practice.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="label">Password</label>
              <input type="password" className="input" placeholder="Minimum 8 characters" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} />
            </div>
            <label style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} required style={{ marginTop: '3px' }} />
              <span>I confirm I am authorized to create this provider account and agree to the <Link href="/terms">Terms</Link>, <Link href="/privacy">Privacy Policy</Link>, and provider data responsibilities.</span>
            </label>
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading || !accepted}>
              {loading ? 'Creating workspace...' : 'Create provider account'}
            </button>
          </form>

          <p className={styles.authSwitch}>Already have access? <Link href="/dentist/login">Provider login</Link></p>
        </div>
      </section>
    </div>
  );
}
