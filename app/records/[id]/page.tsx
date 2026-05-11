'use client';
import { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import ReportCard from '@/components/ReportCard';
import AskAIChat from '@/components/AskAIChat';
import ShareButton from '@/components/ShareButton';
import InteractiveJawMap from '@/components/InteractiveJawMap';
import DentalModel3D from '@/components/DentalModel3D';
import type { DentalAnalysis } from '@/lib/schemas';
import styles from './record.module.css';

interface DentalRecord {
  id: string;
  record_type: string;
  dentist_name?: string;
  clinic_name?: string;
  visit_date?: string;
  created_at: string;
  ai_findings?: DentalAnalysis;
  share_token?: string;
  share_enabled?: boolean;
}

export default function RecordPage() {
  const { id } = useParams<{ id: string }>();
  const [record, setRecord] = useState<DentalRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [beforeAfter, setBeforeAfter] = useState<'before' | 'after'>('before');
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      const { data } = await supabase.from('records').select('*').eq('id', id).single();
      setRecord(data);
      
      // Image URLs will be handled in the dedicated source view
      
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return (
    <div className={styles.page}>
      <nav className="navbar"><div className="navbar-logo">🦷 Dento<span>Graph</span></div></nav>
      <div className="container" style={{ paddingTop: '48px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '120px' }} />)}
      </div>
    </div>
  );

  if (!record) return <div className={styles.page}><p style={{ padding: '48px', textAlign: 'center' }}>Record not found.</p></div>;

  const findings = record.ai_findings as DentalAnalysis;
  const displayDate = record?.visit_date
    ? new Date(record.visit_date as string).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : new Date(record.created_at as string).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className={styles.page}>
      <nav className="navbar">
        <div className="navbar-logo">🦷 Dento<span>Graph</span></div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => router.push('/dashboard')} className="btn btn-secondary btn-sm">← Dashboard</button>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: '32px', paddingBottom: '80px' }}>
        {/* Record header */}
        <div className={styles.recordHeader}>
          <div>
            <div className={styles.recordType}>
              {record.record_type === 'xray' ? '🩻 X-Ray' : '📋 Prescription'}
              {record.dentist_name && ` · ${record.dentist_name}`}
              {record.clinic_name && ` · ${record.clinic_name}`}
            </div>
            <h1 style={{ marginTop: '8px' }}>{displayDate}</h1>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {findings?.overall_urgency && (
              <span className={`badge ${findings.overall_urgency === 'Urgent' ? 'badge-red' : findings.overall_urgency === 'Soon' ? 'badge-yellow' : 'badge-green'}`}>
                {findings.overall_urgency}
              </span>
            )}
            {findings?.overall_score && (
              <span className="badge badge-accent">Score: {findings.overall_score}</span>
            )}
            <button 
              onClick={() => router.push(`/records/${id}/source`)} 
              className="btn btn-secondary btn-sm"
              style={{ marginLeft: '12px' }}
            >
              🗂️ View Patient Records
            </button>
          </div>
        </div>

        {/* Before/After toggle */}
        {findings && (
          <div className={styles.beforeAfterToggle}>
            <button
              className={`${styles.toggleBtn} ${beforeAfter === 'before' ? styles.toggleBtnActive : ''}`}
              onClick={() => setBeforeAfter('before')}
            >Current State</button>
            <button
              className={`${styles.toggleBtn} ${beforeAfter === 'after' ? styles.toggleBtnActive : ''}`}
              onClick={() => setBeforeAfter('after')}
            >After Treatment ✨</button>
          </div>
        )}

        {/* Interactive Jaw Map / 3D Model Panel */}
        {findings && (
          <div className={styles.jawPanel} style={{ padding: 0, border: 'none', background: 'transparent' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', gap: '8px' }}>
              <div style={{ background: 'var(--surface)', padding: '4px', borderRadius: 'var(--radius-full)', display: 'inline-flex' }}>
                <button 
                  onClick={() => setViewMode('2d')}
                  style={{ padding: '6px 16px', borderRadius: 'var(--radius-full)', background: viewMode === '2d' ? 'var(--primary)' : 'transparent', color: viewMode === '2d' ? '#000' : 'var(--text-secondary)', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
                >
                  Clinical View (2.5D)
                </button>
                <button 
                  onClick={() => setViewMode('3d')}
                  style={{ padding: '6px 16px', borderRadius: 'var(--radius-full)', background: viewMode === '3d' ? 'var(--primary)' : 'transparent', color: viewMode === '3d' ? '#000' : 'var(--text-secondary)', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
                >
                  Analytical View (3D)
                </button>
              </div>
            </div>
            
            {viewMode === '2d' ? (
              <InteractiveJawMap findings={findings.findings} beforeAfter={beforeAfter} />
            ) : (
              <DentalModel3D findings={findings.findings} beforeAfter={beforeAfter} />
            )}
          </div>
        )}

        {/* Two-column: Report + Chat */}
        {findings && (
          <div className={styles.twoCol}>
            <div className={styles.leftCol}>
              <ReportCard findings={findings} />
              <ShareButton
                recordId={record.id as string}
                shareToken={record.share_token as string}
                shareEnabled={record.share_enabled as boolean}
              />
            </div>
            <div className={styles.rightCol}>
              <AskAIChat findings={findings} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
