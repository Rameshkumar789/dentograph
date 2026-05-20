'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, Clock3, Copy, Link2, Lock, Share2, ShieldCheck, X } from 'lucide-react';
import PatientPortalShell from '@/components/PatientPortalShell';
import { createClient } from '@/lib/supabase';
import styles from './shares.module.css';

interface DentalRecord {
  id: string;
  record_type: string;
  dentist_name?: string;
  clinic_name?: string;
  visit_date?: string;
  created_at: string;
  share_enabled?: boolean;
  share_token?: string;
  ai_findings?: { patient_summary?: string };
}

interface RecordShare {
  id: string;
  record_id: string;
  token: string;
  recipient_label?: string | null;
  recipient_email?: string | null;
  expires_at?: string | null;
  revoked_at?: string | null;
  created_at: string;
}

export default function SharesPage() {
  const [records, setRecords] = useState<DentalRecord[]>([]);
  const [shares, setShares] = useState<RecordShare[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyRecordId, setBusyRecordId] = useState('');
  const [copiedRecordId, setCopiedRecordId] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const [{ data: recordData }, { data: shareData, error: shareError }] = await Promise.all([
        supabase
          .from('records')
          .select('id, record_type, dentist_name, clinic_name, visit_date, created_at, share_enabled, share_token, ai_findings')
          .eq('patient_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('record_shares')
          .select('id, record_id, token, recipient_label, recipient_email, expires_at, revoked_at, created_at')
          .is('revoked_at', null)
          .order('created_at', { ascending: false }),
      ]);

      if (cancelled) return;
      setRecords(recordData || []);
      setShares(shareError ? [] : shareData || []);
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [router, supabase]);

  const shareByRecord = useMemo(() => {
    return new Map(shares.map((share) => [share.record_id, share]));
  }, [shares]);

  const activeShareCount = records.filter((record) => getShare(record, shareByRecord)).length;
  const latest = records[0];
  const latestHref = latest ? `/records/${latest.id}` : '/records';

  async function setSharing(record: DentalRecord, enabled: boolean) {
    setBusyRecordId(record.id);
    setError('');
    try {
      const res = await fetch('/api/shares', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recordId: record.id, enabled }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to update sharing');

      setRecords((current) => current.map((item) => (
        item.id === record.id
          ? { ...item, share_enabled: data.enabled, share_token: data.token || item.share_token }
          : item
      )));

      setShares((current) => {
        const withoutRecord = current.filter((share) => share.record_id !== record.id);
        if (!enabled || !data.token || data.fallback) return withoutRecord;
        return [{
          id: data.shareId || data.token,
          record_id: record.id,
          token: data.token,
          expires_at: data.expiresAt || null,
          created_at: new Date().toISOString(),
        }, ...withoutRecord];
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update sharing');
    } finally {
      setBusyRecordId('');
    }
  }

  async function copyShare(record: DentalRecord) {
    const share = getShare(record, shareByRecord);
    if (!share?.token) return;
    await navigator.clipboard.writeText(`${window.location.origin}/share/${share.token}`);
    setCopiedRecordId(record.id);
    setTimeout(() => setCopiedRecordId(''), 1800);
  }

  return (
    <PatientPortalShell active="Share" latestRecordHref={latestHref}>
      <main className={styles.main}>
        <section className={styles.hero}>
          <div>
            <p className={styles.kicker}>Sharing</p>
            <h1>Manage record access</h1>
            <p>Approve who can see your dental records, turn links off, and keep sharing activity clear.</p>
          </div>
          <div className={styles.heroStat}>
            <span>Active links</span>
            <strong>{activeShareCount}</strong>
          </div>
        </section>

        <section className={styles.requestPanel}>
          <div className={styles.panelIcon}><Clock3 size={20} /></div>
          <div>
            <h2>Access requests</h2>
            <p>No pending requests right now. When a dentist or specialist asks for access, you will be able to approve or decline it here.</p>
          </div>
          <div className={styles.requestActions}>
            <button type="button" disabled><Check size={16} /> Approve</button>
            <button type="button" disabled><X size={16} /> Decline</button>
          </div>
        </section>

        {error && <div className={styles.error}>{error}</div>}

        <section className={styles.recordsPanel}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.kicker}>Your records</p>
              <h2>Share settings</h2>
            </div>
            <Link href="/records">View records</Link>
          </div>

          {loading ? (
            <div className={styles.skeleton} />
          ) : records.length === 0 ? (
            <div className={styles.empty}>
              <Lock size={26} />
              <h3>No records to share yet</h3>
              <p>Upload or request records first, then decide who can access them.</p>
              <Link href="/records">Go to records</Link>
            </div>
          ) : (
            <div className={styles.shareList}>
              {records.map((record) => {
                const share = getShare(record, shareByRecord);
                const date = new Date(record.visit_date || record.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                return (
                  <article key={record.id} className={styles.shareRow}>
                    <div className={share ? styles.sharedBadge : styles.privateBadge}>
                      {share ? <Link2 size={18} /> : <ShieldCheck size={18} />}
                    </div>
                    <div className={styles.recordText}>
                      <h3>{record.clinic_name || record.dentist_name || 'Dental record'}</h3>
                      <p>{record.ai_findings?.patient_summary || `${record.record_type} record from ${date}`}</p>
                      <div className={styles.meta}>
                        <span>{date}</span>
                        <span>{share ? 'Read-only link active' : 'Private'}</span>
                        {share?.expires_at && <span>Expires {new Date(share.expires_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
                      </div>
                    </div>
                    <div className={styles.rowActions}>
                      {share && (
                        <button type="button" onClick={() => copyShare(record)}>
                          {copiedRecordId === record.id ? <Check size={16} /> : <Copy size={16} />}
                          {copiedRecordId === record.id ? 'Copied' : 'Copy link'}
                        </button>
                      )}
                      <button
                        type="button"
                        className={share ? styles.revokeButton : styles.enableButton}
                        onClick={() => setSharing(record, !share)}
                        disabled={busyRecordId === record.id}
                      >
                        {share ? <X size={16} /> : <Share2 size={16} />}
                        {busyRecordId === record.id ? 'Updating...' : share ? 'Turn off' : 'Create link'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </PatientPortalShell>
  );
}

function getShare(record: DentalRecord, shareByRecord: Map<string, RecordShare>) {
  const directShare = shareByRecord.get(record.id);
  if (directShare) return directShare;
  if (record.share_enabled && record.share_token) {
    return {
      id: record.share_token,
      record_id: record.id,
      token: record.share_token,
      created_at: record.created_at,
    };
  }
  return null;
}
