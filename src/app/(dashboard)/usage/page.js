'use client';

import { useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';
import TopBar from '@/components/TopBar';
import { MOCK_METERS, generateHourlyUsage } from '@/lib/mockData';
import styles from './page.module.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipLabel}>{label}</p>
        <p className={styles.tooltipValue}>{payload[0].value} kW</p>
        <p className={styles.tooltipCost}>₵{(payload[0].value * 0.85).toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

export default function UsagePage() {
  const hourlyData = useMemo(() => generateHourlyUsage(), []);
  const [selectedMeter, setSelectedMeter] = useState('all');

  return (
    <>
      <TopBar title="Electricity Usage" subtitle="Real-time consumption monitoring" />

      <div className={styles.content}>
        {/* Live indicator */}
        <div className={styles.liveBar}>
          <div className={styles.liveIndicator}>
            <span className="live-dot" />
            <span className={styles.liveText}>Live — Auto-refreshing every 10s</span>
          </div>
          <select
            className="input"
            style={{ width: 200, height: 34 }}
            value={selectedMeter}
            onChange={e => setSelectedMeter(e.target.value)}
            id="meter-select"
          >
            <option value="all">All Meters (Aggregate)</option>
            {MOCK_METERS.filter(m => m.status === 'online').map(m => (
              <option key={m.id} value={m.id}>{m.meterName} — {m.meterSerial}</option>
            ))}
          </select>
        </div>

        {/* Chart */}
        <div className={`card ${styles.chartCard}`}>
          <div className={styles.chartHeader}>
            <h2 className={styles.chartTitle}>Consumption — Last 24 Hours</h2>
            <div className={styles.chartMeta}>
              <span className={styles.chartMetaItem}>
                Total: <strong>{hourlyData.reduce((s, d) => s + d.consumption, 0).toFixed(0)} kWh</strong>
              </span>
              <span className={styles.chartMetaItem}>
                Cost: <strong>₵{hourlyData.reduce((s, d) => s + d.cost, 0).toFixed(2)}</strong>
              </span>
            </div>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={hourlyData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 11, fill: '#94A3B8' }}
                  axisLine={{ stroke: '#E2E8F0' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#94A3B8' }}
                  axisLine={false}
                  tickLine={false}
                  unit=" kW"
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="consumption"
                  stroke="#0D9488"
                  strokeWidth={2}
                  fill="url(#colorConsumption)"
                  dot={false}
                  activeDot={{ r: 4, fill: '#0D9488', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Per-meter table */}
        <div className={`card ${styles.tableSection}`}>
          <div className={styles.tableHeader}>
            <h2 className={styles.chartTitle}>Per-Meter Breakdown</h2>
          </div>
          <div className={`table-container ${styles.tableWrap}`}>
            <table className="table">
              <thead>
                <tr>
                  <th>Meter</th>
                  <th>Tenant</th>
                  <th>Status</th>
                  <th className="text-right">Load (kW)</th>
                  <th className="text-right">Voltage (V)</th>
                  <th className="text-right">Current (A)</th>
                  <th className="text-right">PF</th>
                  <th className="text-right">Total (kWh)</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_METERS.map(m => (
                  <tr key={m.id}>
                    <td>
                      <div className={styles.meterName}>{m.meterName}</div>
                      <div className={styles.meterSerial}>{m.meterSerial}</div>
                    </td>
                    <td>{m.tenantName}</td>
                    <td>
                      <span className={`badge ${m.status === 'online' ? 'badge-online' : 'badge-offline'}`}>
                        <span className={`badge-dot ${m.status === 'online' ? 'badge-dot-online' : 'badge-dot-offline'}`} />
                        {m.status === 'online' ? 'Online' : 'Offline'}
                      </span>
                    </td>
                    <td className="text-right">{m.currentLoad.toFixed(2)}</td>
                    <td className="text-right">{m.voltage.toFixed(1)}</td>
                    <td className="text-right">{m.current.toFixed(2)}</td>
                    <td className="text-right">{m.powerFactor.toFixed(2)}</td>
                    <td className="text-right">{m.totalKwh.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
