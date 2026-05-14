'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import styles from './RequestTracking.module.css';

const STATUS_MAP: Record<string, { label: string; color: string; step: number }> = {
  'pending':    { label: 'Request Sent', color: 'var(--text-muted)', step: 1 },
  'processing': { label: 'Clinic Processing', color: 'var(--yellow)', step: 2 },
  'fulfilled':  { label: 'Data Received', color: 'var(--green)', step: 3 },
  'denied':     { label: 'Request Denied', color: 'var(--red)', step: 3 },
};

export default function RequestTracking() {
  const [requests, setRequests] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchRequests() {
      const { data } = await supabase.from('ehi_requests').select('*').order('created_at', { ascending: false });
      setRequests(data || []);
    }
    fetchRequests();
  }, []);

  if (requests.length === 0) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>📬 Clinical Interoperability Hub</h3>
        <span className="badge badge-accent">ONC Cures Act Compliant</span>
      </div>

      <div className={styles.list}>
        {requests.map(req => {
          const status = STATUS_MAP[req.status] || STATUS_MAP.pending;
          return (
            <div key={req.id} className={styles.requestCard}>
              <div className={styles.cardHeader}>
                <div>
                  <div className={styles.clinicName}>{req.clinic_name}</div>
                  <div className={styles.date}>Requested on {new Date(req.created_at).toLocaleDateString()}</div>
                </div>
                <div className={styles.statusBadge} style={{ color: status.color }}>
                  {status.label}
                </div>
              </div>

              <div className={styles.stepper}>
                {[1, 2, 3].map(s => (
                  <div key={s} className={`${styles.step} ${status.step >= s ? styles.stepActive : ''}`} />
                ))}
              </div>
              
              {req.status === 'pending' && (
                <div className={styles.alert}>
                  ⚖️ This request is protected by the <strong>Information Blocking Rule</strong>. Clinics have 30 days to comply.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
