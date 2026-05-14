'use client';
import { useState } from 'react';
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

function SeverityMeter({ score }: { score: number }) {
  const color = score <= 3 ? 'var(--green)' : score <= 6 ? 'var(--yellow)' : 'var(--red)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
      <div style={{ flex: 1, height: '6px', borderRadius: '3px', background: 'var(--border)', overflow: 'hidden', maxWidth: '80px' }}>
        <div style={{ width: `${score * 10}%`, height: '100%', borderRadius: '3px', background: color, transition: 'width 0.5s ease' }} />
      </div>
      <span style={{ fontSize: '0.75rem', fontWeight: 700, color, fontFamily: 'var(--font-display)' }}>{score}/10</span>
    </div>
  );
}

export default function ReportCard({ findings, isPublic = false }: { findings: DentalAnalysis; isPublic?: boolean }) {
  const urgency = URGENCY_CONFIG[findings.overall_urgency] || URGENCY_CONFIG.Routine;

  const summary = (findings.clinical_summary || findings.patient_summary);
  const followup = (findings.clinical_followup || findings.recommended_followup);

  // Gather all CDT codes (from top-level + per-finding)
  const allCDTCodes = findings.detected_cdt_codes || [];

  return (
    <div className={styles.card} style={{ border: '1px solid #e2e8f0', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)' }}>
      {/* Header */}
      <div className={styles.header} style={{ borderBottom: '1px solid #f1f5f9', padding: '24px' }}>
        <div style={{ flex: 1 }}>
          <div className={styles.title} style={{ color: '#0f172a', fontWeight: 900, fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-display)' }}>
             Diagnostic Synthesis & Pathology Manifest
          </div>
          <div style={{ marginTop: '16px', padding: '16px', background: '#f8fafc', borderRadius: '12px', borderLeft: '4px solid #6366f1' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Clinical Executive Summary</div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#1e293b', fontWeight: 500, margin: 0 }}>{summary}</p>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginLeft: '32px' }}>
          <div className={styles.scoreCircle} style={{ borderColor: '#6366f1', background: '#fff', width: '90px', height: '90px' }}>
            <div className={styles.scoreLetter} style={{ color: '#0f172a', fontSize: '2rem' }}>
              {findings.overall_score}
            </div>
            <div className={styles.scoreLabel} style={{ fontSize: '0.6rem' }}>Pathology Matrix</div>
          </div>
          {findings.overall_severity_score && (
            <SeverityMeter score={findings.overall_severity_score} />
          )}
        </div>
      </div>

      {/* Urgency */}
      <div className={`${styles.urgencyBar} ${findings.overall_urgency === 'Urgent' ? styles.urgencyUrgent : findings.overall_urgency === 'Soon' ? styles.urgencySoon : styles.urgencyRoutine}`}>
        <span>{urgency.emoji}</span>
        <span style={{ fontWeight: 600 }}>{urgency.label}</span>
        {findings.estimated_total_cost && (
          <span style={{ marginLeft: 'auto', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
            Est. Treatment Cost: {findings.estimated_total_cost}
          </span>
        )}
      </div>

      {/* Findings list */}
      <div className={styles.findingsList}>
        {findings.findings.map((f, i) => {
          const explanation = (f.clinical_explanation || f.explanation);
          return (
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
                <div className={styles.findingDesc}>{explanation}</div>
                {f.why_it_matters && (
                  <div style={{ marginTop: '6px', padding: '8px 12px', background: 'var(--accent-dim)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent)', fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                    💡 <strong>Why it matters:</strong> {f.why_it_matters}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px', flexWrap: 'wrap' }}>
                  {f.severity_score && <SeverityMeter score={f.severity_score} />}
                  {f.confidence && (
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: f.confidence === 'High' ? 'var(--green-dim, #e8f5e9)' : f.confidence === 'Medium' ? 'var(--yellow-dim, #fff3e0)' : 'var(--red-dim)', color: f.confidence === 'High' ? 'var(--green)' : f.confidence === 'Medium' ? 'var(--yellow, #f59e0b)' : 'var(--red)' }}>
                      {f.confidence === 'High' ? '🎯' : f.confidence === 'Medium' ? '🔍' : '❓'} {f.confidence} Confidence
                    </span>
                  )}
                </div>
                {f.timeframe && (
                  <div className={styles.timeframe}>⏱ {f.timeframe}</div>
                )}
                {/* CDT Codes for this finding */}
                {f.cdt_codes && f.cdt_codes.length > 0 && (
                  <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {f.cdt_codes.map((cdt, j) => (
                      <span key={j} style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        padding: '3px 10px', borderRadius: 'var(--radius-sm)',
                        background: 'var(--accent-dim)', border: '1px solid var(--border)',
                        fontSize: '0.72rem', fontWeight: 600, color: 'var(--accent)',
                        fontFamily: 'var(--font-mono, monospace)',
                      }}>
                        {cdt.code}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className={styles.findingAction}>
                {f.action_required ? '⚠️' : '✓'}
              </div>
            </div>
          );
        })}
      </div>

      {/* CDT Code Breakdown */}
      {allCDTCodes.length > 0 && (
        <div style={{ padding: '20px', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>
            💰 Treatment Cost Breakdown
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {allCDTCodes.map((cdt, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: '12px',
                padding: '12px', borderRadius: 'var(--radius-md)',
                background: 'var(--bg-base)', border: '1px solid var(--border)',
              }}>
                <div style={{
                  padding: '4px 10px', borderRadius: 'var(--radius-sm)',
                  background: 'var(--accent)', color: '#fff',
                  fontSize: '0.8rem', fontWeight: 700, fontFamily: 'var(--font-mono, monospace)',
                  whiteSpace: 'nowrap',
                }}>
                  {cdt.code}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                    {cdt.name}
                  </div>
                </div>
                {cdt.estimated_cost_range && (
                  <div style={{
                    fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)',
                    fontFamily: 'var(--font-display)', whiteSpace: 'nowrap',
                  }}>
                    {cdt.estimated_cost_range}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Follow-up */}
      <div className={styles.followup}>
        <strong>💡 Next step:</strong> {followup}
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
