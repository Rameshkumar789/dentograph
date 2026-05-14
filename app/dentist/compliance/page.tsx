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
  Shield,
  Clock,
  CheckCircle
} from 'lucide-react';

export default function ComplianceAuditPage() {
  const [providerName, setProviderName] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/dentist/login'); return; }
      const { data: profile } = await supabase.from('profiles').select('*, clinics(*)').eq('id', user.id).single();
      if (profile) {
        setProviderName(profile.full_name || 'Lead Clinician');
        setClinicName(profile.clinics?.name || 'Private Practice');
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return null;

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
            <div style={{ background: '#f8fafc', color: '#0f172a', padding: '10px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
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
               <input placeholder="Search compliance logs..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '200px' }} />
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
          <div style={{ marginBottom: '48px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '4px' }}>Compliance & Audit</h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>EHI Exchange management and regulatory defense protocols.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '48px' }}>
             <div style={{ padding: '32px', borderRadius: '24px', background: '#0f172a', color: '#fff', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }} />
                <ShieldCheck size={32} color="#16a34a" style={{ marginBottom: '24px' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>Cures Act Shield Active</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.6, maxWidth: '400px' }}>All clinical assets are USCDI v3 compliant. Automated EHI fulfillment is enabled for verified patient requests.</p>
             </div>
             <div style={{ padding: '32px', borderRadius: '24px', border: '1px solid #f1f5f9', background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                   <div>
                      <div style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '4px' }}>Pending EHI Requests</div>
                      <div style={{ fontSize: '2rem', fontWeight: 800 }}>0</div>
                   </div>
                   <div style={{ padding: '6px 12px', background: '#f0fdf4', color: '#16a34a', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 800 }}>
                      HEALTHY
                   </div>
                </div>
                <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.5 }}>No active information blocking alerts detected in your practice queue.</p>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
