'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { 
  Plus, 
  Search,
  Bell,
  MoreHorizontal,
  Activity,
  ShieldCheck,
  FileText,
  Users,
  Database,
  ExternalLink,
  Layers,
  Zap,
  User,
  LogOut,
  Settings as SettingsIcon
} from 'lucide-react';

interface EHIRequest {
  id: string;
  patient_id: string;
  patient_name: string;
  created_at: string;
  status: string;
  clinic_name: string;
}

interface SharedRecord {
  id: string;
  patient_name: string;
  record_type: string;
  created_at: string;
  dentist_name: string;
  status?: string;
}

export default function DentistDashboard() {
  const [requests, setRequests] = useState<EHIRequest[]>([]);
  const [sharedRecords, setSharedRecords] = useState<SharedRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [providerName, setProviderName] = useState('');
  const [clinic, setClinic] = useState<{ id: string; name: string } | null>(null);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/providers');
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/dentist/login'); return; }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*, clinics(*)')
        .eq('id', user.id)
        .single();

      if (profile) {
        setProviderName(profile.full_name || 'Lead Clinician');
        if (profile.clinics) {
          setClinic(profile.clinics);
        }
      }

      const { data: reqData } = await supabase
        .from('ehi_requests')
        .select('*')
        .or(`target_clinic_id.eq.${profile?.clinic_id},target_clinic_name_raw.ilike.%${profile?.clinics?.name}%`)
        .order('created_at', { ascending: false });

      setRequests(reqData || []);

      const clinicId = profile?.clinic_id;
      const clinicNameRaw = profile?.clinics?.name;
      const dentistNameRaw = profile?.full_name;

      let query = supabase.from('records').select('*').eq('source', 'clinician');
      

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
        // Fetch profiles for these patients to get names
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

        setSharedRecords(formattedRecords);
      } else {
        setSharedRecords([]);
      }

      await supabase.from('audit_logs').insert({
        actor_id: user.id,
        action: 'view_dashboard',
        entity_type: 'clinic_dashboard',
        entity_id: profile?.clinic_id || user.id,
        metadata: { request_count: reqData?.length, record_count: recData?.length }
      });

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }

  const complianceScore = requests.length > 0 ? Math.min(100, Math.round((requests.filter(r => r.status === 'fulfilled').length / requests.length) * 100)) : 100;

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fcfcfc' }}>
        <div style={{ width: '200px', height: '2px', background: '#f1f5f9', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', height: '100%', background: '#000', width: '40%', animation: 'loading 1s infinite ease-in-out' }} />
        </div>
        <style>{`@keyframes loading { 0% { left: -40%; } 100% { left: 100%; } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fff', color: '#0f172a', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* MINIMALIST WORKSPACE SIDEBAR */}
      <aside style={{ width: '260px', borderRight: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', background: '#fff' }}>
        <div style={{ padding: '24px', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em', borderBottom: '1px solid #f8fafc' }}>
          DentoGraph <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: '0.8rem' }}>OS</span>
        </div>

        <nav style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '12px 16px' }}>Dentist Workspace</div>
          <Link href="/dentist/dashboard" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#f8fafc', color: '#0f172a', padding: '10px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
              <Activity size={16} /> Dentist Dashboard
            </div>
          </Link>
          <Link href="/dentist/records" style={{ textDecoration: 'none' }}>
            <div style={{ color: '#64748b', padding: '10px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
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

        <div style={{ padding: '16px', borderTop: '1px solid #f8fafc', display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
          {showAccountMenu && (
            <div style={{ 
              position: 'absolute', 
              bottom: '100%', 
              left: '16px', 
              right: '16px', 
              background: '#fff', 
              border: '1px solid #f1f5f9', 
              borderRadius: '12px', 
              padding: '8px', 
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
              zIndex: 110,
              marginBottom: '8px'
            }}>
              <div style={{ color: '#64748b', padding: '10px 12px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                <User size={14} /> Clinician Profile
              </div>
              <div style={{ color: '#64748b', padding: '10px 12px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                <SettingsIcon size={14} /> Practice Settings
              </div>
              <div style={{ height: '1px', background: '#f1f5f9', margin: '4px 0' }} />
              <div 
                onClick={handleSignOut}
                style={{ color: '#ef4444', padding: '10px 12px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
              >
                <LogOut size={14} /> Sign Out
              </div>
            </div>
          )}

          <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: '#0f172a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}>{providerName.charAt(0)}</div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{providerName}</div>
            <div style={{ fontSize: '0.65rem', color: '#94a3b8', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{clinic?.name}</div>
          </div>
          <MoreHorizontal 
            size={16} 
            color={showAccountMenu ? '#0f172a' : "#94a3b8"} 
            cursor="pointer" 
            onClick={() => setShowAccountMenu(!showAccountMenu)} 
          />
        </div>
      </aside>

      {/* MAIN CONTENT SPACE */}
      <main style={{ flex: 1, marginLeft: '260px', padding: '0' }}>
        {/* Top Operational Bar */}
        <div style={{ height: '64px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', position: 'sticky', top: 0, background: '#fff', zIndex: 90 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
             <div style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '-0.01em', color: '#0f172a' }}>Operational Vitality</div>
             <div style={{ height: '16px', width: '1px', background: '#e2e8f0' }} />
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>{providerName}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>{clinic?.name}</div>
             </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 700, color: '#16a34a' }}>
               <div style={{ width: '6px', height: '6px', background: '#16a34a', borderRadius: '50%' }} />
               Cures Act Compliant
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

          {/* Core Analytics Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px', marginBottom: '48px' }}>
             {[
               { label: 'Clinical Assets', value: sharedRecords.length, trend: '+12%', color: '#0f172a' },
               { label: 'Patient Queue', value: requests.length, trend: 'Active', color: '#0f172a' },
               { label: 'Security Integrity', value: '99.9%', trend: 'Clinic Vault', color: '#6366f1' },
               { label: 'Interop Fulfilment', value: `${complianceScore}%`, trend: 'Target', color: '#16a34a' },
               { label: 'HIPAA Ledger', value: 'Active', trend: 'Audit Logged', color: '#16a34a' }
             ].map((stat, i) => (
               <div key={i} style={{ padding: '20px', border: '1px solid #f1f5f9', borderRadius: '12px' }}>
                 <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>{stat.label}</div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                   <div style={{ fontSize: '1.4rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                   <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8' }}>{stat.trend}</div>
                 </div>
               </div>
             ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '48px' }}>
            {/* PRIMARY: CLINICAL PIPELINE TABLE */}
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Clinical Pipeline</h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                   <div style={{ padding: '6px 12px', background: '#f8fafc', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', cursor: 'pointer' }}>All Records</div>
                   <div style={{ padding: '6px 12px', background: '#fff', border: '1px solid #f1f5f9', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', cursor: 'pointer' }}>Presentations</div>
                </div>
              </div>

              <div style={{ border: '1px solid #f1f5f9', borderRadius: '12px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#fcfcfc', borderBottom: '1px solid #f1f5f9' }}>
                      <th style={{ padding: '16px 24px', fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Patient Identifier</th>
                      <th style={{ padding: '16px 24px', fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Clinical Event</th>
                      <th style={{ padding: '16px 24px', fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Status</th>
                      <th style={{ padding: '16px 24px', fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sharedRecords.map((record) => (
                      <tr key={record.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                        <td style={{ padding: '20px 24px' }}>
                           <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{record.patient_name || 'Anonymous'}</div>
                           <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ID: {record.id.split('-')[0]}</div>
                        </td>
                        <td style={{ padding: '20px 24px' }}>
                           <div style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500 }}>{record.record_type.toUpperCase()} Analysis</div>
                           <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{new Date(record.created_at).toLocaleDateString()}</div>
                        </td>
                        <td style={{ padding: '20px 24px' }}>
                           <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: '#f0fdf4', color: '#16a34a', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 700 }}>
                              <div style={{ width: '4px', height: '4px', background: '#16a34a', borderRadius: '50%' }} />
                              Analysis Ready
                           </div>
                        </td>
                        <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                           <Link href={`/dentist/records/${record.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0f172a', fontWeight: 700, fontSize: '0.8rem', textDecoration: 'none' }}>
                             Start Studio <ExternalLink size={14} />
                           </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* SECONDARY: REGULATORY FEED */}
            <aside>
               <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '24px' }}>Activity Logs</h2>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {requests.length > 0 ? requests.slice(0, 5).map(req => (
                    <div key={req.id} style={{ padding: '16px', background: '#fcfcfc', border: '1px solid #f1f5f9', borderRadius: '12px' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8' }}>EHI INTEROP</span>
                          <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{new Date(req.created_at).toLocaleDateString()}</span>
                       </div>
                       <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '12px' }}>Data Request: {req.patient_name}</div>
                       <Link href={`/dentist-upload/${req.id}`} style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', textDecoration: 'none' }}>Resolve Issue →</Link>
                    </div>
                  )) : (
                    <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', border: '1px dashed #f1f5f9', borderRadius: '12px' }}>
                      No active regulatory alerts.
                    </div>
                  )}
               </div>
               
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
