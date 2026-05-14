'use client';
import { Zap, Activity, ShieldCheck, Layers, ArrowLeft, MoreHorizontal, Maximize2, Share2, Download, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import DentalModel3D from '@/components/clinician/DentalStudio3D';
import ReportCard from '@/components/clinician/ReportCardStudio';
import AskAIChat from '@/components/clinician/AskAIChatStudio';
import type { DentalAnalysis } from '@/lib/schemas';

interface DentalRecord {
  id: string;
  record_type: string;
  dentist_name?: string;
  clinic_name?: string;
  visit_date?: string;
  created_at: string;
  ai_findings?: DentalAnalysis;
}

export default function RecordPage() {
  const { id } = useParams<{ id: string }>();
  const [record, setRecord] = useState<DentalRecord | null>(null);
  const [patientName, setPatientName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [progression, setProgression] = useState(0);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/dentist/login'); return; }

      const { data: rec } = await supabase.from('records').select('*').eq('id', id).single();
      if (rec) {
        setRecord(rec);
        const findings = rec.ai_findings as any;
        setPatientName(findings?.patient_name || `Patient ${id.split('-')[0].toUpperCase()}`);
      }

      await supabase.from('audit_logs').insert({
        actor_id: user.id, action: 'view_record', entity_id: id, entity_type: 'record'
      });

      setLoading(false);
    }
    load();
  }, [id, router, supabase]);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid #1e293b', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!record) return <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Record not found.</div>;

  const findings = record.ai_findings as DentalAnalysis;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#fff', overflow: 'hidden' }}>

      {/* ENTERPRISE OS HEADER */}
      <header style={{ height: '64px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>{patientName}</div>
            <div style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reference ID: {record.id.split('-')[0].toUpperCase()}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => router.push('/dentist/dashboard')} className="btn btn-secondary btn-sm" style={{ padding: '8px 16px', fontSize: '0.75rem', borderRadius: '6px', background: '#0f172a', color: '#fff', border: 'none', fontWeight: 700 }}>
            Exit Record
          </button>
        </div>
      </header>

      {/* MAIN COCKPIT VIEW */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* LEFT: THE CLINICAL STUDIO */}
        <main style={{ flex: 1, background: '#f8fafc', position: 'relative', display: 'flex', flexDirection: 'column', borderRight: '1px solid #f1f5f9' }}>

          <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', padding: '6px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1' }} />
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Surgical Studio: 3D Atlas</span>
            </div>
          </div>

          <div style={{ flex: 1, position: 'relative' }}>
            <DentalModel3D
              findings={findings?.findings || []}
              selectedTooth={selectedTooth}
              onSelectTooth={setSelectedTooth}
              progression={progression}
            />
          </div>

          <div style={{ padding: '32px 60px', background: 'linear-gradient(to top, #fff, transparent)', position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10 }}>
            <div style={{ maxWidth: '450px', margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
                <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Timeline Simulation</div>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: progression > 0.5 ? '#ef4444' : '#6366f1' }}>
                  {progression === 0 ? 'CURRENT SCAN' : 'PROJECTED PATHOLOGY'}
                </div>
              </div>
              <div style={{ position: 'relative', height: '4px', background: '#f1f5f9', borderRadius: '2px' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${progression * 100}%`, background: progression > 0.5 ? '#ef4444' : '#6366f1', transition: 'width 0.3s ease', borderRadius: '2px' }} />
                <input
                  type="range" min="0" max="1" step="0.1" value={progression}
                  onChange={(e) => setProgression(parseFloat(e.target.value))}
                  style={{ position: 'absolute', top: '-8px', left: 0, width: '100%', cursor: 'pointer', height: '20px', appearance: 'none', background: 'transparent' }}
                />
              </div>
            </div>
          </div>
        </main>

        {/* RIGHT: THE STUDIO INSIGHTS PANEL */}
        <aside style={{ width: '450px', display: 'flex', flexDirection: 'column', background: '#fff', borderLeft: '1px solid #f1f5f9' }}>
          
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
             <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
               Clinical Diagnostic Manifest
             </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '32px 24px' }}>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px' }}>Studio Insights</h2>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>Detailed pathology detections and clinical narratives synthesized from imaging assets.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div>
                 <h2 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '8px' }}>Clinical Ledger</h2>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {(findings?.findings || []).map((f: any) => (
                      <div key={f.tooth_number} onClick={() => setSelectedTooth(f.tooth_number)} style={{ padding: '16px', borderRadius: '12px', border: '1px solid #f1f5f9', background: selectedTooth === f.tooth_number ? '#f8fafc' : '#fff', cursor: 'pointer', borderLeft: `4px solid ${f.severity_score >= 7 ? '#ef4444' : '#f59e0b'}` }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 900 }}>TOOTH #{f.tooth_number}</span>
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8' }}>D2392 • COMPOSITE</span>
                         </div>
                         <div style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '4px' }}>{f.condition}</div>
                         <div style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.4 }}>{(f.clinical_explanation || f.explanation || '').slice(0, 100)}...</div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
