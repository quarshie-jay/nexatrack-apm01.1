'use client';

import styles from './FilterTabs.module.css';

export default function FilterTabs({ tabs, activeTab, onTabChange, counts }) {
  return (
    <div className={styles.tabs}>
      {tabs.map(tab => (
        <button
          key={tab.value}
          className={`${styles.tab} ${activeTab === tab.value ? styles.tabActive : ''}`}
          onClick={() => onTabChange(tab.value)}
          id={`filter-tab-${tab.value}`}
        >
          <span>{tab.label}</span>
          {counts?.[tab.value] !== undefined && (
            <span className={styles.count}>{counts[tab.value]}</span>
          )}
        </button>
      ))}
    </div>
  );
}
