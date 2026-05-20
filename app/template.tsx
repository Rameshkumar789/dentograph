'use client';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPortalPage = ['/dashboard', '/records', '/shares', '/profile', '/request-records'].some((path) => pathname?.startsWith(path));

  if (isPortalPage) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ ease: 'easeOut', duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}
