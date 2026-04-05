'use client';

import Sidebar from '@/components/Sidebar';
import { SidebarProvider } from '@/components/SidebarContext';
import styles from './layout.module.css';

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <div className={styles.shell}>
        <Sidebar />
        <main className={styles.main}>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
