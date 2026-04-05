'use client';

import { useState, useMemo } from 'react';
import { Zap, Wifi, AlertTriangle, DollarSign, Plus } from 'lucide-react';
import TopBar from '@/components/TopBar';
import SummaryCard from '@/components/SummaryCard';
import MeterCard from '@/components/MeterCard';
import FilterTabs from '@/components/FilterTabs';
import { MOCK_METERS, getMeterSummary } from '@/lib/mockData';
import styles from './page.module.css';

const FILTER_TABS = [
  { label: 'All', value: 'all' },
  { label: 'Online', value: 'online' },
  { label: 'Offline', value: 'offline' },
  { label: 'Low Credit', value: 'low_credit' },
];

export default function DashboardPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const summary = useMemo(() => getMeterSummary(MOCK_METERS), []);

  const filteredMeters = useMemo(() => {
    let meters = MOCK_METERS;

    if (activeFilter === 'online') {
      meters = meters.filter(m => m.status === 'online');
    } else if (activeFilter === 'offline') {
      meters = meters.filter(m => m.status === 'offline');
    } else if (activeFilter === 'low_credit') {
      meters = meters.filter(m => m.creditBalance < 50);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      meters = meters.filter(m =>
        m.meterName.toLowerCase().includes(q) ||
        m.meterSerial.toLowerCase().includes(q) ||
        m.tenantName.toLowerCase().includes(q)
      );
    }

    return meters;
  }, [activeFilter, searchQuery]);

  const counts = useMemo(() => ({
    all: MOCK_METERS.length,
    online: MOCK_METERS.filter(m => m.status === 'online').length,
    offline: MOCK_METERS.filter(m => m.status === 'offline').length,
    low_credit: MOCK_METERS.filter(m => m.creditBalance < 50).length,
  }), []);

  return (
    <>
      <TopBar title="Dashboard" subtitle="NEXATRACK APM01 Metering Overview" />

      <div className={styles.content}>
        {/* Summary Row */}
        <div className={styles.summaryGrid}>
          <SummaryCard
            icon={Zap}
            label="Total System Load"
            value={summary.totalLoad}
            unit="kW"
            trend="4.2%"
            trendDirection="up"
            subtitle="vs. yesterday"
          />
          <SummaryCard
            icon={Wifi}
            label="Active Meters"
            value={`${summary.onlineCount}`}
            subtitle={`${summary.onlineCount} of ${summary.totalCount} online`}
          />
          <SummaryCard
            icon={AlertTriangle}
            label="Critical Alerts"
            value={summary.criticalAlerts}
            subtitle={`${summary.offlineCount} offline · ${summary.lowCreditCount} low credit`}
          />
          <SummaryCard
            icon={DollarSign}
            label="Revenue Today"
            value={`₵${summary.totalRevenue.toLocaleString()}`}
            trend="2.1%"
            trendDirection="up"
            subtitle="from kWh consumption"
          />
        </div>

        {/* Filter and Actions */}
        <div className={styles.toolbar}>
          <FilterTabs
            tabs={FILTER_TABS}
            activeTab={activeFilter}
            onTabChange={setActiveFilter}
            counts={counts}
          />

          <div className={styles.toolbarRight}>
            <input
              type="text"
              placeholder="Filter meters..."
              className="input"
              style={{ width: 200, height: 34 }}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              id="meter-search"
            />
            <button className="btn btn-primary" id="add-meter-btn">
              <Plus size={16} />
              <span>Add Meter</span>
            </button>
          </div>
        </div>

        {/* Meter count */}
        <div className={styles.meterCount}>
          <span>{filteredMeters.length} of {MOCK_METERS.length} meters</span>
        </div>

        {/* Meter Grid */}
        <div className={styles.meterGrid}>
          {filteredMeters.map(meter => (
            <MeterCard key={meter.id} meter={meter} />
          ))}
        </div>

        {filteredMeters.length === 0 && (
          <div className={styles.empty}>
            <p>No meters match the current filters.</p>
          </div>
        )}
      </div>
    </>
  );
}
