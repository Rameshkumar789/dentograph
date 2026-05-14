'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

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
}

export default function DentistDashboard() {
  const [requests, setRequests] = useState<EHIRequest[]>([]);
  const [sharedRecords, setSharedRecords] = useState<SharedRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const [clinic, setClinic] = useState<{ id: string; name: string } | null>(null);

  async function fetchDashboardData() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/dentist/login'); return; }

      // 1. Fetch Provider Profile and Clinic Info
      const { data: profile } = await supabase
        .from('profiles')
        .select('*, clinics(*)')
        .eq('id', user.id)
        .single();

      if (profile?.clinics) {
        setClinic(profile.clinics);
      }

      // 2. Fetch EHI Requests (B2B2C Trojan Horse data)
      // We look for requests targeted at this specific clinic
      const { data: reqData } = await supabase
        .from('ehi_requests')
        .select('*')
        .or(`target_clinic_id.eq.${profile?.clinic_id},target_clinic_name_raw.ilike.%${profile?.clinics?.name}%`)
        .order('created_at', { ascending: false });

      setRequests(reqData || []);

      // 3. Fetch Records shared with the clinic
      const { data: recData } = await supabase
        .from('records')
        .select('*')
        .eq('clinic_id', profile?.clinic_id)
        .order('created_at', { ascending: false });

      setSharedRecords(recData || []);

      // 4. HIPAA MANDATORY: Audit Log Access
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

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/dentist/login');
  }

  const pendingCount = requests.filter(r => r.status === 'sent' || r.status === 'pending').length;
  const complianceScore = requests.length > 0 ? Math.min(100, Math.round((requests.filter(r => r.status === 'fulfilled').length / requests.length) * 100)) : 100;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Navbar */}
      <nav className="navbar" style={{ background: '#fff', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', padding: '16px 24px' }}>
        <div className="navbar-logo" style={{ color: 'var(--primary)' }}>
          🦷 DentoGraph <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginLeft: '8px' }}>For Providers</span>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green)' }} />
              {complianceScore}% Cures Act Compliant
            </span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Information Blocking Shield Active</span>
          </div>
          <div style={{ width: '1px', height: '32px', background: 'var(--border)' }} />
          <button onClick={handleSignOut} className="btn btn-secondary btn-sm">Sign Out</button>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px', maxWidth: '1000px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '2rem' }}>Provider Dashboard</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Managing patient data portability & case acceptance</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
             <button onClick={fetchDashboardData} className="btn btn-secondary">🔄 Refresh</button>
             <button className="btn btn-primary">+ New Patient Scan</button>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>{sharedRecords.length}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '8px', textTransform: 'uppercase' }}>Active 3D Twins</div>
          </div>
          <div className="card" style={{ padding: '24px', textAlign: 'center', borderLeft: '4px solid var(--accent)' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent)' }}>{pendingCount}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '8px', textTransform: 'uppercase' }}>Pending EHI Requests</div>
          </div>
          <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--green)' }}>{complianceScore}%</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '8px', textTransform: 'uppercase' }}>Compliance Score</div>
          </div>
        </div>

        {/* EHI Requests Section */}
        <div className="card" style={{ padding: '0', overflow: 'hidden', marginBottom: '32px' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
            <h2 style={{ fontSize: '1.1rem', margin: 0 }}>🚨 Action Required: Patient EHI Requests</h2>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span className="badge badge-yellow">{pendingCount} Active</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cures Act fulfillment window: 15 Days</span>
            </div>
          </div>
          <div style={{ padding: '0' }}>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading requests...</div>
            ) : requests.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center', background: '#fff' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📬</div>
                <h3>No pending requests</h3>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '8px auto' }}>
                  When patients use the DentoGraph "Request Records" tool, their legally-mandated requests will appear here.
                </p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#fff', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '16px 24px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Patient Name</th>
                    <th style={{ padding: '16px 24px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Request Date</th>
                    <th style={{ padding: '16px 24px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Status</th>
                    <th style={{ padding: '16px 24px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Legal Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '16px 24px', fontWeight: 600 }}>{req.patient_name}</td>
                      <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>
                        {new Date(req.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span className={`badge ${req.status === 'fulfilled' ? 'badge-green' : 'badge-yellow'}`}>
                          {req.status === 'fulfilled' ? 'Fulfilled' : 'Pending Upload'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        {req.status !== 'fulfilled' ? (
                          <Link href={`/dentist-upload/${req.patient_id || 'manual'}`} className="btn btn-primary btn-sm">
                            Upload Records (Fulfill EHI)
                          </Link>
                        ) : (
                          <button className="btn btn-secondary btn-sm" disabled>Request Closed</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Shared Patient Records (QR Scans) */}
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', background: '#f8fafc' }}>
            <h2 style={{ fontSize: '1.1rem', margin: 0 }}>👥 Shared Patient Records (Case Acceptance View)</h2>
          </div>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {sharedRecords.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>
                No records shared with this clinic yet.
              </div>
            ) : (
              sharedRecords.map((record) => (
                <div key={record.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: '#fff' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '1rem' }}>Patient Record: {new Date(record.created_at).toLocaleDateString()}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Type: {record.record_type} · Shared via DentoGraph Patient Portal
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link href={`/records/${record.id}`} className="btn btn-secondary btn-sm">Review 3D Twin</Link>
                    <button className="btn btn-secondary btn-sm">🏥 Insurance Narrative</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
