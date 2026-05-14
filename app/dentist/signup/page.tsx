'use client';
import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import styles from '../../auth.module.css';

export default function DentistSignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
          full_name: `Dr. at ${clinicName}`
        }
      }
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Client-side Profile & Clinic Creation
    if (data.user) {
      // 1. Create the Clinic
      const { data: clinicData, error: clinicError } = await supabase.from('clinics').insert({
        name: clinicName,
        is_verified: true // Hardcoded for MVP beta access
      }).select('id').single();

      if (clinicError) {
        setError('Error creating clinic: ' + clinicError.message);
        setLoading(false);
        return;
      }

      // 2. Create the Provider Profile linked to the clinic
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: `Dr. at ${clinicName}`,
        role: 'provider',
        clinic_id: clinicData?.id,
        license_number: licenseNumber
      });

      if (profileError) {
        setError('Error creating profile: ' + profileError.message);
        setLoading(false);
        return;
      }
    }

    alert('Provider account created! You can now access your compliance dashboard.');
    router.push('/dentist/dashboard');
  }

  return (
    <div className={styles.authPage} style={{ background: '#f0f4f8' }}>
      <div className={styles.authCard} style={{ maxWidth: '450px', borderTop: '4px solid var(--primary)' }}>
        <div className={styles.authLogo} style={{ color: 'var(--primary)' }}>🦷 DentoGraph <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>For Providers</span></div>
        <h1 className={styles.authTitle}>Get Provider Access</h1>
        <p className={styles.authSubtitle}>Shield your clinic from Cures Act penalties and increase case acceptance.</p>

        {error && <div className={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSignup} className={styles.authForm}>
          <div className="form-group">
            <label className="label">Clinic Name</label>
            <input type="text" className="input" placeholder="City Dental Care"
              value={clinicName} onChange={e => setClinicName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="label">NPI / License Number</label>
            <input type="text" className="input" placeholder="1234567890"
              value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="label">Work Email</label>
            <input type="email" className="input" placeholder="office@citydental.com"
              value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="label">Password</label>
            <input type="password" className="input" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px' }} disabled={loading}>
            {loading ? 'Creating Clinic Vault...' : 'Claim Your Dashboard →'}
          </button>
        </form>

        <p className={styles.authSwitch}>
          Already registered? <Link href="/dentist/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in here</Link>
        </p>
      </div>
    </div>
  );
}
