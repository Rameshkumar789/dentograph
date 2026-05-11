import type { DentalAnalysis } from '@/lib/schemas';
import styles from './ReportCard.module.css';

const SCORE_COLORS: Record<string, string> = {
  'A': 'var(--green)', 'B+': 'var(--green)', 'B': 'var(--yellow)',
  'C+': 'var(--orange)', 'C': 'var(--orange)', 'D': 'var(--red)',
};
const CONDITION_ICONS: Record<string, string> = {
  Healthy: '✅', Cavity: '🦠', 'Bone Loss': '📉',
  Crown: '👑', Implant: '🔩', Missing: '❌',
  Fracture: '⚡', 'Recommended Treatment': '💊',
};
const URGENCY_CONFIG: Record<string, { label: string; badge: string; emoji: string }> = {
  Routine: { label: 'Routine checkup', badge: 'badge-green', emoji: '🟢' },
  Soon:    { label: 'See dentist soon', badge: 'badge-yellow', emoji: '🟡' },
  Urgent:  { label: 'Urgent — see dentist now', badge: 'badge-red', emoji: '🔴' },
};

export default function ReportCard({ findings, isPublic = false }: { findings: DentalAnalysis; isPublic?: boolean }) {
  const urgency = URGENCY_CONFIG[findings.overall_urgency] || URGENCY_CONFIG.Routine;

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <div className={styles.title}>📋 Dental Report Card</div>
          <p style={{ fontSize: '0.875rem', marginTop: '4px' }}>{findings.patient_summary}</p>
        </div>
        <div className={styles.scoreCircle} style={{ borderColor: SCORE_COLORS[findings.overall_score] }}>
          <div className={styles.scoreLetter} style={{ color: SCORE_COLORS[findings.overall_score] }}>
            {findings.overall_score}
          </div>
          <div className={styles.scoreLabel}>Health Score</div>
        </div>
      </div>

      {/* Urgency */}
      <div className={`${styles.urgencyBar} ${findings.overall_urgency === 'Urgent' ? styles.urgencyUrgent : findings.overall_urgency === 'Soon' ? styles.urgencySoon : styles.urgencyRoutine}`}>
        <span>{urgency.emoji}</span>
        <span style={{ fontWeight: 600 }}>{urgency.label}</span>
      </div>

      {/* Findings list */}
      <div className={styles.findingsList}>
        {findings.findings.map((f, i) => (
          <div key={i} className={`${styles.findingRow} ${f.severity === 'High' ? styles.findingHigh : f.severity === 'Medium' ? styles.findingMed : ''}`}>
            <div className={styles.findingIcon}>{CONDITION_ICONS[f.condition] || '🦷'}</div>
            <div className={styles.findingBody}>
              <div className={styles.findingTitle}>
                {f.tooth_number ? `Tooth #${f.tooth_number}` : 'General'} — {f.condition}
                {f.severity && (
                  <span className={`badge ${f.severity === 'High' ? 'badge-red' : f.severity === 'Medium' ? 'badge-yellow' : 'badge-green'}`} style={{ marginLeft: '8px' }}>
                    {f.severity}
                  </span>
                )}
              </div>
              <div className={styles.findingDesc}>{f.explanation}</div>
              {f.timeframe && (
                <div className={styles.timeframe}>⏱ {f.timeframe}</div>
              )}
            </div>
            <div className={styles.findingAction}>
              {f.action_required ? '⚠️' : '✓'}
            </div>
          </div>
        ))}
      </div>

      {/* Follow-up */}
      <div className={styles.followup}>
        <strong>💡 Next step:</strong> {findings.recommended_followup}
      </div>

      {isPublic && (
        <div className={styles.poweredBy}>
          <span>Powered by</span>
          <strong> 🦷 DentoGraph</strong>
          <span> — Patient-owned dental records</span>
        </div>
      )}
    </div>
  );
}
