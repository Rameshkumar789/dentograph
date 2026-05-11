'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import XrayScannerAnimation from '@/components/XrayScannerAnimation';
import styles from './upload.module.css';

export default function UploadPage() {
  const [tab, setTab] = useState<'xray' | 'prescription'>('xray');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dentistName, setDentistName] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  }, []);

  function handleFile(f: File) {
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) { setError('Please select a file'); return; }
    setAnalyzing(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('record_type', tab);
      formData.append('dentist_name', dentistName);
      formData.append('clinic_name', clinicName);
      formData.append('visit_date', visitDate);
      formData.append('patient_id', user.id);

      const res = await fetch('/api/analyze', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Analysis failed');
      router.push(`/records/${data.record.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setAnalyzing(false);
    }
  }

  if (analyzing) {
    return <XrayScannerAnimation imageUrl={preview} recordType={tab} />;
  }

  return (
    <div className={styles.page}>
      <nav className="navbar">
        <div className="navbar-logo">🦷 Dento<span>Graph</span></div>
        <button onClick={() => router.back()} className="btn btn-secondary btn-sm">← Back</button>
      </nav>

      <div className="container" style={{ maxWidth: '700px', paddingTop: '48px' }}>
        <h1>Upload a dental record</h1>
        <p style={{ marginBottom: '32px' }}>Upload an X-ray or prescription. Our AI will analyze it and create an interactive 3D report.</p>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${tab === 'xray' ? styles.tabActive : ''}`} onClick={() => setTab('xray')}>
            🩻 X-Ray
          </button>
          <button className={`${styles.tab} ${tab === 'prescription' ? styles.tabActive : ''}`} onClick={() => setTab('prescription')}>
            📋 Prescription
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Drop zone */}
          <div
            className={`${styles.dropZone} ${file ? styles.dropZoneActive : ''}`}
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            <input
              id="fileInput"
              type="file"
              accept="image/*,.pdf"
              style={{ display: 'none' }}
              onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            {preview ? (
              <div className={styles.preview}>
                <img src={preview} alt="Preview" />
                <span className={styles.previewName}>{file?.name}</span>
              </div>
            ) : (
              <div className={styles.dropContent}>
                <div className={styles.dropIcon}>{tab === 'xray' ? '🩻' : '📋'}</div>
                <div className={styles.dropTitle}>
                  Drop your {tab === 'xray' ? 'X-ray image' : 'prescription'} here
                </div>
                <div className={styles.dropSub}>or click to browse · JPG, PNG, PDF accepted</div>
              </div>
            )}
          </div>

          {/* Meta fields */}
          <div className={styles.metaGrid}>
            <div className="form-group">
              <label className="label" htmlFor="dentist">Dentist name</label>
              <input id="dentist" className="input" placeholder="Dr. Smith" value={dentistName} onChange={e => setDentistName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="label" htmlFor="clinic">Clinic name</label>
              <input id="clinic" className="input" placeholder="City Dental" value={clinicName} onChange={e => setClinicName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="label" htmlFor="date">Visit date</label>
              <input id="date" type="date" className="input" value={visitDate} onChange={e => setVisitDate(e.target.value)} />
            </div>
          </div>

          {error && <div style={{ color: 'var(--red)', fontSize: '0.875rem', padding: '12px', background: 'var(--red-dim)', borderRadius: 'var(--radius-md)' }}>{error}</div>}

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={!file}>
            🔬 Analyze with AI
          </button>
          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Analysis takes 5-15 seconds · Your data stays private
          </p>
        </form>
      </div>
    </div>
  );
}
