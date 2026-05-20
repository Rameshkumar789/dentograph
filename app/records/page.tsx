'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, FilePlus2, FolderOpen, Search, UploadCloud } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import PatientPortalShell from '@/components/PatientPortalShell';
import styles from './records.module.css';

interface DentalRecord {
  id: string;
  record_type: string;
  dentist_name?: string;
  clinic_name?: string;
  visit_date?: string;
  created_at: string;
  share_enabled?: boolean;
  ai_findings?: {
    patient_summary?: string;
    overall_score?: string;
    findings?: Array<{ severity_score?: number | null }>;
  };
}

export default function RecordsPage() {
  const [records, setRecords] = useState<DentalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

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

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return records;
    return records.filter((record) => [
      record.clinic_name,
      record.dentist_name,
      record.record_type,
      record.ai_findings?.patient_summary,
    ].some((value) => value?.toLowerCase().includes(needle)));
  }, [query, records]);

  const latest = records[0];
  const latestHref = latest ? `/records/${latest.id}` : '/records/upload';

  return (
    <PatientPortalShell active="Records" latestRecordHref={latestHref}>
      <main className={styles.main}>
        <section className={styles.hero}>
          <div>
            <p className={styles.kicker}>Dental records</p>
            <h1>Your timeline</h1>
            <p>Keep X-rays, treatment plans, PDFs, and visit notes together in one patient-owned record.</p>
          </div>
        </section>

        <section className={styles.addPanel} aria-label="Add records">
          <div className={styles.addIntro}>
            <div className={styles.addIcon}><UploadCloud size={22} /></div>
            <div>
              <h2>Add records</h2>
              <p>Upload files you already have, or ask a dental office to send missing records.</p>
            </div>
          </div>
          <div className={styles.addActions}>
            <Link href="/records/upload" className={styles.primary}><FilePlus2 size={18} /> Upload record</Link>
            <Link href="/request-records" className={styles.secondary}><FolderOpen size={18} /> Request from clinic</Link>
          </div>
        </section>

        <section className={styles.recordsSection}>
          <div className={styles.recordsHeader}>
            <div>
              <p className={styles.kicker}>Saved records</p>
              <h2>{records.length} record{records.length === 1 ? '' : 's'}</h2>
            </div>
            <div className={styles.searchBox}>
              <Search size={17} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search clinic, dentist, type, or summary" />
            </div>
          </div>

          {loading ? (
            <div className={styles.skeleton} />
          ) : filtered.length === 0 ? (
            <div className={styles.empty}>
              <h2>No records found</h2>
              <p>Upload a file or request records from a previous dental office to start your DentoGraph timeline.</p>
              <div className={styles.addActions}>
                <Link href="/records/upload" className={styles.primary}>Upload record</Link>
                <Link href="/request-records" className={styles.secondary}>Request from clinic</Link>
              </div>
            </div>
          ) : (
            <div className={styles.timeline}>
              {filtered.map((record) => {
                const recordDate = new Date(record.visit_date || record.created_at);
                const date = recordDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const discuss = (record.ai_findings?.findings || []).filter((finding) => (finding.severity_score || 0) >= 4).length;
                return (
                  <Link key={record.id} href={`/records/${record.id}`} className={styles.recordRow}>
                    <div className={styles.dateRail}>
                      <span>{date}</span>
                    </div>
                    <div className={styles.recordBody}>
                      <div>
                        <h2>{record.clinic_name || record.dentist_name || 'Dental record'}</h2>
                        <p>{record.ai_findings?.patient_summary || 'Open this record to view the 3D preview, findings, source files, and sharing controls.'}</p>
                      </div>
                      <div className={styles.badges}>
                        <span>{record.record_type}</span>
                        {record.ai_findings?.overall_score && <span>Score {record.ai_findings.overall_score}</span>}
                        <span>{discuss} to discuss</span>
                        {record.share_enabled && <span>Shared</span>}
                      </div>
                    </div>
                    <ArrowRight size={18} />
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </PatientPortalShell>
  );
}
