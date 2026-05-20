'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bot, FolderOpen, Home, LogOut, PanelLeftClose, PanelLeftOpen, Share2, UserRound, type LucideIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import styles from './PatientPortalShell.module.css';

type PatientNavLabel = 'Home' | 'Records' | 'DentoBot' | 'Share' | 'Profile';

const navIcons: Record<PatientNavLabel, LucideIcon> = {
  Home,
  Records: FolderOpen,
  DentoBot: Bot,
  Share: Share2,
  Profile: UserRound,
};

export default function PatientPortalShell({
  active,
  latestRecordHref = '/records',
  children,
}: {
  active: PatientNavLabel;
  latestRecordHref?: string;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('dentographPatientNavCollapsed') === 'true';
  });
  const router = useRouter();
  const supabase = createClient();

  const navItems: Array<{ href: string; label: PatientNavLabel }> = [
    { href: '/dashboard', label: 'Home' },
    { href: '/records', label: 'Records' },
    { href: `${latestRecordHref}#dentobot`, label: 'DentoBot' },
    { href: '/shares', label: 'Share' },
    { href: '/profile', label: 'Profile' },
  ];

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/');
  }

  function toggleCollapsed() {
    setCollapsed((value) => {
      const next = !value;
      localStorage.setItem('dentographPatientNavCollapsed', String(next));
      return next;
    });
  }

  return (
    <div className={`${styles.shell} ${collapsed ? styles.collapsed : ''}`}>
      <aside className={styles.sidebar}>
        <div className={styles.logoRow}>
          <Link href="/dashboard" className={styles.logoWrap} title="Dashboard">
            <Image
              src={collapsed ? '/dentograph-mark-transparent.png' : '/dentograph-logo-transparent.png'}
              alt="DentoGraph"
              width={collapsed ? 34 : 150}
              height={collapsed ? 34 : 34}
              priority
            />
          </Link>
        </div>

        <button className={styles.collapseBtn} onClick={toggleCollapsed} aria-label={collapsed ? 'Open navigation' : 'Close navigation'}>
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>

        <nav className={styles.sideNav} aria-label="Patient portal navigation">
          {navItems.map((item) => {
            const Icon = navIcons[item.label];
            return (
              <Link key={item.label} href={item.href} className={item.label === active ? styles.activeNav : ''} title={item.label}>
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <button className={styles.signOut} onClick={handleSignOut} title="Sign out">
          <LogOut size={17} />
          <span>Sign out</span>
        </button>
      </aside>

      <div className={styles.content}>{children}</div>

      <nav className={styles.mobileNav} aria-label="Mobile patient navigation">
        {navItems.map((item) => {
          const Icon = navIcons[item.label];
          return (
            <Link key={item.label} href={item.href} className={item.label === active ? styles.activeMobile : ''}>
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
