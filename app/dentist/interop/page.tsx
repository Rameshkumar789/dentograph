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
  Share2,
  Clock,
  Filter,
  Download
} from 'lucide-react';

export default function ReferralInteropPage() {
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
            <div style={{ color: '#64748b', padding: '10px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
              <ShieldCheck size={16} /> Compliance & Audit
            </div>
          </Link>
          <Link href="/dentist/interop" style={{ textDecoration: 'none' }}>
            <div style={{ background: '#f8fafc', color: '#0f172a', padding: '10px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
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
               <input placeholder="Search referral interop..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '200px' }} />
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '4px' }}>Referral Interop</h1>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Management of secure clinical handoffs and external data exchange.</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
               <div style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>
                 <Filter size={16} /> Filter Handouts
               </div>
               <div style={{ padding: '10px 16px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', cursor: 'pointer' }}>
                 <Share2 size={16} /> Initiate Share
               </div>
            </div>
          </div>

          <div style={{ padding: '80px', textAlign: 'center', background: '#f8fafc', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>🌐</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Interop Network Ready</h3>
            <p style={{ color: '#64748b', maxWidth: '400px', margin: '0 auto 24px', fontSize: '0.9rem', lineHeight: 1.5 }}>The practice is USCDI v3 compliant. You can securely share clinical stories with any verified specialist.</p>
            <button className="btn btn-primary" style={{ padding: '10px 24px', borderRadius: '8px', fontWeight: 800, fontSize: '0.85rem' }}>Invite Specialist</button>
          </div>
        </div>
      </main>
    </div>
  );
}
