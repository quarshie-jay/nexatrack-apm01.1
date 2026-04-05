'use client';

import { useState, useEffect } from 'react';
import { Zap, Clock } from 'lucide-react';
import styles from './MeterCard.module.css';

function formatTimeAgo(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function TimeAgo({ iso }) {
  const [text, setText] = useState('—');
  useEffect(() => {
    setText(formatTimeAgo(iso));
    const interval = setInterval(() => setText(formatTimeAgo(iso)), 60000);
    return () => clearInterval(interval);
  }, [iso]);
  return <span>{text}</span>;
}

export default function MeterCard({ meter, onClick }) {
  const isOnline = meter.status === 'online';
  const isLowCredit = meter.creditBalance < 50;

  return (
    <div
      className={styles.card}
      onClick={() => onClick?.(meter)}
      role="button"
      tabIndex={0}
      id={`meter-card-${meter.id}`}
    >
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h3 className={styles.name}>{meter.meterName}</h3>
          <span className={styles.serial}>{meter.meterSerial}</span>
        </div>
        <div className={styles.headerRight}>
          <Zap size={14} className={styles.zapIcon} />
        </div>
      </div>

      <div className={styles.loadSection}>
        <span className={styles.loadValue}>{meter.currentLoad.toFixed(2)}</span>
        <span className={styles.loadUnit}>kW</span>
      </div>

      <div className={styles.meta}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Credit</span>
          <span className={`${styles.metaValue} ${isLowCredit ? styles.lowCredit : ''}`}>
            ₵{meter.creditBalance.toFixed(2)}
          </span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Total Used</span>
          <span className={styles.metaValue}>{meter.totalKwh.toFixed(1)} kWh</span>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={`${styles.status} ${isOnline ? styles.statusOnline : styles.statusOffline}`}>
          <span className={styles.statusDot} />
          <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
        </div>
        <div className={styles.lastSeen}>
          <Clock size={12} />
          <TimeAgo iso={meter.lastSeenAt} />
        </div>
      </div>
    </div>
  );
}
