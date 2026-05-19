'use client';
import { useState } from 'react';

type UserType = 'provider' | 'patient' | null;

export default function ContactForm() {
  const [userType, setUserType] = useState<UserType>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate sending data to CRM / Support Queue
    setTimeout(() => {
      setStatus('success');
    }, 1200);
  }

  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🤝</div>
        <div style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--text-primary)' }}>Request Received</div>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '1rem', lineHeight: 1.6 }}>
          {userType === 'provider' 
            ? "Your practice is in our priority queue. A DentoGraph clinical integration specialist will contact you within 4 hours." 
            : "Your request has been routed to our patient success team. We usually respond within 24 hours."}
        </p>
        <button onClick={() => { setStatus('idle'); setUserType(null); }} className="btn btn-secondary btn-sm" style={{ marginTop: '24px' }}>
          Return
        </button>
      </div>
    );
  }

  if (!userType) {
    return (
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px' }}>How can we assist you today?</h3>
        <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
          <button 
            onClick={() => setUserType('provider')} 
            style={{ padding: '24px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '16px', transition: 'all 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <div style={{ fontSize: '2rem' }}>🏥</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>I'm a Dental Provider</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Partner with us to increase case acceptance and streamline compliance.</div>
            </div>
          </button>
          
          <button 
            onClick={() => setUserType('patient')} 
            style={{ padding: '24px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '16px', transition: 'all 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <div style={{ fontSize: '2rem' }}>👤</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>I'm a Patient</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Need help with your 3D twin or an EHI record request?</div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button onClick={() => setUserType(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.9rem' }}>← Back</button>
        <span className="badge badge-accent" style={{ marginLeft: 'auto' }}>
          {userType === 'provider' ? 'B2B Enterprise Integration' : 'Patient Support'}
        </span>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {userType === 'provider' ? (
          <>
            <div className="form-group">
              <label className="label">Practice Name</label>
              <input name="clinicName" type="text" className="input" placeholder="e.g. Future Dental Care" required />
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="label">Your Name</label>
                <input name="name" type="text" className="input" placeholder="Dr. Jane Doe" required />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="label">NPI Number (Optional)</label>
                <input name="npi" type="text" className="input" placeholder="10-digit NPI" />
              </div>
            </div>
            <div className="form-group">
              <label className="label">Work Email</label>
              <input name="email" type="email" className="input" placeholder="doctor@futuredental.com" required />
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label className="label">Full Name</label>
              <input name="name" type="text" className="input" placeholder="John Smith" required />
            </div>
            <div className="form-group">
              <label className="label">Email Address</label>
              <input name="email" type="email" className="input" placeholder="john@example.com" required />
            </div>
            <div className="form-group">
              <label className="label">How can we help?</label>
              <select className="input" required style={{ appearance: 'auto' }}>
                <option value="">Select an issue...</option>
                <option value="ehi">Help tracking an EHI request</option>
                <option value="upload">Issue uploading my X-Rays</option>
                <option value="privacy">Privacy & Data Deletion</option>
                <option value="other">Other</option>
              </select>
            </div>
          </>
        )}

        <div className="form-group">
          <label className="label">Message</label>
          <textarea className="input" rows={3} placeholder="Tell us more..." required style={{ resize: 'vertical' }} />
        </div>

        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '8px' }} disabled={status === 'loading'}>
          {status === 'loading' ? 'Routing to team...' : userType === 'provider' ? 'Priority Demo Request →' : 'Submit Support Ticket'}
        </button>

        {/* Industry Standard Compliance / SLA Footer */}
        <div style={{ marginTop: '16px', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
          Do not include emergency medical information in this form.<br/>
          {userType === 'provider' ? 'Sales SLA: 4 Hours' : 'Support SLA: 24 Hours'}
        </div>
      </form>
    </div>
  );
}
