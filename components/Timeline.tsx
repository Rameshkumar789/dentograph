import Link from 'next/link';
import styles from './Timeline.module.css';

interface TimelineRecord {
  id: string;
  record_type: string;
  dentist_name?: string;
  clinic_name?: string;
  visit_date?: string;
  created_at: string;
  ai_findings?: Record<string, unknown>;
}

const URGENCY_CONFIG = {
  Routine: { color: 'var(--green)', label: 'Routine', badge: 'badge-green' },
  Soon:    { color: 'var(--yellow)', label: 'See Soon', badge: 'badge-yellow' },
  Urgent:  { color: 'var(--red)', label: 'Urgent!', badge: 'badge-red' },
};

const SCORE_COLORS: Record<string, string> = {
  'A': 'var(--green)', 'B+': 'var(--green)', 'B': 'var(--yellow)',
  'C+': 'var(--orange)', 'C': 'var(--orange)', 'D': 'var(--red)',
};

export default function Timeline({ records }: { records: TimelineRecord[] }) {
  let currentYear = '';

  return (
    <div className={styles.timeline}>
      {records.map((record, idx) => {
        const findings = record.ai_findings as Record<string, unknown> | undefined;
        const urgency = (findings?.overall_urgency as string) || 'Routine';
        const score = findings?.overall_score as string | undefined;
        const findingsList = findings?.findings as Array<Record<string, unknown>> | undefined;
        const patientSummary = findings?.patient_summary as string | undefined;
        
        // Prefer visit_date, fallback to created_at
        const dateObj = record.visit_date ? new Date(record.visit_date) : new Date(record.created_at);
        const date = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const recordYear = dateObj.getFullYear().toString();

        const isNewYear = recordYear !== currentYear;
        if (isNewYear) {
          currentYear = recordYear;
        }

        return (
          <div key={record.id}>
            {/* Year Separator */}
            {isNewYear && (
              <div className={styles.yearDivider}>
                <div className={styles.meta} style={{ paddingTop: 0 }}></div>
                <div className={styles.lineCol} style={{ padding: 0 }}>
                  <div className={styles.yearBadge}>{recordYear}</div>
                  <div className={styles.line} style={{ marginTop: 0 }} />
                </div>
                <div className={styles.card} style={{ opacity: 0, padding: 0, margin: 0, height: '40px' }} />
              </div>
            )}

            <div className={styles.item}>
              {/* Left Column: Metadata (Date, Doctor, Clinic) */}
              <div className={styles.meta}>
                <div className={styles.date}>{date}</div>
                {record.dentist_name && <div className={styles.doctor}>{record.dentist_name}</div>}
                {record.clinic_name && <div className={styles.clinic}>{record.clinic_name}</div>}
                <div className={styles.type}>
                  {record.record_type === 'comprehensive' ? '🗂️ Comprehensive Record' : record.record_type === 'xray' ? '🩻 X-Ray' : '📋 Prescription'}
                </div>
              </div>

              {/* Center Column: Timeline Nodes & Line */}
              <div className={styles.lineCol}>
                <div className={styles.dot} style={{ background: URGENCY_CONFIG[urgency as keyof typeof URGENCY_CONFIG]?.color || 'var(--green)', color: URGENCY_CONFIG[urgency as keyof typeof URGENCY_CONFIG]?.color || 'var(--green)' }} />
                {idx < records.length - 1 && <div className={styles.line} />}
              </div>

              {/* Right Column: AI Findings Card */}
              <Link href={`/records/${record.id}`} className={styles.card}>
                <div className={styles.cardTop}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span className={`badge ${URGENCY_CONFIG[urgency as keyof typeof URGENCY_CONFIG]?.badge || 'badge-green'}`}>
                      {URGENCY_CONFIG[urgency as keyof typeof URGENCY_CONFIG]?.label || 'Routine'}
                    </span>
                  </div>
                  {score && (
                    <div className={styles.score} style={{ color: SCORE_COLORS[score] }}>
                      {score}
                    </div>
                  )}
                </div>

                {patientSummary && (
                  <p className={styles.summary}>{patientSummary}</p>
                )}

                {findingsList && findingsList.length > 0 && (
                  <div className={styles.tags}>
                    {findingsList.slice(0, 3).map((f, i) => (
                      <span key={i} className={`badge ${f.condition === 'Healthy' ? 'badge-green' : f.severity === 'High' ? 'badge-red' : 'badge-yellow'}`}>
                        {f.condition === 'Healthy' ? '✅' : '⚠️'} {f.condition as string}
                      </span>
                    ))}
                    {findingsList.length > 3 && (
                      <span className="badge badge-grey">+{findingsList.length - 3} more</span>
                    )}
                  </div>
                )}

                <div className={styles.viewLink}>Review Analysis →</div>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
