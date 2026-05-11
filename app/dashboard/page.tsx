'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Timeline from '@/components/Timeline';
import QRPortal from '@/components/QRPortal';
import styles from './dashboard.module.css';

interface DentalRecord {
  id: string;
  record_type: string;
  dentist_name?: string;
  clinic_name?: string;
  visit_date?: string;
  created_at: string;
  ai_findings?: Record<string, unknown>;
  share_enabled?: boolean;
}


export default function DashboardPage() {
  const [user, setUser] = useState<{ id: string; email?: string; user_metadata?: { full_name?: string } } | null>(null);
  const [records, setRecords] = useState<DentalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUser(user);

      const { data } = await supabase
        .from('records')
        .select('*')
        .order('created_at', { ascending: false });
      setRecords(data || []);
      setLoading(false);
    }
    load();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/');
  }

  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Patient';

  return (
    <div className={styles.page}>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">🦷 Dento<span>Graph</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            👤 {name}
          </span>
          <button onClick={handleLogout} className="btn btn-secondary btn-sm">Sign out</button>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1>Good to see you, <span className="gradient-text">{name}</span></h1>
            <p>Your dental records are private, owned by you, and always shareable on your terms.</p>
          </div>
          <Link href="/records/upload" className="btn btn-primary btn-lg">
            + Upload New Record
          </Link>
        </div>

        {/* Stats Row */}
        <div className={styles.statsRow}>
          <div className="card" style={{ flex: 1 }}>
            <div className={styles.statNumber}>{records.length}</div>
            <div className={styles.statLabel}>Records uploaded</div>
          </div>
          <div className="card" style={{ flex: 1 }}>
            <div className={styles.statNumber}>
              {records.filter((r) => (r.ai_findings as Record<string, unknown>)?.overall_urgency === 'Urgent').length}
            </div>
            <div className={styles.statLabel} style={{ color: 'var(--red)' }}>Urgent items</div>
          </div>
          <div className="card" style={{ flex: 1 }}>
            <div className={styles.statNumber}>
              {records.filter((r) => r.share_enabled).length}
            </div>
            <div className={styles.statLabel}>Shared for 2nd opinion</div>
          </div>
        </div>

        <div className={styles.mainGrid}>
          {/* Timeline */}
          <div style={{ flex: 2 }}>
            <div className={styles.sectionHeader}>
              <h2>Your dental history</h2>
              <Link href="/records/upload" className="btn btn-ghost btn-sm">+ Add record</Link>
            </div>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '100px' }} />)}
              </div>
            ) : records.length === 0 ? (
              <div className={styles.emptyState}>
                <div style={{ fontSize: '3rem' }}>🦷</div>
                <h3>No records yet</h3>
                <p>Upload your first X-ray or prescription to get started. Show your dentist your QR code to have them upload directly.</p>
                <Link href="/records/upload" className="btn btn-primary" style={{ marginTop: '8px' }}>Upload first record</Link>
              </div>
            ) : (
              <Timeline records={records as DentalRecord[]} />
            )}
          </div>

          {/* QR Portal */}
          <div style={{ flex: 1 }}>
            {user && <QRPortal userId={user.id} />}
          </div>
        </div>
      </div>
    </div>
  );
}
