'use client';

import TenantSidebar from '@/components/TenantSidebar';
import { SidebarProvider } from '@/components/SidebarContext';
import styles from '@/app/(dashboard)/layout.module.css'; // Reusing dashboard shell styles

export default function TenantLayout({ children }) {
  return (
    <SidebarProvider>
      <div className={styles.shell}>
        <TenantSidebar />
        <main className={styles.main}>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
