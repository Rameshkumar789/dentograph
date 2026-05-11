'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import styles from '../record.module.css';

interface DentalRecord {
  id: string;
  record_type: string;
  dentist_name?: string;
  clinic_name?: string;
  visit_date?: string;
  created_at: string;
  file_path?: string;
}

export default function SourceDocumentsPage() {
  const { id } = useParams<{ id: string }>();
  const [record, setRecord] = useState<DentalRecord | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      
      const { data } = await supabase.from('records').select('*').eq('id', id).single();
      setRecord(data);
      
      if (data?.file_path) {
        // Handle comma-separated paths from multi-file uploads
        const paths = data.file_path.split(',').filter(Boolean);
        const urls = await Promise.all(paths.map(async (p: string) => {
          const { data: signedData } = await supabase.storage.from('dental-records').createSignedUrl(p, 3600);
          return signedData?.signedUrl || '';
        }));
        setImageUrls(urls.filter(Boolean));
      }
      
      setLoading(false);
    }
    load();
  }, [id, router, supabase]);

  if (loading) return (
    <div className={styles.page}>
      <nav className="navbar"><div className="navbar-logo">🦷 Dento<span>Graph</span></div></nav>
      <div className="container" style={{ paddingTop: '48px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="skeleton" style={{ height: '500px' }} />
      </div>
    </div>
  );

  if (!record) return <div className={styles.page}><p style={{ padding: '48px', textAlign: 'center' }}>Record not found.</p></div>;

  const displayDate = record?.visit_date
    ? new Date(record.visit_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : new Date(record.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className={styles.page}>
      <nav className="navbar">
        <div className="navbar-logo">🦷 Dento<span>Graph</span></div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => router.push(`/records/${id}`)} className="btn btn-primary btn-sm">
            ← Back to AI Analysis
          </button>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: '32px', paddingBottom: '80px', maxWidth: '900px' }}>
        <div className={styles.recordHeader} style={{ marginBottom: '32px', borderBottom: '1px solid var(--border)', paddingBottom: '24px' }}>
          <div>
            <div className={styles.recordType}>
              {record.record_type === 'comprehensive' ? '🗂️ Comprehensive Record' : record.record_type === 'xray' ? '🩻 X-Ray' : '📋 Prescription'}
              {record.dentist_name && ` · ${record.dentist_name}`}
              {record.clinic_name && ` · ${record.clinic_name}`}
            </div>
            <h1 style={{ marginTop: '8px' }}>Patient Records</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Uploaded on {displayDate}</p>
          </div>
        </div>

        {imageUrls.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)' }}>
            <p style={{ color: 'var(--text-muted)' }}>No source files found for this record.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {imageUrls.map((url, i) => (
              <div key={i} style={{ 
                background: 'var(--bg-card)', 
                borderRadius: 'var(--radius-lg)', 
                border: '1px solid var(--border)', 
                overflow: 'hidden', 
                boxShadow: 'var(--shadow-card)',
                display: 'flex', 
                flexDirection: 'column'
              }}>
                <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  File {i + 1} of {imageUrls.length}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'var(--bg-base)' }}>
                  <img 
                    src={url} 
                    alt={`Original Document ${i + 1}`} 
                    style={{ 
                      width: '100%', 
                      height: 'auto', 
                      maxHeight: '800px', 
                      objectFit: 'contain' 
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
