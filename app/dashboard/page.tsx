'use client';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import {
  ArrowRight,
  FolderOpen,
  IdCard,
  Share2,
  ShieldCheck,
  UserRound,
  type LucideIcon,
} from 'lucide-react';
import PatientPortalShell from '@/components/PatientPortalShell';
import styles from './dashboard.module.css';

interface DentalRecord {
  id: string;
  record_type: string;
  dentist_name?: string;
  clinic_name?: string;
  visit_date?: string;
  created_at: string;
  ai_findings?: {
    patient_summary?: string;
    recommended_followup?: string;
    overall_score?: string;
    findings?: Array<{ severity_score?: number | null; condition?: string; tooth_number?: number | null }>;
  };
  share_enabled?: boolean;
}

interface PatientProfile {
  date_of_birth?: string | null;
  gender?: string | null;
  blood_type?: string | null;
  medical_history?: {
    insurance?: { provider?: string; member_id?: string };
    emergency_contact?: { name?: string; phone?: string };
    allergies?: string[];
    medications?: string[];
  } | null;
}

export default function DashboardPage() {
  const [profileName, setProfileName] = useState('');
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);
  const [records, setRecords] = useState<DentalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      if (!cancelled) {
        setProfileName(user.user_metadata?.full_name || 'Patient');
      }

      const profileRequest = supabase.from('profiles').select('full_name').eq('id', user.id).maybeSingle();
      const [{ data: patient }, { data: recordsData }, { data: profile }] = await Promise.all([
        supabase.from('patients').select('date_of_birth, gender, blood_type, medical_history').eq('id', user.id).single(),
        supabase
          .from('records')
          .select('id, record_type, dentist_name, clinic_name, visit_date, created_at, share_enabled, ai_findings')
          .eq('patient_id', user.id)
          .order('created_at', { ascending: false }),
        profileRequest,
      ]);

      if (cancelled) return;
      setProfileName(profile?.full_name || user.user_metadata?.full_name || 'Patient');
      setPatientProfile(patient || null);
      setRecords(recordsData || []);
      setLoading(false);
    }
    load();

    return () => {
      cancelled = true;
    };
  }, [router, supabase]);

  const name = profileName || 'Patient';
  const latest = records[0];
  const latestFindings = latest?.ai_findings?.findings || [];
  const findingsToDiscuss = latestFindings.filter((f) => (f.severity_score || 0) >= 4).length;
  const activeShares = records.filter((r) => r.share_enabled).length;
  const latestRecordHref = latest ? `/records/${latest.id}` : '/records';
  const profileCompleteness = useMemo(() => {
    const checks = [
      Boolean(profileName),
      Boolean(patientProfile?.date_of_birth),
      Boolean(patientProfile?.blood_type),
      Boolean(patientProfile?.medical_history?.insurance?.provider),
      Boolean(patientProfile?.medical_history?.emergency_contact?.name),
      Boolean(patientProfile?.medical_history?.allergies?.length),
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [patientProfile, profileName]);

  const latestDate = latest
    ? new Date(latest.visit_date || latest.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'No visit yet';
  const latestSummary = latest?.ai_findings?.patient_summary
    ? latest.ai_findings.patient_summary.split('. ')[0].replace(/\.$/, '')
    : 'Start by adding an X-ray, treatment plan, scan, or PDF.';

  return (
    <PatientPortalShell active="Home" latestRecordHref={latestRecordHref}>
      <main className={styles.main}>
        <header className={styles.topbar}>
          <div>
            <p className={styles.kicker}>Patient portal</p>
            <h1>Your dental record home</h1>
          </div>
          <Link href="/profile" className={styles.profilePill}><UserRound size={18} /> {name}</Link>
        </header>

        <section className={styles.statusGrid} aria-label="Portal status">
          <StatusCard icon={FolderOpen} label="Timeline records" value={records.length.toString()} text="Saved visits" />
          <StatusCard icon={Share2} label="Active shares" value={activeShares.toString()} text="Read-only links" />
          <StatusCard icon={IdCard} label="Profile complete" value={`${profileCompleteness}%`} text="Health details" />
          <StatusCard icon={ShieldCheck} label="Patient control" value="On" text="Private by default" />
        </section>

        <section className={styles.heroCard}>
          {loading ? (
            <div className={styles.heroLoading}>
              <p className={styles.kicker}>Latest dental update</p>
              <div className={styles.loadingLineLarge} />
              <div className={styles.loadingLine} />
              <div className={styles.loadingLineShort} />
            </div>
          ) : (
            <div>
              <p className={styles.kicker}>Latest dental update</p>
              <h2>{latest ? 'Your latest record is ready' : `Welcome, ${name}`}</h2>
              <p>{latestSummary}</p>
              {latest && <div className={styles.recordSnapshot}><span>{latestDate}</span><span>{latest.clinic_name || latest.dentist_name || 'Dental record'}</span><span>{findingsToDiscuss} to discuss</span></div>}
              <div className={styles.heroActions}>
                <Link href={latest ? `/records/${latest.id}` : '/records/upload'} className={styles.primaryCta}>
                  {latest ? 'Review latest record' : 'Upload first record'} <ArrowRight size={18} />
                </Link>
                <Link href="/request-records" className={styles.secondaryCta}><FolderOpen size={18} /> Request records</Link>
              </div>
            </div>
          )}
        </section>

        <section className={styles.workspace}>
          <div className={styles.timelinePanel}>
            <div className={styles.sectionHeader}>
              <div>
                <p className={styles.kicker}>Dental timeline</p>
                <h2>Your records</h2>
              </div>
              <Link href="/records"><FolderOpen size={17} /> View all records</Link>
            </div>
            {loading ? (
              <div className={styles.skeleton} />
            ) : records.length === 0 ? (
              <div className={styles.emptyState}>
                <Image src="/jaw-render.png" alt="" width={150} height={150} />
                <h3>No records yet</h3>
                <p>Upload an X-ray, treatment plan, scan, or PDF to start your timeline.</p>
                <Link href="/records/upload">Upload first record</Link>
              </div>
            ) : (
              <div className={styles.recordList}>
                {records.map((record) => {
                  const recordDate = new Date(record.visit_date || record.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                  const discussCount = (record.ai_findings?.findings || []).filter((f) => (f.severity_score || 0) >= 4).length;
                  return (
                    <Link key={record.id} href={`/records/${record.id}`} className={styles.recordCard}>
                      <div className={styles.recordDate}>{recordDate}</div>
                      <div>
                        <h3>{record.clinic_name || record.dentist_name || 'Dental record'}</h3>
                        <p>{record.ai_findings?.patient_summary || 'Open this record to review findings, source files, DentoBot, and sharing.'}</p>
                        <div className={styles.recordMeta}>
                          <span>{record.record_type}</span>
                          <span>{discussCount} finding{discussCount === 1 ? '' : 's'} to discuss</span>
                          {record.share_enabled && <span>Shared</span>}
                        </div>
                      </div>
                      <ArrowRight size={18} />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

        </section>
      </main>

    </PatientPortalShell>
  );
}

function StatusCard({ icon: Icon, label, value, text }: { icon: LucideIcon; label: string; value: string; text: string }) {
  return (
    <article className={styles.statusCard}>
      <Icon size={20} />
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{text}</p>
    </article>
  );
}
