'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import styles from './dentist-upload.module.css';

export default function DentistUploadPage() {
  const { uploadToken } = useParams<{ uploadToken: string }>();
  const [files, setFiles] = useState<File[]>([]);
  const [recordType, setRecordType] = useState<'comprehensive' | 'xray' | 'prescription'>('comprehensive');
  const [dentistName, setDentistName] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (files.length === 0) return;
    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('fileCount', files.length.toString());
      files.forEach((f, i) => {
        formData.append(`file${i}`, f);
      });
      formData.append('record_type', recordType);
      formData.append('dentist_name', dentistName);
      formData.append('clinic_name', clinicName);
      formData.append('visit_date', visitDate);
      formData.append('patient_id', uploadToken);

      const res = await fetch('/api/analyze', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  if (done) {
    return (
      <div className={styles.page}>
        <div className={styles.successCard}>
          <div style={{ fontSize: '4rem' }}>✅</div>
          <h2>Record uploaded successfully!</h2>
          <p>The patient&apos;s record has been analyzed and added to their DentoGraph account. The AI analysis is complete and they can view it immediately.</p>
          <div className={styles.poweredBy}>Powered by DentoGraph — Patient-owned dental records</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <nav className="navbar" style={{ background: '#fff', borderBottom: '1px solid var(--border)' }}>
        <div className="navbar-logo">Dento<span style={{ fontWeight: 800 }}>Graph</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="glow-dot" style={{ background: 'var(--green)', width: '8px', height: '8px' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>OIG-Compliant Fulfillment Portal</span>
        </div>
      </nav>

      <div className="container" style={{ maxWidth: '600px', paddingTop: '48px', paddingBottom: '80px' }}>
        
        {/* Compliance Header */}
        <div style={{ background: 'rgba(37, 99, 235, 0.05)', border: '1px solid var(--primary)', borderRadius: '16px', padding: '24px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '1.5rem' }}>🛡️</div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '4px' }}>Cures Act Compliance Shield</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Use this portal to fulfill a patient&apos;s Electronic Health Information (EHI) request. DentoGraph automatically logs this transaction to protect your clinic from Information Blocking penalties.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.header} style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Fulfill Record Request</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Package clinical data for secure patient-owned portability.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} style={{ background: '#fff', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)', border: '1px solid var(--border)' }}>
          {/* Type selection */}
          <div className={styles.typeRow} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '24px' }}>
            <button type="button" className={`${styles.typeBtn} ${recordType === 'comprehensive' ? styles.typeBtnActive : ''}`} onClick={() => setRecordType('comprehensive')}>
              🗂️ Comprehensive
            </button>
            <button type="button" className={`${styles.typeBtn} ${recordType === 'xray' ? styles.typeBtnActive : ''}`} onClick={() => setRecordType('xray')}>
              🩻 X-Ray
            </button>
            <button type="button" className={`${styles.typeBtn} ${recordType === 'prescription' ? styles.typeBtnActive : ''}`} onClick={() => setRecordType('prescription')}>
              📋 Prescription
            </button>
          </div>

          {/* File upload */}
          <div className={styles.dropZone} onClick={() => document.getElementById('dentistFile')?.click()}>
            <input id="dentistFile" type="file" accept="image/*,.pdf" multiple style={{ display: 'none' }} onChange={e => {
              if (e.target.files?.length) {
                setFiles(Array.from(e.target.files));
              }
            }} />
            {files.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {files.map((f, i) => (
                  <div key={i}>✅ {f.name}</div>
                ))}
              </div>
            ) : (
              <div className={styles.dropContent}>
                <div style={{ fontSize: '2rem' }}>
                  {recordType === 'comprehensive' ? '🗂️' : recordType === 'xray' ? '🩻' : '📋'}
                </div>
                <div>Click to upload {recordType === 'comprehensive' ? 'multiple files' : recordType === 'xray' ? 'X-ray' : 'prescription'}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>JPG, PNG, PDF</div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="label" htmlFor="dname">Your name</label>
            <input id="dname" className="input" placeholder="Dr. Smith" value={dentistName} onChange={e => setDentistName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="label" htmlFor="clinic">Clinic name</label>
            <input id="clinic" className="input" placeholder="City Dental" value={clinicName} onChange={e => setClinicName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="label" htmlFor="vdate">Visit date</label>
            <input id="vdate" type="date" className="input" value={visitDate} onChange={e => setVisitDate(e.target.value)} />
          </div>

          {error && <div style={{ color: 'var(--red)', fontSize: '0.875rem', padding: '12px', background: 'var(--red-dim)', borderRadius: 'var(--radius-md)' }}>{error}</div>}

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={files.length === 0 || uploading}>
            {uploading ? '🔬 Analyzing & uploading...' : `📤 Upload ${files.length > 1 ? `${files.length} Files` : '& Analyze'}`}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            This record will be AI-analyzed and added to the patient&apos;s private account
          </p>
        </form>
      </div>
    </div>
  );
}
