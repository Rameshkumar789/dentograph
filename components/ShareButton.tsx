'use client';
import { useState } from 'react';
import styles from './ShareButton.module.css';
import { Check, Copy, Link2, Lock, Share2, X } from 'lucide-react';

export default function ShareButton({ recordId, shareToken, shareEnabled: initialEnabled }: {
  recordId: string;
  shareToken: string;
  shareEnabled: boolean;
}) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [token, setToken] = useState(shareToken);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/share/${token}`
    : '';

  async function toggle() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/shares', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recordId, enabled: !enabled }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to update share link');
      setEnabled(data.enabled);
      if (data.token) setToken(data.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update share link');
    } finally {
      setLoading(false);
    }
  }

  async function copyLink() {
    if (!token) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={styles.sharePanel}>
      <div className={styles.statusRow}>
        <div className={enabled ? styles.sharedIcon : styles.privateIcon}>
          {enabled ? <Link2 size={18} /> : <Lock size={18} />}
        </div>
        <div>
          <strong>{enabled ? 'Sharing is on' : 'This record is private'}</strong>
          <p>{enabled ? 'Anyone with the link can view a read-only copy.' : 'Create a read-only link when a dental professional needs this record.'}</p>
        </div>
      </div>

      {enabled && token ? (
        <div className={styles.linkBox}>
          <span>{shareUrl}</span>
          <button type="button" onClick={copyLink}>
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? 'Copied' : 'Copy link'}
          </button>
        </div>
      ) : (
        <div className={styles.privateBox}>No public link exists for this record.</div>
      )}

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.buttonRow}>
        <button type="button" onClick={toggle} disabled={loading} className={enabled ? styles.disableButton : styles.enableButton}>
          {enabled ? <X size={16} /> : <Share2 size={16} />}
          {loading ? 'Updating...' : enabled ? 'Turn off link' : 'Create share link'}
        </button>
      </div>
    </div>
  );
}
