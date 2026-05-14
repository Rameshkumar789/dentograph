'use client';
import { useState } from 'react';
import styles from './ComingSoonModal.module.css';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
}

export default function ComingSoonModal({ isOpen, onClose, featureName }: ComingSoonModalProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Simulate API call to waitlist
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setEmail('');
    }, 3000);
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        
        <div className={styles.content}>
          <div className={styles.icon}>🚀</div>
          <h2 className={styles.title}>{featureName} is Coming Soon!</h2>
          <p className={styles.description}>
            We&apos;re currently in invite-only beta for this feature. 
            Join the waitlist to be notified as soon as it launches for your account.
          </p>

          {submitted ? (
            <div className={styles.success}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>✨</div>
              <h3>You&apos;re on the list!</h3>
              <p>We&apos;ll notify you at {email} when {featureName} is ready.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <input 
                type="email" 
                className="input" 
                placeholder="Enter your email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>
                Join the Waitlist →
              </button>
            </form>
          )}

          <div className={styles.footer}>
            <span className="badge badge-accent">DentoGraph Pro Exclusive</span>
          </div>
        </div>
      </div>
    </div>
  );
}
