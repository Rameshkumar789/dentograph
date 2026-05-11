import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DentoGraph — Own Your Dental Health',
  description: 'The first patient-owned dental record portal. Upload your X-rays, understand your health in plain English, and share securely with any doctor for a second opinion.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
