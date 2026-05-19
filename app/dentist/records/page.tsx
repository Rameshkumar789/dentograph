'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { 
  Activity,
  Layers,
  Zap,
  Plus,
  ShieldCheck, 
  Search,
  Bell,
  Users,
  ExternalLink,
  Filter,
  Download,
  Calendar
} from 'lucide-react';

interface ClinicalRecord {
  id: string;
  patient_name: string;
  record_type: string;
  created_at: string;
  dentist_name: string;
  clinic_name: string;
}

export default function ClinicalRecordsPage() {
  const [records, setRecords] = useState<ClinicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [providerName, setProviderName] = useState('');
  const [clinicName, setClinicName] = useState('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/dentist/login'); return; }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*, clinics(*)')
        .eq('id', user.id)
        .single();

      if (profile) {
        setProviderName(profile.full_name || 'Lead Clinician');
        setClinicName(profile.clinics?.name || 'Private Practice');
      }

      let query = supabase.from('records').select('*').eq('source', 'clinician');
      
      const clinicId = profile?.clinic_id;
      const clinicNameRaw = profile?.clinics?.name;
      const dentistNameRaw = profile?.full_name;

      if (clinicId || clinicNameRaw || dentistNameRaw) {
        let orFilter = [];
        if (clinicId) orFilter.push(`clinic_id.eq.${clinicId}`);
        if (clinicNameRaw) orFilter.push(`clinic_name.ilike.%${clinicNameRaw}%`);
        if (dentistNameRaw) orFilter.push(`dentist_name.ilike.%${dentistNameRaw}%`);
        query = query.or(orFilter.join(','));
      }

      let { data: recData } = await query.order('created_at', { ascending: false });

      if (!recData || recData.length === 0) {
        const { data: fallbackData } = await supabase.from('records').select('*').eq('source', 'clinician').limit(10).order('created_at', { ascending: false });
        recData = fallbackData;
      }

      if (recData && recData.length > 0) {
        const patientIds = Array.from(new Set(recData.map(r => r.patient_id)));
        const { data: patientProfiles } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', patientIds);

        const profileMap = (patientProfiles || []).reduce((acc: any, p: any) => {
          acc[p.id] = p.full_name;
          return acc;
        }, {});

        const formattedRecords = recData.map((r: any) => ({
          ...r,
          patient_name: r.ai_findings?.patient_name || profileMap[r.patient_id] || `Patient ${r.id.split('-')[0]}`
        }));

        setRecords(formattedRecords);
      } else {
        setRecords([]);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/dentist/login');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fcfcfc' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #f1f5f9', borderTopColor: '#0f172a', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fff', color: '#0f172a', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* PERSISTENT OS SIDEBAR */}
      <aside style={{ width: '260px', borderRight: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', background: '#fff', zIndex: 100 }}>
        <div style={{ padding: '24px', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em', borderBottom: '1px solid #f8fafc' }}>
          DentoGraph <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: '0.8rem' }}>OS</span>
        </div>

        <nav style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '12px 16px' }}>Dentist Workspace</div>
          <Link href="/dentist/dashboard" style={{ textDecoration: 'none' }}>
            <div style={{ color: '#64748b', padding: '10px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
              <Activity size={16} /> Dentist Dashboard
            </div>
          </Link>
          <Link href="/dentist/records" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#f8fafc', color: '#0f172a', padding: '10px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
              <Layers size={16} /> Clinical Records
            </div>
          </Link>

          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '24px 16px 12px 16px' }}>Front Desk</div>
          <Link href="/dentist/patients" style={{ textDecoration: 'none' }}>
            <div style={{ color: '#64748b', padding: '10px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
              <Users size={16} /> Patient Directory
            </div>
          </Link>
          <Link href="/dentist/compliance" style={{ textDecoration: 'none' }}>
            <div style={{ color: '#64748b', padding: '10px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
              <ShieldCheck size={16} /> Compliance & Audit
            </div>
          </Link>
          <Link href="/dentist/interop" style={{ textDecoration: 'none' }}>
            <div style={{ color: '#64748b', padding: '10px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
              <Zap size={16} /> Referral Interop
            </div>
          </Link>
        </nav>

        <div style={{ padding: '16px', borderTop: '1px solid #f8fafc', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: '#0f172a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}>{providerName.charAt(0)}</div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{providerName}</div>
            <div style={{ fontSize: '0.65rem', color: '#94a3b8', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{clinicName}</div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, marginLeft: '260px' }}>
        {/* Top Operational Bar */}
        <div style={{ height: '64px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', background: '#fff', position: 'sticky', top: 0, zIndex: 90 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
             <div style={{ padding: '6px 12px', borderRadius: '6px', background: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', border: '1px solid #f1f5f9', color: '#64748b' }}>
               <Search size={14} />
               <input placeholder="Search clinical ledger..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '200px' }} />
             </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 700, color: '#16a34a' }}>
               <div style={{ width: '6px', height: '6px', background: '#16a34a', borderRadius: '50%' }} />
               Audit logging active
            </div>
            <Bell size={18} color="#94a3b8" />
            <button 
              onClick={() => router.push('/dentist/new-scan')}
              style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            >
              <Plus size={16} /> New Clinical Intake
            </button>
          </div>
        </div>

        <div style={{ padding: '40px' }}>
          {/* Header & Intelligence Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '4px' }}>Clinical Records</h1>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>The longitudinal clinical archive for {clinicName}.</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
               <div style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>
                 <Filter size={16} /> Filter Results
               </div>
               <div style={{ padding: '10px 16px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', cursor: 'pointer' }}>
                 <Download size={16} /> Export EHI
               </div>
            </div>
          </div>

          {/* Clinical Records Ledger */}
          <div style={{ border: '1px solid #f1f5f9', borderRadius: '16px', overflow: 'hidden', background: '#fff' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#fcfcfc', borderBottom: '1px solid #f1f5f9' }}>
                  <th style={{ padding: '16px 24px', fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Patient / Clinical Event</th>
                  <th style={{ padding: '16px 24px', fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Analysis State</th>
                  <th style={{ padding: '16px 24px', fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Clinical Intent</th>
                  <th style={{ padding: '16px 24px', fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {records.length > 0 ? records.map((rec) => (
                  <tr key={rec.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.2s' }}>
                    <td style={{ padding: '24px' }}>
                       <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>{rec.patient_name || 'Anonymous'}</div>
                       <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.02em', fontWeight: 600 }}>
                         {new Date(rec.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • REF: {rec.id.split('-')[0]}
                       </div>
                    </td>
                    <td style={{ padding: '24px' }}>
                       <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#f0fdf4', color: '#16a34a', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800, border: '1px solid #dcfce7' }}>
                          <ShieldCheck size={14} /> Analysis Ready
                       </div>
                    </td>
                    <td style={{ padding: '24px' }}>
                       <div style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 700 }}>
                         COMPREHENSIVE Diagnostic
                       </div>
                    </td>
                    <td style={{ padding: '24px', textAlign: 'right' }}>
                       <Link href={`/dentist/records/${rec.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#0f172a', color: '#fff', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem', textDecoration: 'none', transition: 'transform 0.1s active' }}>
                         Launch Studio <ExternalLink size={14} />
                       </Link>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} style={{ padding: '100px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#94a3b8' }}>No clinical records detected in the ledger.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
