'use client';
import { useEffect, useState } from 'react';
import styles from './XrayScannerAnimation.module.css';

const STEPS = [
  { label: 'Loading image...', pct: 10 },
  { label: 'Reading dental structures...', pct: 30 },
  { label: 'Identifying teeth...', pct: 50 },
  { label: 'Detecting anomalies...', pct: 70 },
  { label: 'Mapping to 3D model...', pct: 85 },
  { label: 'Generating plain English report...', pct: 95 },
];

export default function XrayScannerAnimation({
  imageUrl,
  recordType,
}: {
  imageUrl: string | null;
  recordType: string;
}) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(s => Math.min(s + 1, STEPS.length - 1));
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const current = STEPS[step];

  return (
    <div className={styles.overlay}>
      <div className={styles.inner}>
        {/* Image with scanner effect */}
        <div className={styles.imageContainer}>
          {imageUrl ? (
            <img src={imageUrl} alt="Uploaded record" className={styles.xrayImg} />
          ) : (
            <div className={styles.placeholder}>{recordType === 'xray' ? '🩻' : '📋'}</div>
          )}
          <div className={styles.scanLine} />
          <div className={styles.gridOverlay} />
          {step >= 3 && <div className={styles.heatmap} />}
          {step >= 4 && (
            <>
              <div className={styles.bbox} style={{ top: '25%', left: '20%', width: '15%', height: '20%', borderColor: 'var(--red)' }} />
              <div className={styles.bbox} style={{ top: '30%', right: '25%', width: '12%', height: '18%', borderColor: 'var(--yellow)' }} />
              <div className={styles.bbox} style={{ top: '55%', left: '35%', width: '18%', height: '22%', borderColor: 'var(--green)' }} />
            </>
          )}
        </div>

        {/* Status */}
        <div className={styles.status}>
          <div className={styles.statusIcon}>🔬</div>
          <h2>AI is analyzing your {recordType === 'xray' ? 'X-ray' : 'prescription'}</h2>
          <p className={styles.stepLabel}>{current.label}</p>

          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${current.pct}%` }} />
          </div>
          <span className={styles.pct}>{current.pct}%</span>

          <div className={styles.chips}>
            {STEPS.slice(0, step + 1).map((s, i) => (
              <div key={i} className={styles.chip}>✓ {s.label.replace('...', '')}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
