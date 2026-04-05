'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';
import TopBar from '@/components/TopBar';
import { TARIFF_RATE } from '@/lib/mockData';
import styles from './page.module.css';

export default function SettingsPage() {
  const [tariffRate, setTariffRate] = useState(TARIFF_RATE.toString());
  const [lowCreditThreshold, setLowCreditThreshold] = useState('50');
  const [refreshInterval, setRefreshInterval] = useState('10');
  const [currency, setCurrency] = useState('GHS');

  return (
    <>
      <TopBar title="Settings" subtitle="System configuration and preferences" />

      <div className={styles.content}>
        {/* Tariff Configuration */}
        <div className={`card ${styles.section}`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Tariff Configuration</h2>
            <p className={styles.sectionDesc}>Set the billing rate for electricity consumption.</p>
          </div>
          <div className={styles.fields}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="tariff-rate">Rate per kWh</label>
              <div className={styles.inputGroup}>
                <span className={styles.inputPrefix}>₵</span>
                <input
                  id="tariff-rate"
                  type="number"
                  step="0.01"
                  className={`input ${styles.inputWithPrefix}`}
                  value={tariffRate}
                  onChange={e => setTariffRate(e.target.value)}
                />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="currency">Currency</label>
              <select
                id="currency"
                className="input"
                value={currency}
                onChange={e => setCurrency(e.target.value)}
              >
                <option value="GHS">GHS — Ghana Cedi (₵)</option>
                <option value="USD">USD — US Dollar ($)</option>
                <option value="NGN">NGN — Naira (₦)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Alert Thresholds */}
        <div className={`card ${styles.section}`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Alert Thresholds</h2>
            <p className={styles.sectionDesc}>Configure when alerts are triggered for meters.</p>
          </div>
          <div className={styles.fields}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="low-credit-threshold">Low Credit Alert (₵)</label>
              <input
                id="low-credit-threshold"
                type="number"
                className="input"
                value={lowCreditThreshold}
                onChange={e => setLowCreditThreshold(e.target.value)}
              />
              <span className={styles.hint}>Alert when tenant credit drops below this amount.</span>
            </div>
          </div>
        </div>

        {/* Data Refresh */}
        <div className={`card ${styles.section}`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Data & Connection</h2>
            <p className={styles.sectionDesc}>InfluxDB connection and data refresh settings.</p>
          </div>
          <div className={styles.fields}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="refresh-interval">Dashboard Refresh Interval (seconds)</label>
              <select
                id="refresh-interval"
                className="input"
                value={refreshInterval}
                onChange={e => setRefreshInterval(e.target.value)}
              >
                <option value="5">5 seconds</option>
                <option value="10">10 seconds</option>
                <option value="30">30 seconds</option>
                <option value="60">60 seconds</option>
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="influx-url">InfluxDB URL</label>
              <input
                id="influx-url"
                type="text"
                className="input"
                placeholder="https://your-influxdb-instance.com"
                disabled
              />
              <span className={styles.hint}>Configure via environment variables. Connection not yet active.</span>
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="influx-bucket">InfluxDB Bucket</label>
              <input
                id="influx-bucket"
                type="text"
                className="input"
                placeholder="electricity_readings"
                disabled
              />
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button className="btn btn-primary" id="save-settings-btn">
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}
