'use client';
import { useState } from 'react';
import type { DentalAnalysis } from '@/lib/schemas';
import styles from './ClinicalNarrative.module.css';

interface ClinicalNarrativeProps {
  findings: DentalAnalysis;
  dentistName?: string;
  clinicName?: string;
  patientName?: string;
}

export default function ClinicalNarrative({ findings, dentistName, clinicName, patientName }: ClinicalNarrativeProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  async function generateFullReport() {
    setIsGenerating(true);
    // Real enterprise logic: Calls a specialized endpoint to generate a structured PDF-ready document
    const res = await fetch('/api/insurance-narrative', {
      method: 'POST',
      body: JSON.stringify({ findings, dentistName, clinicName, patientName })
    });
    const data = await res.json();
    setReport(data.narrative);
    setIsGenerating(false);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Insurance Narrative Generator</h3>
        <span className="badge badge-accent">Clinical Justification v2.0</span>
      </div>

      <p className={styles.description}>
        Generate a structured clinical narrative for insurance submission. 
        Our AI includes necessary CDT codes, tooth coordinates, and severity justifications to reduce claim denials.
      </p>

      {!report ? (
        <button 
          onClick={generateFullReport} 
          className="btn btn-primary" 
          style={{ width: '100%' }}
          disabled={isGenerating}
        >
          {isGenerating ? '🔗 Analyzing Clinical Data...' : 'Generate Clinical Narrative →'}
        </button>
      ) : (
        <div className={styles.reportArea}>
          <div className={styles.toolbar}>
            <button className="btn btn-secondary btn-sm">📄 Download PDF</button>
            <button className="btn btn-secondary btn-sm" onClick={() => setReport(null)}>🔄 Regenerate</button>
          </div>
          <div className={styles.narrativeOutput}>
            <pre>{report}</pre>
          </div>
          <div className={styles.footer}>
            <div className={styles.signatureLine}>
              <span>Clinically Verified By:</span>
              <div className={styles.box} />
            </div>
            <div className={styles.signatureLine}>
              <span>Date:</span>
              <div className={styles.box} style={{ width: '100px' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
