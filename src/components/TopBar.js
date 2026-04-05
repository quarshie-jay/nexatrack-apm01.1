'use client';

import { Search, Bell, ChevronDown, Menu } from 'lucide-react';
import { useSidebar } from './SidebarContext';
import styles from './TopBar.module.css';

export default function TopBar({ title, subtitle }) {
  const { toggle } = useSidebar();

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <button className={styles.menuBtn} onClick={toggle} aria-label="Toggle menu" id="mobile-menu-btn">
          <Menu size={20} />
        </button>
        <div>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search meters, tenants..."
            className={styles.searchInput}
            id="global-search"
          />
        </div>

        <button className={styles.iconBtn} id="notifications-btn" aria-label="Notifications">
          <Bell size={18} />
          <span className={styles.notifDot} />
        </button>

        <div className={styles.userMenu}>
          <div className={styles.avatar}>A</div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>Admin</span>
            <span className={styles.userRole}>Property Manager</span>
          </div>
          <ChevronDown size={14} className={styles.chevron} />
        </div>
      </div>
    </header>
  );
}
