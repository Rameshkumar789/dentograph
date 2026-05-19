'use client';
import { useState } from 'react';
import type { DentalAnalysis } from '@/lib/schemas';

interface Props {
  findings: DentalAnalysis;
  dentistName?: string;
  clinicName?: string;
}

export default function InsuranceNarrativeButton({ findings, dentistName, clinicName }: Props) {
  const [narrative, setNarrative] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generateNarrative() {
    setLoading(true);
    setShow(true);
    try {
      const res = await fetch('/api/insurance-narrative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ findings, dentistName, clinicName }),
      });
      const data = await res.json();
      setNarrative(data.narrative);
    } catch {
      setNarrative('Failed to generate narrative. Please try again.');
    }
    setLoading(false);
  }

  function handleCopy() {
    if (narrative) {
      navigator.clipboard.writeText(narrative);
      setCopied(true);
    }
  }

  return (
    <>
      <button onClick={generateNarrative} className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: '8px' }}>
        Generate Insurance Appeal Letter
      </button>

      {show && (
        <div style={{
          marginTop: '16px', padding: '20px', background: 'var(--bg-surface)',
          border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-card)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Insurance Clinical Narrative</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {narrative && (
                <button onClick={handleCopy} className="btn btn-secondary btn-sm">{copied ? 'Copied' : 'Copy'}</button>
              )}
              <button onClick={() => setShow(false)} className="btn btn-secondary btn-sm">✕</button>
            </div>
          </div>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="skeleton" style={{ height: '16px', width: '90%' }} />
              <div className="skeleton" style={{ height: '16px', width: '75%' }} />
              <div className="skeleton" style={{ height: '16px', width: '85%' }} />
              <div className="skeleton" style={{ height: '16px', width: '60%' }} />
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                AI is generating a professional clinical narrative for your insurance company...
              </p>
            </div>
          ) : (
            <div style={{
              whiteSpace: 'pre-wrap', fontSize: '0.85rem', lineHeight: 1.7,
              color: 'var(--text-primary)', fontFamily: 'var(--font-body)',
              maxHeight: '400px', overflowY: 'auto',
            }}>
              {narrative}
            </div>
          )}
          <div style={{ marginTop: '12px', fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            This letter was AI-generated. Have your dentist review and sign it before submitting to insurance.
          </div>
        </div>
      )}
    </>
  );
}
