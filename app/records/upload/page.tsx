'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import XrayScannerAnimation from '@/components/XrayScannerAnimation';
import ComingSoonModal from '@/components/ComingSoonModal';
import { usePlan } from '@/hooks/usePlan';
import styles from './upload.module.css';

export default function UploadPage() {
  const [tab, setTab] = useState<'xray' | 'prescription' | 'comprehensive'>('comprehensive');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [dentistName, setDentistName] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { plan } = usePlan();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) handleFiles(droppedFiles);
  }, []);

  function handleFiles(newFiles: File[]) {
    setFiles(prev => [...prev, ...newFiles]);
    const urls = newFiles.map(f => URL.createObjectURL(f));
    setPreviews(prev => [...prev, ...urls]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (files.length === 0) { setError('Please select at least one file'); return; }
    setAnalyzing(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      // ENTERPRISE ENTITLEMENT ENGINE: Enforce Tier Limits
      const { count } = await supabase
        .from('records')
        .select('*', { count: 'exact', head: true })
        .eq('patient_id', user.id);

      if (count !== null && count >= plan.recordLimit) {
        setIsModalOpen(true);
        setAnalyzing(false);
        return;
      }

      const formData = new FormData();
      files.forEach((f, i) => formData.append(`file${i}`, f));
      formData.append('fileCount', files.length.toString());
      formData.append('record_type', tab);
      formData.append('dentist_name', dentistName);
      formData.append('clinic_name', clinicName);
      formData.append('visit_date', visitDate);
      formData.append('patient_id', user.id);
      formData.append('source', 'patient');

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
    return <XrayScannerAnimation imageUrl={previews[0]} recordType={tab} />;
  }

  return (
    <div className={styles.page}>
      <nav className="navbar">
        <div className="navbar-logo">Dento<span>Graph</span></div>
        <button onClick={() => router.back()} className="btn btn-secondary btn-sm">← Back</button>
      </nav>

      <div className="container" style={{ maxWidth: '700px', paddingTop: '48px' }}>
        <h1>Upload a dental record</h1>
        <p style={{ marginBottom: '32px' }}>Upload an X-ray or prescription. Our AI will analyze it and create an interactive 3D report.</p>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${tab === 'comprehensive' ? styles.tabActive : ''}`} onClick={() => setTab('comprehensive')}>
            🗂️ Comprehensive Record
          </button>
          <button className={`${styles.tab} ${tab === 'xray' ? styles.tabActive : ''}`} onClick={() => setTab('xray')}>
            🩻 X-Ray Only
          </button>
          <button className={`${styles.tab} ${tab === 'prescription' ? styles.tabActive : ''}`} onClick={() => setTab('prescription')}>
            📋 Prescription Only
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Drop zone */}
          <div
            className={`${styles.dropZone} ${files.length > 0 ? styles.dropZoneActive : ''}`}
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            <input
              id="fileInput"
              type="file"
              accept="image/*,.pdf"
              multiple
              style={{ display: 'none' }}
              onChange={e => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFiles(Array.from(e.target.files));
                }
              }}
            />
            {files.length > 0 ? (
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {previews.map((src, i) => (
                  <div key={i} className={styles.preview} style={{ width: '120px', height: '120px' }}>
                    <img src={src} alt={`Preview ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                    <span className={styles.previewName} style={{ fontSize: '0.7rem' }}>{files[i].name}</span>
                  </div>
                ))}
                <div style={{ width: '100%', textAlign: 'center', marginTop: '16px', fontSize: '0.85rem', color: 'var(--primary)' }}>
                  Click or drag more files to add
                </div>
              </div>
            ) : (
              <div className={styles.dropContent}>
                <div className={styles.dropIcon}>🗂️</div>
                <div className={styles.dropTitle}>
                  Drop your X-rays, 3D Scans, and prescriptions here
                </div>
                <div className={styles.dropSub}>Upload multiple files at once · JPG, PNG, PDF</div>
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
              <input id="date" type="date" className="input" value={visitDate} onChange={e => setVisitDate(e.target.value)} required />
            </div>
          </div>

          {error && <div style={{ color: 'var(--red)', fontSize: '0.875rem', padding: '12px', background: 'var(--red-dim)', borderRadius: 'var(--radius-md)' }}>{error}</div>}

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={files.length === 0}>
            🔬 Analyze {files.length > 0 ? `${files.length} Files` : ''} with AI
          </button>
          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Analysis takes 5-15 seconds · Your data stays private
          </p>
        </form>
      </div>

      <ComingSoonModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        featureName="Unlimited Records (DentoGraph Pro)" 
      />
    </div>
  );
}
