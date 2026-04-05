import styles from './SummaryCard.module.css';

export default function SummaryCard({ icon: Icon, label, value, unit, subtitle, trend, trendDirection }) {
  return (
    <div className={`card ${styles.card}`}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        {Icon && (
          <div className={styles.iconWrap}>
            <Icon size={18} />
          </div>
        )}
      </div>
      <div className={styles.valueRow}>
        <span className={styles.value}>{value}</span>
        {unit && <span className={styles.unit}>{unit}</span>}
      </div>
      {(subtitle || trend) && (
        <div className={styles.footer}>
          {trend && (
            <span className={`${styles.trend} ${trendDirection === 'up' ? styles.trendUp : styles.trendDown}`}>
              {trendDirection === 'up' ? '↑' : '↓'} {trend}
            </span>
          )}
          {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
