import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DentoGraph - Dental records, explained clearly',
  description: 'A patient-owned dental record portal for collecting X-rays, understanding dental terms in plain language, and sharing securely with trusted dental professionals.',
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
