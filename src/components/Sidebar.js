'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Zap, BarChart3, Users,
  CreditCard, Bell, Settings, LogOut, Activity, X
} from 'lucide-react';
import { useSidebar } from './SidebarContext';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/usage', label: 'Electricity Usage', icon: Zap },
  { href: '/analytics', label: 'Usage Analytics', icon: BarChart3 },
  { href: '/tenants', label: 'Tenant Management', icon: Users },
  { href: '/billing', label: 'Credits & Billing', icon: CreditCard },
  { href: '/alerts', label: 'Alerts', icon: Bell },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();

  const handleNavClick = () => {
    // Close sidebar on mobile when navigating
    close();
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`}
        onClick={close}
        aria-hidden="true"
      />

      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <Activity size={20} strokeWidth={2.5} />
          </div>
          <div className={styles.logoText}>
            <span className={styles.logoTitle}>NEXATRACK</span>
            <span className={styles.logoSub}>APM01 Gateway</span>
          </div>
          <button className={styles.closeBtn} onClick={close} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navSection}>
            <span className={styles.navLabel}>Main</span>
            {NAV_ITEMS.slice(0, 3).map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                  onClick={handleNavClick}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className={styles.navSection}>
            <span className={styles.navLabel}>Management</span>
            {NAV_ITEMS.slice(3, 6).map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                  onClick={handleNavClick}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className={styles.navSection}>
            <span className={styles.navLabel}>System</span>
            {NAV_ITEMS.slice(6).map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                  onClick={handleNavClick}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className={styles.footer}>
          <button className={styles.navItem}>
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
