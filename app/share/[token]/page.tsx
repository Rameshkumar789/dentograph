import { createServerSupabaseClient } from '@/lib/supabase-server';
import ReportCard from '@/components/ReportCard';
import Link from 'next/link';
import InteractiveJawMap from '@/components/InteractiveJawMap';
import type { DentalAnalysis } from '@/lib/schemas';
import styles from './share.module.css';

export default async function SharePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: record } = await supabase
    .from('records')
    .select('*')
    .eq('share_token', token)
    .eq('share_enabled', true)
    .single();

  if (!record) {
    return (
      <div className={styles.page}>
        <nav className="navbar"><div className="navbar-logo">🦷 Dento<span>Graph</span></div></nav>
        <div className={styles.invalid}>
          <div style={{ fontSize: '3rem' }}>🔒</div>
          <h2>This link is invalid or has been disabled</h2>
          <p>The patient may have turned off sharing for this record.</p>
          <Link href="/" className="btn btn-primary" style={{ marginTop: '8px' }}>Go to DentoGraph</Link>
        </div>
      </div>
    );
  }

  const findings = record.ai_findings as DentalAnalysis;
  const date = record.visit_date
    ? new Date(record.visit_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : new Date(record.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className={styles.page}>
      <nav className="navbar">
        <div className="navbar-logo">🦷 Dento<span>Graph</span></div>
        <Link href="/signup" className="btn btn-primary btn-sm">Create your free account</Link>
      </nav>

      <div className="container" style={{ maxWidth: '800px', paddingTop: '40px', paddingBottom: '80px' }}>
        {/* Header */}
        <div className={styles.shareHeader}>
          <span className="badge badge-accent">👁 Second Opinion View — Read Only</span>
          <h1 style={{ marginTop: '16px' }}>Dental Record — {date}</h1>
          <p>
            {record.record_type === 'xray' ? '🩻 X-Ray' : '📋 Prescription'}
            {record.dentist_name && ` · ${record.dentist_name}`}
            {record.clinic_name && ` · ${record.clinic_name}`}
          </p>
        </div>

        {/* Tooth map */}
        {findings && (
          <div className={styles.toothMap} style={{ padding: 0, border: 'none', background: 'transparent' }}>
            <InteractiveJawMap findings={findings.findings} beforeAfter="before" />
          </div>
        )}

        {/* Report card */}
        {findings && <ReportCard findings={findings} isPublic />}

        {/* CTA */}
        <div className={styles.cta}>
          <div className={styles.ctaText}>
            <h3>This patient uses DentoGraph to own their dental records</h3>
            <p>$2/month for unlimited records, AI analysis, and one-click sharing. Try it free.</p>
          </div>
          <Link href="/signup" className="btn btn-primary btn-lg">Create free account →</Link>
        </div>
      </div>
    </div>
  );
}
