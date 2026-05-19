'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import DentalModel3D from '@/components/DentalModel3D';
import InteractiveJawMap from '@/components/InteractiveJawMap';
import AskAIChat from '@/components/AskAIChat';
import ShareButton from '@/components/ShareButton';
import EHIExportButton from '@/components/EHIExportButton';
import type { CDTCode, DentalAnalysis, Finding } from '@/lib/schemas';
import styles from './record.module.css';
import { FileImage, LogOut } from 'lucide-react';

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
  const [patientName, setPatientName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('3d');
  const [filter, setFilter] = useState<'all' | 'urgent' | 'monitor' | 'maintenance'>('all');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const { data: rec } = await supabase.from('records').select('*').eq('id', id).single();
      setRecord(rec);

      const { data: prof } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
      setPatientName(prof?.full_name || user.email?.split('@')[0] || 'Patient');
      
      await supabase.from('audit_logs').insert({
        actor_id: user.id, action: 'view_record', entity_id: id, entity_type: 'record'
      });

      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return (
    <div className={styles.page}>
      <div className={styles.metaBar}><div className="skeleton" style={{ width: '120px', height: '24px' }} /></div>
      <div className={styles.workspace}>
        <div className="skeleton" style={{ height: '520px', borderRadius: '24px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '40px' }}>
          <div className="skeleton" style={{ height: '500px' }} />
          <div className="skeleton" style={{ height: '400px' }} />
        </div>
      </div>
    </div>
  );

  if (!record) return <div className={styles.page}><p style={{ padding: '48px', textAlign: 'center' }}>Record not found.</p></div>;

  const findings = record.ai_findings as DentalAnalysis;
  const date = record.visit_date ? new Date(record.visit_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Unknown Date';

  const urgentCount = findings.findings.filter(f => (f.severity_score || 0) >= 7).length;
  const monitorCount = findings.findings.filter(f => (f.severity_score || 0) >= 4 && (f.severity_score || 0) < 7).length;

  return (
    <div className={styles.page}>
      {/* 1. MINIMAL HEADER */}
      <div className={styles.metaBar}>
        <img src="/dentograph-logo.png" alt="DentoGraph" style={{ width: '176px', height: 'auto' }} />
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <EHIExportButton findings={findings} recordId={record.id} recordType={record.record_type} />
          <ShareButton recordId={record.id} shareToken={record.share_token || ''} shareEnabled={record.share_enabled || false} />
          <button onClick={() => router.push(`/records/${id}/source`)} className="btn btn-secondary btn-sm" style={{ border: 'none', background: '#f1f5f9', fontWeight: 700, fontSize: '0.75rem', color: '#0f172a', height: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileImage size={14} /> Source Files
          </button>
          <div style={{ width: '1px', height: '24px', background: '#e2e8f0', margin: '0 4px' }} />
          <button onClick={() => router.push('/dashboard')} className="btn btn-secondary btn-sm" style={{ border: 'none', background: '#f1f5f9', fontWeight: 700, fontSize: '0.75rem', color: '#0f172a', height: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LogOut size={14} /> Close Report
          </button>
        </div>
      </div>

      <div className={styles.workspace}>
        
        {/* ROW 1: THE CLINICAL PASSPORT & VISUAL SUITE */}
        <div className={styles.visualLab}>
          <div className={styles.labHeader}>
            <div className={styles.passportStrip}>
              <div className={styles.patientIdentity}>
                <div className={styles.patientName}>{patientName}</div>
                <div className={styles.integrityBadge}>✓ Verified Record</div>
              </div>
              
              <div style={{ width: '1px', height: '32px', background: '#e2e8f0', margin: '0 8px' }} />

              <div className={styles.passportGroup}>
                <span className={styles.passportLabel}>Visit Date</span>
                <span className={styles.passportValue}>{date}</span>
              </div>
              
              <div className={styles.passportGroup}>
                <span className={styles.passportLabel}>Dentist Office</span>
                <span className={styles.passportValue}>{record.clinic_name || 'Verified Upload'}</span>
              </div>

              <div style={{ width: '1px', height: '32px', background: '#e2e8f0', margin: '0 8px' }} />

              <div className={styles.passportGroup}>
                <span className={styles.passportLabel}>Health Grade</span>
                <span className={styles.passportValue} style={{ color: '#3b82f6', fontWeight: 800 }}>{findings.overall_score || '--'}</span>
              </div>

              <div className={styles.passportGroup}>
                <span className={styles.passportLabel}>Urgent</span>
                <span className={styles.passportValue} style={{ color: urgentCount > 0 ? '#ef4444' : '#94a3b8' }}>{urgentCount}</span>
              </div>

              <div className={styles.passportGroup}>
                <span className={styles.passportLabel}>Monitor</span>
                <span className={styles.passportValue} style={{ color: monitorCount > 0 ? '#f59e0b' : '#94a3b8' }}>{monitorCount}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
              <button onClick={() => setViewMode('3d')} className={viewMode === '3d' ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'} style={{ color: viewMode === '3d' ? '#000' : '#475569', borderRadius: '8px' }}>3D View</button>
              <button onClick={() => setViewMode('2d')} className={viewMode === '2d' ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'} style={{ color: viewMode === '2d' ? '#000' : '#475569', borderRadius: '8px' }}>Tooth Map</button>
            </div>
          </div>
          <div className={styles.labContent}>
            {viewMode === '3d' ? <DentalModel3D findings={findings.findings} /> : <InteractiveJawMap findings={findings.findings} />}
          </div>
        </div>

        {/* ROW 2: DIAGNOSTIC FEED & AI SIDEBAR */}
        <div className={styles.lowerDeck}>
          
          {/* Diagnostic Feed */}
          <div className={styles.findingsColumn}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div className={styles.findingsTitle} style={{ marginBottom: 0 }}>Your Health Summary</div>
              <div style={{ display: 'flex', gap: '8px', background: '#fff', padding: '4px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <button onClick={() => setFilter('all')} style={{ padding: '6px 12px', border: 'none', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', background: filter === 'all' ? '#f1f5f9' : 'transparent', color: filter === 'all' ? '#0f172a' : '#64748b' }}>All</button>
                <button onClick={() => setFilter('urgent')} style={{ padding: '6px 12px', border: 'none', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', background: filter === 'urgent' ? '#fee2e2' : 'transparent', color: filter === 'urgent' ? '#ef4444' : '#64748b' }}>Urgent</button>
                <button onClick={() => setFilter('monitor')} style={{ padding: '6px 12px', border: 'none', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', background: filter === 'monitor' ? '#fef3c7' : 'transparent', color: filter === 'monitor' ? '#f59e0b' : '#64748b' }}>Monitor</button>
                <button onClick={() => setFilter('maintenance')} style={{ padding: '6px 12px', border: 'none', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', background: filter === 'maintenance' ? '#dbeafe' : 'transparent', color: filter === 'maintenance' ? '#3b82f6' : '#64748b' }}>Routine</button>
              </div>
            </div>

            {/* SECTION 1: URGENT */}
            {(filter === 'all' || filter === 'urgent') && findings.findings.filter(f => (f.severity_score || 0) >= 7).length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#ef4444' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Urgent Care Needed</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {findings.findings.filter(f => (f.severity_score || 0) >= 7).map((f, i) => (
                    <FindingCard key={i} finding={f} color="#ef4444" bg="#fee2e2" />
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 2: MONITOR */}
            {(filter === 'all' || filter === 'monitor') && findings.findings.filter(f => (f.severity_score || 0) >= 4 && (f.severity_score || 0) < 7).length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#f59e0b' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Areas to Monitor</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {findings.findings.filter(f => (f.severity_score || 0) >= 4 && (f.severity_score || 0) < 7).map((f, i) => (
                    <FindingCard key={i} finding={f} color="#d97706" bg="#fef3c7" />
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 3: MAINTENANCE */}
            {(filter === 'all' || filter === 'maintenance') && findings.findings.filter(f => (f.severity_score || 0) < 4).length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#3b82f6' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Maintenance & Prevention</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {findings.findings.filter(f => (f.severity_score || 0) < 4).map((f, i) => (
                    <FindingCard key={i} finding={f} color="#2563eb" bg="#dbeafe" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI Interaction Sidebar */}
          <div className={styles.sidebar}>
            <AskAIChat findings={findings} />
          </div>

        </div>
      </div>
    </div>
  );
}

function FindingCard({ finding, color, bg }: { finding: Finding, color: string, bg: string }) {
  return (
    <div className={styles.insightCard} style={{ padding: '24px 32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span className={styles.severityTag} style={{ background: bg, color: color }}>
          Priority {finding.severity_score || 1}/10
        </span>
        {finding.tooth_number && (
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Tooth #{finding.tooth_number}</span>
        )}
      </div>
      <div className={styles.clinicalNote} style={{ fontSize: '1.1rem', marginTop: '12px' }}>{finding.condition}</div>
      <div className={styles.patientNote} style={{ fontSize: '0.85rem', marginTop: '8px' }}>{finding.explanation}</div>
      {finding.cdt_codes?.length > 0 && (
        <div style={{ marginTop: '16px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {finding.cdt_codes.map((c: CDTCode, j: number) => (
            <span key={j} style={{ padding: '4px 10px', background: '#f8fafc', border: '1px solid #f1f5f9', color: '#64748b', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 600 }}>{c.code}: {c.name}</span>
          ))}
        </div>
      )}
    </div>
  );
}
