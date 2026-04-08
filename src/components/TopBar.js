'use client';

import { Search, Bell, ChevronDown, Menu } from 'lucide-react';
import { useSidebar } from './SidebarContext';
import { useAuth } from './AuthContext';
import { MOCK_METERS } from '@/lib/mockData';
import styles from './TopBar.module.css';

export default function TopBar({ title, subtitle }) {
  const { toggle } = useSidebar();
  const { user, activeMeterId, switchActiveMeter } = useAuth();

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
        {user?.role === 'tenant' && user?.meterIds?.length > 1 && (
          <select 
            className={styles.meterSwitcher}
            value={activeMeterId || user.meterIds[0]}
            onChange={(e) => switchActiveMeter(e.target.value)}
          >
            {user.meterIds.map(mid => {
              const meter = MOCK_METERS.find(m => m.id === mid);
              return (
                <option key={mid} value={mid}>
                  {meter ? meter.meterName : mid}
                </option>
              );
            })}
          </select>
        )}

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
          <div className={styles.avatar}>{user?.name?.charAt(0) || 'U'}</div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.name || 'User'}</span>
            <span className={styles.userRole}>
              {user?.role === 'admin' ? 'Property Manager' : 'Tenant'}
            </span>
          </div>
          <ChevronDown size={14} className={styles.chevron} />
        </div>
      </div>
    </header>
  );
}
