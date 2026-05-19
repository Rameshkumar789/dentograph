'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ArrowRight, FilePlus2, FolderOpen, MessageCircle, Share2 } from 'lucide-react';
import Timeline from '@/components/Timeline';
import RequestTracking from '@/components/RequestTracking';
import styles from './dashboard.module.css';

interface DentalRecord {
  id: string;
  record_type: string;
  dentist_name?: string;
  clinic_name?: string;
  visit_date?: string;
  created_at: string;
  ai_findings?: {
    findings?: Array<{ severity_score?: number }>;
  };
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
        .eq('patient_id', user.id)
        .order('created_at', { ascending: false });
      setRecords(data || []);
      setLoading(false);
    }
    load();
  }, [router, supabase]);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Patient';
  const latest = records[0];
  const urgentCount = useMemo(() => records.reduce((count, record) => {
    const findings = record.ai_findings?.findings || [];
    return count + findings.filter((f) => (f.severity_score || 0) >= 7).length;
  }, 0), [records]);

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logoWrap}><img src="/dentograph-logo.png" alt="DentoGraph" /></Link>
        <div className={styles.navActions}>
          <span>{name}</span>
          <button onClick={handleLogout}>Sign out</button>
        </div>
      </nav>

      <main className={styles.shell}>
        <section className={styles.hero}>
          <div>
            <p className={styles.kicker}>Your dental record</p>
            <h1>Good to see you, {name}.</h1>
            <p>Your records are organized into a visual timeline you can understand, export, and share when needed.</p>
          </div>
          <div className={styles.heroActions}>
            <Link href="/records/upload"><FilePlus2 size={18} /> Upload record</Link>
            <Link href="/request-records"><FolderOpen size={18} /> Request records</Link>
          </div>
        </section>

        <section className={styles.actionGrid}>
          <Link href={latest ? `/records/${latest.id}` : '/records/upload'} className={styles.primaryAction}>
            <span>Next best action</span>
            <h2>{latest ? 'Review your latest dental record' : 'Add your first dental record'}</h2>
            <p>{latest ? 'Open the 3D map, findings, source files, and sharing controls.' : 'Upload an X-ray, treatment plan, PDF, or scan to create your first DentoGraph timeline entry.'}</p>
            <strong>{latest ? 'Open latest record' : 'Upload now'} <ArrowRight size={16} /></strong>
          </Link>
          <div className={styles.metricCard}>
            <span>Records</span>
            <strong>{records.length}</strong>
            <p>Total timeline entries</p>
          </div>
          <div className={styles.metricCard}>
            <span>Needs attention</span>
            <strong>{urgentCount}</strong>
            <p>High-priority findings</p>
          </div>
          <div className={styles.metricCard}>
            <span>Shared</span>
            <strong>{records.filter(r => r.share_enabled).length}</strong>
            <p>Active record links</p>
          </div>
        </section>

        <section className={styles.workspace}>
          <div className={styles.timelinePanel}>
            <div className={styles.sectionHeader}>
              <div>
                <p className={styles.kicker}>Timeline</p>
                <h2>Your dental history</h2>
              </div>
              <Link href="/records/upload">Add record</Link>
            </div>
            {loading ? (
              <div className="skeleton" style={{ height: 260 }} />
            ) : records.length === 0 ? (
              <div className={styles.emptyState}>
                <img src="/jaw-render.png" alt="" />
                <h3>No records yet</h3>
                <p>Start with a sample upload or request records from a previous clinic.</p>
                <Link href="/records/upload">Upload first record</Link>
              </div>
            ) : (
              <Timeline records={records as DentalRecord[]} />
            )}
          </div>

          <aside className={styles.sideRail}>
            <div className={styles.assistantCard}>
              <MessageCircle size={20} />
              <h3>Ask DentoBot</h3>
              <p>Open a record and ask plain-language questions about findings, costs, timing, or what to ask your dentist.</p>
              <Link href={latest ? `/records/${latest.id}` : '/records/upload'}>Ask about a record</Link>
            </div>
            <div className={styles.assistantCard}>
              <Share2 size={20} />
              <h3>Share for a second opinion</h3>
              <p>Create a read-only link from any record and revoke it when the review is done.</p>
              <Link href={latest ? `/records/${latest.id}` : '/records/upload'}>Manage sharing</Link>
            </div>
            <RequestTracking />
          </aside>
        </section>
      </main>
    </div>
  );
}
