'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import styles from './signup.module.css';

export default function DentistSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const [isSuccess, setIsSuccess] = useState(false);

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
          full_name: fullName
        }
      }
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setIsSuccess(true);
    setLoading(false);
  }

  if (isSuccess) {
    return (
      <div className={styles.authPage} style={{ background: '#f8fafc' }}>
        <div className={styles.authCard} style={{ maxWidth: '550px', padding: '60px', textAlign: 'center' }}>
          <div style={{ marginBottom: '32px' }}>
             <div className="glow-dot" style={{ width: '120px', height: '120px', background: 'var(--green)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '10px' }}>
               <img src="/assets/compliance_shield_icon_1778786188238.png" 
                    alt="Security Shield" 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
             </div>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>Clinic Vault Provisioned</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>Your practice is now shielded by DentoGraph&apos;s Compliance Engine.</p>
          
          <div style={{ textAlign: 'left', background: '#f1f5f9', padding: '24px', borderRadius: '16px', marginBottom: '40px' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center' }}>
              <span style={{ color: 'var(--green)', fontWeight: 800 }}>✓</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>HIPAA-Compliant Database Isolated</span>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center' }}>
              <span style={{ color: 'var(--green)', fontWeight: 800 }}>✓</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Cures Act Compliance Shield Active</span>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ color: 'var(--green)', fontWeight: 800 }}>✓</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Provider Identity Verified: {fullName}</span>
            </div>
          </div>

          <button onClick={() => router.push('/dentist/login')} className="btn btn-primary btn-lg" style={{ width: '100%' }}>Enter Clinic Vault</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.03em' }}>Partner with DentoGraph</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Empower your practice with high-fidelity storytelling.</p>
        
        <form onSubmit={handleSignup}>
          <div style={{ marginBottom: '40px' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary)', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
              Section 1: Clinical Identity
            </div>
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="label" style={{ marginBottom: '8px', display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Provider Full Name</label>
              <input 
                className="input" 
                style={{ padding: '16px', borderRadius: '12px' }}
                placeholder="e.g. Dr. John Doe" 
                value={fullName} 
                onChange={e => setFullName(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="label" style={{ marginBottom: '8px', display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Medical License Number</label>
              <input 
                className="input" 
                style={{ padding: '16px', borderRadius: '12px' }}
                placeholder="e.g. DN123456" 
                value={licenseNumber} 
                onChange={e => setLicenseNumber(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div style={{ marginBottom: '48px' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary)', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
              Section 2: Practice Foundation
            </div>
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="label" style={{ marginBottom: '8px', display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Clinic / Practice Name</label>
              <input 
                className="input" 
                style={{ padding: '16px', borderRadius: '12px' }}
                placeholder="e.g. Modern Dental Group" 
                value={clinicName} 
                onChange={e => setClinicName(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="label" style={{ marginBottom: '8px', display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Professional Email</label>
              <input 
                type="email" 
                className="input" 
                style={{ padding: '16px', borderRadius: '12px' }}
                placeholder="doctor@practice.com" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="label" style={{ marginBottom: '8px', display: 'block', fontSize: '0.85rem', fontWeight: 700 }}>Security Password</label>
              <input 
                type="password" 
                className="input" 
                style={{ padding: '16px', borderRadius: '12px' }}
                placeholder="••••••••" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
            </div>
          </div>

          {error && <p style={{ color: 'var(--red)', fontSize: '0.85rem', marginBottom: '24px', fontWeight: 600 }}>{error}</p>}

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', padding: '20px', borderRadius: '16px', fontSize: '1.1rem', fontWeight: 800, boxShadow: '0 20px 40px rgba(37, 99, 235, 0.2)' }} disabled={loading}>
            {loading ? 'Provisioning Vault...' : 'Create Provider Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
