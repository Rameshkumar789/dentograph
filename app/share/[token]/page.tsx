import { createServerSupabaseClient } from '@/lib/supabase-server';
import ReportCard from '@/components/ReportCard';
import Link from 'next/link';
import InteractiveJawMap from '@/components/InteractiveJawMap';
import type { DentalAnalysis } from '@/lib/schemas';
import styles from './share.module.css';
import { headers } from 'next/headers';

export default async function SharePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: share, error: shareError } = await supabase
    .from('record_shares')
    .select('*')
    .eq('token', token)
    .is('revoked_at', null)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();

  const recordQuery = isMissingTable(shareError)
    ? supabase
        .from('records')
        .select('*')
        .eq('share_token', token)
        .eq('share_enabled', true)
        .maybeSingle()
    : supabase
        .from('records')
        .select('*')
        .eq('id', share?.record_id || '00000000-0000-0000-0000-000000000000')
        .maybeSingle();

  const { data: record } = await recordQuery;

  if (share?.id && record?.id) {
    const h = await headers();
    await supabase.from('share_access_logs').insert({
      share_id: share.id,
      record_id: record.id,
      token_hash: token.slice(0, 12),
      viewer_ip: h.get('x-forwarded-for')?.split(',')[0] || null,
      user_agent: h.get('user-agent') || null,
    });
  }

  let imageUrls: string[] = [];
  if (record?.file_path) {
    const paths = record.file_path.split(',').filter(Boolean);
    const urls = await Promise.all(paths.map(async (p: string) => {
      const { data: signedData } = await supabase.storage.from('dental-records').createSignedUrl(p, 3600);
      return signedData?.signedUrl || '';
    }));
    imageUrls = urls.filter(Boolean);
  }

  if (!record) {
    return (
      <div className={styles.page}>
        <nav className="navbar">
          <img src="/dentograph-logo.png" alt="DentoGraph" style={{ width: '188px', height: 'auto' }} />
        </nav>
        <div className={styles.invalid}>
          <div style={{ fontSize: '3rem' }}>Locked</div>
          <h2>This link is invalid or has been disabled</h2>
          <p>The patient may have turned off sharing, or the link may have expired.</p>
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
        <img src="/dentograph-logo.png" alt="DentoGraph" style={{ width: '188px', height: 'auto' }} />
        <Link href="/signup" className="btn btn-primary btn-sm">Create your free account</Link>
      </nav>

      <div className="container" style={{ maxWidth: '800px', paddingTop: '40px', paddingBottom: '80px' }}>
        {/* Header */}
        <div className={styles.shareHeader}>
        <span className="badge badge-accent">Read-only dental record</span>
          <h1 style={{ marginTop: '16px' }}>Dental Record — {date}</h1>
          <p>
            {record.record_type === 'comprehensive' ? 'Comprehensive Record' : record.record_type === 'xray' ? 'X-Ray' : 'Prescription'}
            {record.dentist_name && ` · ${record.dentist_name}`}
            {record.clinic_name && ` · ${record.clinic_name}`}
          </p>
        </div>

        {/* Tooth map */}
        {findings && (
          <div className={styles.toothMap} style={{ padding: 0, border: 'none', background: 'transparent' }}>
            <InteractiveJawMap findings={findings.findings} />
          </div>
        )}

        {/* Report card */}
        {findings && <ReportCard findings={findings} isPublic />}

        {/* Source Documents */}
        {imageUrls.length > 0 && (
          <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '24px' }}>Original Clinical Records</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
              {imageUrls.map((url, i) => (
                <div key={i} style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                  <img src={url} alt={`Document ${i + 1}`} style={{ width: '100%', height: 'auto', maxHeight: '800px', objectFit: 'contain' }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className={styles.cta}>
          <div className={styles.ctaText}>
            <h3>This patient uses DentoGraph to own their dental records</h3>
            <p>Dental records explained visually, shared securely, and controlled by the patient.</p>
          </div>
          <Link href="/signup" className="btn btn-primary btn-lg">Create free account →</Link>
        </div>
      </div>
    </div>
  );
}

function isMissingTable(error: unknown) {
  return Boolean(
    error &&
    typeof error === 'object' &&
    'code' in error &&
    (error as { code?: string }).code === 'PGRST205'
  );
}
