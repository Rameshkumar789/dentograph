'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Bot,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  FileImage,
  ListChecks,
  Share2,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { createClient } from '@/lib/supabase';
import DentalModel3D from '@/components/DentalModel3D';
import AskAIChat from '@/components/AskAIChat';
import ShareButton from '@/components/ShareButton';
import EHIExportButton from '@/components/EHIExportButton';
import type { DentalAnalysis, Finding } from '@/lib/schemas';
import styles from './record.module.css';

interface DentalRecord {
  id: string;
  record_type: string;
  dentist_name?: string;
  clinic_name?: string;
  visit_date?: string;
  created_at: string;
  ai_findings?: DentalAnalysis;
  share_token?: string;
  share_enabled?: boolean;
}

export default function RecordPage() {
  const { id } = useParams<{ id: string }>();
  const [record, setRecord] = useState<DentalRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'soon' | 'monitor' | 'routine'>('all');
  const [showBot, setShowBot] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: rec } = await supabase.from('records').select('*').eq('id', id).single();
      setRecord(rec);

      await supabase.from('audit_logs').insert({
        actor_id: user.id,
        action: 'view_record',
        entity_id: id,
        entity_type: 'record',
      });

      setLoading(false);
    }
    load();
  }, [id, router, supabase]);

  const findings = record?.ai_findings;
  const grouped = useMemo(() => groupFindings(findings?.findings || []), [findings]);
  const visibleGroups = [
    { key: 'soon', title: 'Talk to your dentist soon', text: 'Start here. These are the items most worth asking about.', items: grouped.soon, tone: 'soon' },
    { key: 'monitor', title: 'Keep an eye on this', text: 'These may need follow-up, watching, or a clearer explanation.', items: grouped.monitor, tone: 'monitor' },
    { key: 'routine', title: 'Routine notes', text: 'Helpful background for prevention, maintenance, or past work.', items: grouped.routine, tone: 'routine' },
  ].filter((group) => filter === 'all' || group.key === filter);

  if (loading) {
    return (
      <div className={styles.page}>
        <main className={styles.loadingShell}>
          <div className={styles.loadingCard}>Loading your record...</div>
        </main>
      </div>
    );
  }

  if (!record || !findings) {
    return (
      <div className={styles.page}>
        <main className={styles.loadingShell}>
          <div className={styles.loadingCard}>
            <h1>Record not found</h1>
            <p>This record may have been removed or may not be connected to your account.</p>
            <Link href="/dashboard">Back to dashboard</Link>
          </div>
        </main>
      </div>
    );
  }

  const dateSource = record.visit_date || record.created_at;
  const date = new Date(dateSource).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const sourceLabel = record.clinic_name || record.dentist_name || 'Uploaded dental record';
  const discussCount = grouped.soon.length + grouped.monitor.length;
  const shareLabel = record.share_enabled ? 'Read-only link active' : 'Private';
  const dentistQuestions = buildDentistQuestions(findings.findings);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.topbar}>
          <Link href="/dashboard" className={styles.backLink}><ArrowLeft size={17} /> Back to dashboard</Link>
          <div className={styles.topActions}>
            <button onClick={() => router.push(`/records/${id}/source`)} className={styles.softButton}>
              <FileImage size={15} /> Source files
            </button>
          </div>
        </header>

        <section className={styles.visualFirst}>
          <div className={styles.visualCard}>
            <div className={styles.cardHeader}>
              <div>
                <p className={styles.kicker}>3D record preview</p>
                <h2>See where the notes apply</h2>
                <p>Rotate the model and hover over highlighted teeth to understand what the record is referencing.</p>
              </div>
            </div>
            <div className={styles.visualFrame}>
              <DentalModel3D findings={findings.findings} />
            </div>
          </div>

          <aside className={styles.summaryStack}>
            <section className={styles.summaryCard}>
              <p className={styles.kicker}>Patient dental record</p>
              <h1>{sourceLabel}</h1>
              <p>{findings.patient_summary}</p>
              <div className={styles.headerStats}>
                <MiniStat label="Visit date" value={date} icon={CalendarDays} />
                <MiniStat label="Record score" value={findings.overall_score || '--'} icon={CheckCircle2} />
                <MiniStat label="To discuss" value={discussCount.toString()} icon={ListChecks} />
                <MiniStat label="Sharing" value={shareLabel} icon={ShieldCheck} />
              </div>
            </section>

            <section className={styles.summaryCard}>
              <p className={styles.kicker}>Next step</p>
              <h2>Questions for your dentist</h2>
              <ul className={styles.questionList}>
                {dentistQuestions.map((question) => <li key={question}>{question}</li>)}
              </ul>
              {findings.recommended_followup && (
                <div className={styles.followupNote}>
                  <strong>Record note</strong>
                  <p>{findings.recommended_followup}</p>
                </div>
              )}
            </section>

            <section className={styles.actionCard} id="share">
              <div className={styles.cardTitleRow}>
                <Share2 size={19} />
                <h2>Share record</h2>
              </div>
              <p>Create a read-only link for a trusted dental professional, or download a summary for your own records.</p>
              <div className={styles.actionButtons}>
                <ShareButton recordId={record.id} shareToken={record.share_token || ''} shareEnabled={record.share_enabled || false} />
                <EHIExportButton findings={findings} recordId={record.id} recordType={record.record_type} clinicName={record.clinic_name} visitDate={dateSource} />
              </div>
              <p className={styles.auditNote}>Sharing, exports, and record views are logged for safety and review.</p>
            </section>
          </aside>
        </section>

        <section className={styles.findingsSection} id="findings">
          <div className={styles.cardHeader}>
            <div>
              <p className={styles.kicker}>Findings</p>
              <h2>What changed and why it matters</h2>
            </div>
            <div className={styles.filters} aria-label="Filter findings">
              {[
                ['all', 'All'],
                ['soon', 'Soon'],
                ['monitor', 'Monitor'],
                ['routine', 'Routine'],
              ].map(([value, label]) => (
                <button key={value} onClick={() => setFilter(value as typeof filter)} className={filter === value ? styles.selected : ''}>{label}</button>
              ))}
            </div>
          </div>

          <div className={styles.findingGroups}>
            {visibleGroups.map((group) => (
              <section key={group.key} className={styles.findingGroup}>
                <div className={styles.groupIntro}>
                  <span className={styles[group.tone as 'soon' | 'monitor' | 'routine']} />
                  <div>
                    <h3>{group.title}</h3>
                    <p>{group.text}</p>
                  </div>
                </div>
                {group.items.length > 0 ? (
                  <div className={styles.findingList}>
                    {group.items.map((finding, index) => <FindingCard key={`${group.key}-${index}`} finding={finding} />)}
                  </div>
                ) : (
                  <div className={styles.emptyGroup}>No findings in this group.</div>
                )}
              </section>
            ))}
          </div>
        </section>

        <section className={styles.botStrip} id="dentobot">
          <div>
            <div className={styles.cardTitleRow}>
              <Bot size={20} />
              <h2>DentoBot</h2>
            </div>
            <p>DentoBot can explain terms and help you prepare questions. It does not diagnose or choose treatment.</p>
          </div>
          {!showBot ? (
            <button className={styles.primaryButton} onClick={() => setShowBot(true)}>
              Open DentoBot <ChevronRight size={16} />
            </button>
          ) : (
            <div className={styles.botFrame}>
              <AskAIChat findings={findings} />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function groupFindings(findings: Finding[]) {
  return {
    soon: findings.filter((finding) => (finding.severity_score || 0) >= 7),
    monitor: findings.filter((finding) => (finding.severity_score || 0) >= 4 && (finding.severity_score || 0) < 7),
    routine: findings.filter((finding) => (finding.severity_score || 0) < 4),
  };
}

function buildDentistQuestions(findings: Finding[]) {
  const importantFindings = [...findings]
    .sort((a, b) => (b.severity_score || 0) - (a.severity_score || 0))
    .slice(0, 3);

  const questions = importantFindings.map((finding) => {
    const location = finding.tooth_number ? `tooth #${finding.tooth_number}` : 'this finding';
    return `What should I understand about ${location} (${finding.condition})?`;
  });

  return [
    ...questions,
    'Which items should be treated soon, and which can be monitored?',
    'Which original files or X-rays support this plan?',
  ].slice(0, 5);
}

function MiniStat({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className={styles.miniStat}>
      <Icon size={17} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function FindingCard({ finding }: { finding: Finding }) {
  const priority = finding.severity_score || 1;
  const label = priority >= 7 ? 'Discuss soon' : priority >= 4 ? 'Monitor' : 'Routine';

  return (
    <article className={styles.findingCard}>
      <div className={styles.findingTop}>
        <span>{label} · Priority {priority}/10</span>
        {finding.tooth_number && <strong>Tooth #{finding.tooth_number}</strong>}
      </div>
      <h4>{finding.condition}</h4>
      <p>{finding.explanation}</p>
      {finding.why_it_matters && (
        <details className={styles.why}>
          <summary>Why it matters</summary>
          <p>{finding.why_it_matters}</p>
        </details>
      )}
    </article>
  );
}
