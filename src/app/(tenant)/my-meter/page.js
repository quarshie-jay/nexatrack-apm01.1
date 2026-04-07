'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, Activity, Battery, AlertCircle, PlusCircle, ArrowRight, TrendingUp } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { useAuth } from '@/components/AuthContext';
import TopBar from '@/components/TopBar';
import { MOCK_METERS, generateHourlyUsage } from '@/lib/mockData';
import styles from './page.module.css';

export default function MyMeter() {
  const { user } = useAuth();
  const router = useRouter();
  const [meter, setMeter] = useState(null);
  const [usageData, setUsageData] = useState([]);

  useEffect(() => {
    if (user?.meterId) {
      const found = MOCK_METERS.find(m => m.id === user.meterId);
      if (found) {
        setMeter(found);
        setUsageData(generateHourlyUsage(user.meterId));
      }
    }
  }, [user]);

  if (!user) return null;

  if (!meter) {
    return (
      <>
        <TopBar title="My Meter" subtitle="Loading meter data..." />
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>My Meter</h1>
            <p className={styles.subtitle}>Loading meter data...</p>
          </div>
        </div>
      </>
    );
  }

  const isLowCredit = meter.creditBalance < 50;
  const isCriticalCount = meter.creditBalance < 20;

  return (
    <>
      <TopBar title="My Meter" subtitle={`Apartment ${meter.unitNumber} · NEXATRACK APM01`} />
      <div className={styles.container}>

      <div className={styles.header}>
        <h1 className={styles.title}>My Meter Overview</h1>
        <p className={styles.subtitle}>Welcome back, {user.name}. Here is your current usage and balance.</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.mainCard}>
          <div className={styles.balanceLabel}>Current Credit Balance</div>
          <div className={`${styles.balanceValue} ${isCriticalCount ? styles.balanceCritical : isLowCredit ? styles.balanceWarn : styles.balanceGood}`}>
            ₵{meter.creditBalance.toFixed(2)}
          </div>
          
          <div className={styles.actions}>
            <Link href="/my-topup" className={styles.topupBtn}>
              <PlusCircle size={18} />
              Top-Up Now
            </Link>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <span className={styles.statLabel}>METER STATUS</span>
            <div>
              <span className={`${styles.statusBadge} ${meter.status === 'offline' ? styles.statusBadgeOffline : ''}`}>
                <span className={`${styles.dot} ${meter.status === 'online' ? styles.animatePulse : ''}`}></span>
                {meter.status}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>Current Load</span>
              <Activity size={18} className={styles.statIcon} />
            </div>
            <div className={styles.statValue}>{meter.currentLoad.toFixed(2)}</div>
            <div className={styles.statLabel}>kW</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>Total Consumed</span>
              <Zap size={18} className={styles.statIcon} />
            </div>
            <div className={styles.statValue}>{meter.totalKwh.toFixed(1)}</div>
            <div className={styles.statLabel}>kWh</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>Voltage</span>
              <Battery size={18} className={styles.statIcon} />
            </div>
            <div className={styles.statValue}>{meter.voltage.toFixed(1)}</div>
            <div className={styles.statLabel}>V</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>Power Factor</span>
              <Activity size={18} className={styles.statIcon} />
            </div>
            <div className={styles.statValue}>{meter.powerFactor.toFixed(2)}</div>
            <div className={styles.statLabel}>PF</div>
          </div>
        </div>
      </div>

      <div className={styles.chartSection}>
        <div className={styles.chartHeader}>
          <div className={styles.chartTitleRow}>
            <TrendingUp size={20} className={styles.chartIcon} />
            <h2 className={styles.chartTitle}>Consumption Trends (Last 24h)</h2>
          </div>
        </div>
        <div className={styles.chartBody}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={usageData}>
              <defs>
                <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--teal-600)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--teal-600)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: 'var(--text-muted)', fontSize: 12}}
                minTickGap={30}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: 'var(--text-muted)', fontSize: 12}}
                unit="W"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--bg-primary)', 
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-md)'
                }}
                itemStyle={{ color: 'var(--teal-600)', fontWeight: 600 }}
              />
              <Area 
                type="monotone" 
                dataKey="consumption" 
                stroke="var(--teal-600)" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorUsage)" 
                name="Usage"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      </div>
    </>
  );
}
