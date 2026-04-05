'use client';

import { useMemo, useState, useEffect } from 'react';
import { AlertTriangle, WifiOff, Zap, Shield, CheckCircle } from 'lucide-react';
import TopBar from '@/components/TopBar';
import { generateAlerts } from '@/lib/mockData';
import styles from './page.module.css';

const ALERT_CONFIG = {
  low_credit: { icon: AlertTriangle, color: 'var(--amber-500)', bg: 'var(--amber-50)', label: 'Low Credit' },
  offline: { icon: WifiOff, color: 'var(--red-600)', bg: 'var(--red-50)', label: 'Offline' },
  spike: { icon: Zap, color: 'var(--teal-600)', bg: 'var(--teal-50)', label: 'Spike' },
  tamper: { icon: Shield, color: 'var(--red-600)', bg: 'var(--red-50)', label: 'Tamper' },
};

function formatTimeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function TimeAgo({ iso }) {
  const [text, setText] = useState('—');
  useEffect(() => {
    setText(formatTimeAgo(iso));
  }, [iso]);
  return <span>{text}</span>;
}

export default function AlertsPage() {
  const alerts = useMemo(() => generateAlerts(), []);
  const unreadCount = alerts.filter(a => !a.isRead).length;

  return (
    <>
      <TopBar title="Alerts" subtitle={`${unreadCount} unread alerts`} />

      <div className={styles.content}>
        <div className={styles.statsRow}>
          {Object.entries(ALERT_CONFIG).map(([type, config]) => {
            const count = alerts.filter(a => a.alertType === type).length;
            return (
              <div key={type} className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: config.bg, color: config.color }}>
                  <config.icon size={16} />
                </div>
                <div>
                  <div className={styles.statValue}>{count}</div>
                  <div className={styles.statLabel}>{config.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={`card ${styles.alertList}`}>
          {alerts.map(alert => {
            const config = ALERT_CONFIG[alert.alertType];
            const Icon = config.icon;
            return (
              <div
                key={alert.id}
                className={`${styles.alertItem} ${!alert.isRead ? styles.alertUnread : ''}`}
                id={`alert-${alert.id}`}
              >
                <div className={styles.alertIcon} style={{ background: config.bg, color: config.color }}>
                  <Icon size={16} />
                </div>
                <div className={styles.alertBody}>
                  <div className={styles.alertHeader}>
                    <span className={styles.alertMeter}>{alert.meterName}</span>
                    <span className={styles.alertBadge} style={{ background: config.bg, color: config.color }}>
                      {config.label}
                    </span>
                  </div>
                  <p className={styles.alertMessage}>{alert.message}</p>
                  <div className={styles.alertMeta}>
                    <span>{alert.tenantName}</span>
                    <span>·</span>
                    <TimeAgo iso={alert.createdAt} />
                  </div>
                </div>
                {!alert.isRead && (
                  <button className={styles.markReadBtn} aria-label="Mark as read">
                    <CheckCircle size={16} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
