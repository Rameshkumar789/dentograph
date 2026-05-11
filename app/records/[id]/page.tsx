'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import ReportCard from '@/components/ReportCard';
import AskAIChat from '@/components/AskAIChat';
import ShareButton from '@/components/ShareButton';
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
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      const { data } = await supabase.from('records').select('*').eq('id', id).single();
      setRecord(data);
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
  const date = record.visit_date
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
            <h1 style={{ marginTop: '8px' }}>{date}</h1>
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

        {/* 3D Jaw Panel */}
        {findings && (
          <div className={styles.jawPanel} style={{ padding: 0, border: 'none', background: 'transparent' }}>
            <DentalModel3D findings={findings.findings} beforeAfter={beforeAfter} />
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
