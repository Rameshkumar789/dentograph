'use client';
import { QRCodeSVG } from 'qrcode.react';
import styles from './QRPortal.module.css';

export default function QRPortal({ userId }: { userId: string }) {
  const uploadUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/dentist-upload/${userId}`
    : `https://dentograph.app/dentist-upload/${userId}`;

  return (
    <div className={`card ${styles.qrCard}`}>
      <div className={styles.icon}>📱</div>
      <h3>Dentist Upload Portal</h3>
      <p>Show this QR code to your dentist. They scan it and upload your X-rays or prescriptions directly — no account needed.</p>

      <div className={styles.qrWrapper}>
        <QRCodeSVG
          value={uploadUrl}
          size={160}
          fgColor="#00d4aa"
          bgColor="transparent"
          level="M"
        />
      </div>

      <div className={styles.urlBox}>
        <span className={styles.urlText}>{uploadUrl.replace('https://', '')}</span>
      </div>

      <button
        className="btn btn-ghost btn-sm"
        style={{ width: '100%' }}
        onClick={() => navigator.clipboard.writeText(uploadUrl)}
      >
        Copy link
      </button>
    </div>
  );
}
