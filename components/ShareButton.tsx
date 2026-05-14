'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import styles from './ShareButton.module.css';
import { Users } from 'lucide-react';

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

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-secondary btn-sm"
        style={{ height: '32px', border: 'none', background: '#f1f5f9', fontWeight: 700, fontSize: '0.75rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <Users size={14} /> Provider Share
      </button>

      {isOpen && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 100 }} onClick={() => setIsOpen(false)} />
          <div style={{
            position: 'absolute',
            top: '44px',
            right: 0,
            width: '320px',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(16px)',
            border: '1px solid #e2e8f0',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            zIndex: 101,
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <div className={styles.flexHeader} style={{ marginBottom: '16px' }}>
              <span className={styles.shareLabel} style={{ fontSize: '0.85rem' }}>Clinical Consultation</span>
              <button
                onClick={toggle}
                disabled={loading}
                className={`${styles.miniToggle} ${enabled ? styles.toggleOn : ''}`}
              >
                <span className={styles.miniThumb} />
              </button>
            </div>

            {enabled ? (
              <div className={styles.linkStrip} style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div className={styles.urlText} style={{ fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{shareUrl}</div>
                <button onClick={copyLink} className={styles.copyBtn} style={{ fontSize: '0.7rem' }}>
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            ) : (
              <div style={{ padding: '12px', background: '#f1f5f9', borderRadius: '12px', textAlign: 'center', fontSize: '0.75rem', color: '#64748b' }}>
                Consultation link is private.
              </div>
            )}
            
            <p className={styles.miniNote} style={{ marginTop: '16px', fontSize: '0.7rem', color: '#94a3b8', lineHeight: 1.5 }}>
              Share this secure link with your care team or a specialist for a collaborative review.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
