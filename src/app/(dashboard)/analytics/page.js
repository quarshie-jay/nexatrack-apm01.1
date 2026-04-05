'use client';

import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend, PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, TrendingDown, Clock, Users } from 'lucide-react';
import TopBar from '@/components/TopBar';
import SummaryCard from '@/components/SummaryCard';
import { generateDailyUsage, MOCK_METERS, TARIFF_RATE } from '@/lib/mockData';
import styles from './page.module.css';

const COLORS = ['#0D9488', '#14B8A6', '#2DD4BF', '#5EEAD4', '#99F6E4', '#A3E635', '#FBBF24', '#F97316', '#EF4444', '#8B5CF6'];

const ChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipLabel}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} className={styles.tooltipValue} style={{ color: p.color }}>
            {p.name}: {p.value} {p.name.includes('Cost') ? '₵' : 'kWh'}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const dailyData = useMemo(() => generateDailyUsage(), []);

  const topConsumers = useMemo(() =>
    [...MOCK_METERS]
      .sort((a, b) => b.totalKwh - a.totalKwh)
      .slice(0, 10)
      .map(m => ({
        name: m.meterName,
        tenant: m.tenantName,
        consumption: m.totalKwh,
        cost: +(m.totalKwh * TARIFF_RATE).toFixed(2),
      }))
  , []);

  const totalMonthly = dailyData.reduce((s, d) => s + d.consumption, 0);
  const avgDaily = totalMonthly / dailyData.length;
  const peakDay = dailyData.reduce((max, d) => d.consumption > max.consumption ? d : max, dailyData[0]);

  const statusData = useMemo(() => {
    const online = MOCK_METERS.filter(m => m.status === 'online').length;
    const offline = MOCK_METERS.filter(m => m.status === 'offline').length;
    return [
      { name: 'Online', value: online },
      { name: 'Offline', value: offline },
    ];
  }, []);

  return (
    <>
      <TopBar title="Usage Analytics" subtitle="Consumption trends and insights" />

      <div className={styles.content}>
        {/* Summary */}
        <div className={styles.summaryGrid}>
          <SummaryCard
            icon={TrendingUp}
            label="Monthly Consumption"
            value={`${totalMonthly.toFixed(0)}`}
            unit="kWh"
            trend="6.3%"
            trendDirection="up"
            subtitle="Last 30 days"
          />
          <SummaryCard
            icon={Clock}
            label="Daily Average"
            value={`${avgDaily.toFixed(0)}`}
            unit="kWh"
            subtitle="Per day avg."
          />
          <SummaryCard
            icon={TrendingDown}
            label="Peak Day"
            value={`${peakDay.consumption.toFixed(0)}`}
            unit="kWh"
            subtitle={peakDay.date}
          />
          <SummaryCard
            icon={Users}
            label="Monthly Revenue"
            value={`₵${(totalMonthly * TARIFF_RATE).toFixed(0)}`}
            trend="5.1%"
            trendDirection="up"
            subtitle="From consumption"
          />
        </div>

        {/* Daily consumption chart */}
        <div className={`card ${styles.chartCard}`}>
          <div className={styles.chartHeader}>
            <h2 className={styles.chartTitle}>Daily Consumption — Last 30 Days</h2>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: '#94A3B8' }}
                  axisLine={{ stroke: '#E2E8F0' }}
                  tickLine={false}
                  interval={2}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#94A3B8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 12, color: '#94A3B8' }}
                />
                <Bar dataKey="peak" name="Peak" fill="#0D9488" radius={[3, 3, 0, 0]} stackId="stack" />
                <Bar dataKey="offPeak" name="Off-Peak" fill="#5EEAD4" radius={[3, 3, 0, 0]} stackId="stack" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.twoCol}>
          {/* Top consumers */}
          <div className={`card ${styles.tableSection}`}>
            <div className={styles.chartHeader}>
              <h2 className={styles.chartTitle}>Top 10 Consumers</h2>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: 40 }}>#</th>
                    <th>Unit</th>
                    <th>Tenant</th>
                    <th className="text-right">kWh</th>
                    <th className="text-right">Cost (₵)</th>
                  </tr>
                </thead>
                <tbody>
                  {topConsumers.map((c, i) => (
                    <tr key={i}>
                      <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                      <td style={{ fontWeight: 500 }}>{c.name}</td>
                      <td>{c.tenant}</td>
                      <td className="text-right">{c.consumption.toFixed(1)}</td>
                      <td className="text-right">{c.cost.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Meter status pie */}
          <div className={`card ${styles.pieSection}`}>
            <div className={styles.chartHeader}>
              <h2 className={styles.chartTitle}>Meter Status Distribution</h2>
            </div>
            <div className={styles.pieContainer}>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    <Cell fill="#16A34A" />
                    <Cell fill="#DC2626" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className={styles.pieLegend}>
                {statusData.map((entry, i) => (
                  <div key={i} className={styles.pieLegendItem}>
                    <span
                      className={styles.pieLegendDot}
                      style={{ background: i === 0 ? '#16A34A' : '#DC2626' }}
                    />
                    <span>{entry.name}</span>
                    <strong>{entry.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
