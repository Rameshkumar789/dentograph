'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import styles from './ShareButton.module.css';

export default function ShareButton({ recordId, shareToken, shareEnabled: initialEnabled }: {
  recordId: string;
  shareToken: string;
  shareEnabled: boolean;
}) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/share/${shareToken}`
    : '';

  async function toggle() {
    setLoading(true);
    await supabase.from('records').update({ share_enabled: !enabled }).eq('id', recordId);
    setEnabled(e => !e);
    setLoading(false);
  }

  async function copyLink() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>🔗 Second Opinion Sharing</div>
          <div className={styles.sub}>Share your full record with any doctor — no login needed for them</div>
        </div>
        <button
          onClick={toggle}
          disabled={loading}
          className={`${styles.toggle} ${enabled ? styles.toggleOn : ''}`}
        >
          <span className={styles.toggleThumb} />
        </button>
      </div>

      {enabled && (
        <div className={styles.linkRow}>
          <div className={styles.linkBox}>{shareUrl}</div>
          <button onClick={copyLink} className={`btn btn-ghost btn-sm ${styles.copyBtn}`}>
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
      )}

      {enabled && (
        <p className={styles.note}>
          Anyone with this link can view your 3D model and report — but cannot edit or download your files. You can disable sharing anytime.
        </p>
      )}
    </div>
  );
}
