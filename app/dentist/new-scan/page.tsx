'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import XrayScannerAnimation from '@/components/XrayScannerAnimation';
import styles from './new-scan.module.css';

export default function NewScanPage() {
  const [patientName, setPatientName] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'generating'>('idle');
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (files.length === 0) { setError('Please upload at least one clinical record.'); return; }
    setUploading(true);
    setStatus('uploading');
    setError('');

    try {
      // Simulate multi-stage for UX feel
      setTimeout(() => setStatus('analyzing'), 2000);
      setTimeout(() => setStatus('generating'), 5000);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/dentist/login'); return; }

      // 1. Fetch provider profile to get clinic_id
      const { data: profile } = await supabase.from('profiles').select('clinic_id, full_name').eq('id', user.id).single();

      // 2. Mock Patient Lookup or Invitation logic
      // In a real app, we'd find or create a 'patient' profile. 
      // For the demo, we'll associate this record with the clinic.

      const formData = new FormData();
      files.forEach((f, i) => formData.append(`file${i}`, f));
      formData.append('fileCount', files.length.toString());
      formData.append('patient_name', patientName);
      formData.append('dentist_name', profile?.full_name || 'Clinic Provider');
      formData.append('clinic_name', 'Your Practice');
      formData.append('record_type', 'comprehensive');
      formData.append('visit_date', new Date().toISOString().split('T')[0]);
      
      // Pass provider info so the AI engine knows who's uploading
      formData.append('provider_id', user.id);
      formData.append('source', 'clinician');
      if (profile?.clinic_id) formData.append('clinic_id', profile.clinic_id);

      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error('Analysis failed');

      router.push('/dentist/dashboard?success=true');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={styles.page}>
      {uploading && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '400px', textAlign: 'center' }}>
            <XrayScannerAnimation imageUrl={null} recordType="comprehensive" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '40px', letterSpacing: '-0.02em' }}>
              {status === 'uploading' && 'Ingesting Clinical Data...'}
              {status === 'analyzing' && 'DentoGraph AI Detecting Pathologies...'}
              {status === 'generating' && 'Synthesizing 3D Storyteller...'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
              Optimizing for chairside presentation. Almost ready.
            </p>
          </div>
        </div>
      )}

      <nav className="navbar" style={{ background: '#fff', borderBottom: '1px solid var(--border)' }}>
        <div className="navbar-logo">Dento<span>Graph</span> <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '8px' }}>Clinical Intake</span></div>
        <button onClick={() => router.back()} className="btn btn-ghost">Cancel</button>
      </nav>

      <div className="container" style={{ maxWidth: '650px', paddingTop: '60px', paddingBottom: '80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ width: '140px', height: '140px', margin: '0 auto 24px', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 15px 30px rgba(0,0,0,0.08)' }}>
            <img src="/assets/clinical_intake_hero_1778786170606.png" 
                 alt="Clinical Scanner" 
                 style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Clinical Intake</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '8px' }}>Initiate a 3D analysis for a new patient record.</p>
        </div>

        <form onSubmit={handleSubmit} className="card" style={{ padding: '48px', borderRadius: '24px', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.04)' }}>
          <div className="form-group" style={{ marginBottom: '32px' }}>
            <label className="label" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px', display: 'block' }}>Patient Identity</label>
            <input 
              className="input" 
              placeholder="Full Name (e.g. John Doe)" 
              value={patientName} 
              onChange={e => setPatientName(e.target.value)} 
              style={{ padding: '16px', fontSize: '1.05rem' }}
              required 
            />
          </div>

          <div 
            className={styles.dropzone}
            style={{ padding: '60px 32px', marginBottom: '40px', borderRadius: '20px' }}
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            <input 
              id="fileInput" 
              type="file" 
              multiple 
              style={{ display: 'none' }} 
              onChange={e => e.target.files && setFiles(Array.from(e.target.files))}
            />
            {files.length > 0 ? (
              <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>
                {files.length} clinical files prepared
              </div>
            ) : (
              <div>
                <img src="/assets/patient_record_icon_1778786206884.png" 
                     alt="Upload Icon" 
                     style={{ width: '64px', height: '64px', marginBottom: '12px' }} />
                <br />
                <strong style={{ fontSize: '1rem' }}>Upload Clinical Records</strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px' }}>X-Rays, Intraoral Scans, or Diagnostic Photos</p>
              </div>
            )}
          </div>

          {error && <div style={{ color: 'var(--red)', fontSize: '0.9rem', marginBottom: '24px', padding: '16px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '12px' }}>{error}</div>}

          <button 
            type="submit" 
            className="btn btn-primary btn-lg" 
            style={{ width: '100%', padding: '20px', fontSize: '1.25rem', fontWeight: 700 }}
            disabled={uploading}
          >
            {uploading ? '🔬 Analyzing...' : 'Generate 3D Explainer'}
          </button>
        </form>
      </div>
    </div>
  );
}
