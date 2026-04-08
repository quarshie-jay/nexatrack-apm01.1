'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Zap, PlusCircle, Activity, X, LogOut, User, CreditCard
} from 'lucide-react';
import { useSidebar } from './SidebarContext';
import { useAuth } from './AuthContext';
import styles from './TenantSidebar.module.css';

const NAV_ITEMS = [
  { href: '/my-meter', label: 'My Meter', icon: Zap },
  { href: '/transactions', label: 'Transactions', icon: CreditCard },
  { href: '/my-topup', label: 'Top-Up Credits', icon: PlusCircle },
  { href: '/profile', label: 'My Profile', icon: User },
];

export default function TenantSidebar() {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();
  const { user, activeMeterId, logout } = useAuth();

  const handleNavClick = () => {
    close();
  };

  return (
    <>
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
          </div>
          <button className={styles.closeBtn} onClick={close} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            <User size={20} />
          </div>
          <div className={styles.userDetails}>
            <span className={styles.userName}>{user?.name || 'Tenant User'}</span>
            <span className={styles.userUnit}>Unit {activeMeterId?.replace('meter-', '') || 'Unknown'}</span>
          </div>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navSection}>
            <span className={styles.navLabel}>Services</span>
            {NAV_ITEMS.map(item => {
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
          <button className={styles.navItem} onClick={logout}>
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
