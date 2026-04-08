'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Zap, ArrowLeft, Edit2, MapPin, Hash, CheckCircle2, 
  CreditCard, Calendar, ShoppingBag, ArrowUpRight, Printer
} from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import TopBar from '@/components/TopBar';
import { MOCK_METERS, generateTransactions } from '@/lib/mockData';
import styles from './page.module.css';

export default function Transactions() {
  const { user, activeMeterId } = useAuth();
  const [meter, setMeter] = useState(null);
  const [txns, setTxns] = useState([]);
  const [activeTab, setActiveTab] = useState('This month');

  useEffect(() => {
    if (activeMeterId) {
      const found = MOCK_METERS.find(m => m.id === activeMeterId);
      if (found) {
        setMeter(found);
        setTxns(generateTransactions(activeMeterId));
      }
    }
  }, [activeMeterId]);

  if (!user || !meter) return null;

  // Calculate summary for distribution bar
  const topups = txns.filter(t => t.type === 'topup').length;
  const consumption = txns.filter(t => t.type === 'consumption').length;
  const adjustments = txns.filter(t => t.type === 'adjustment').length;
  const total = txns.length;

  const topupPercent = (topups / total) * 100;
  const consumptionPercent = (consumption / total) * 100;
  const adjustmentPercent = (adjustments / total) * 100;

  return (
    <>
      <TopBar title="Transactions" subtitle="Energy Credits & Usage History" />
      <div className={styles.container}>

      <header className={styles.heroSection}>
        <div className={styles.heroGrid}>
          {/* User Profile Card */}
          <div className={styles.profileCard}>
            <div className={styles.profileHeader}>
              <div>
                <h1 className={styles.userName}>
                  Meter Details
                </h1>
                <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.8 }}>Assigned to: {user.name}</p>
              </div>
              <Link href="/profile" className={styles.editBtn} aria-label="Settings">
                <Edit2 size={16} />
              </Link>
            </div>
            
            <div className={styles.meterBadges}>
              <div className={styles.infoBadge}>
                <Hash size={12} />
                {meter.meterSerial}
              </div>
              <div className={styles.infoBadge}>
                <MapPin size={12} />
                Unit {meter.unitNumber}
              </div>
              <div className={styles.infoBadge}>
                Prepaid
              </div>
            </div>
          </div>

          {/* Balance Card */}
          <div className={styles.balanceCard}>
            <div className={styles.balanceContent}>
              <div className={styles.balanceLabel}>Current Balance</div>
              <div className={styles.balanceValue}>
                <span className={styles.currency}>GHS</span> {meter.creditBalance.toFixed(2)}
              </div>
              <p className={styles.balanceDesc}>
                Top up your meter credits instantly.
              </p>
            </div>
            <div className={styles.ctaWrapper}>
              <Link href="/my-topup" className={styles.buyBtn}>
                <CreditCard size={18} />
                Buy Credit
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.contentWrap}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Transactions</h2>
            <p className={styles.sectionSubtitle}>
              Review your recent energy credits and usage history.
            </p>
          </div>
          <button onClick={() => window.print()} className={styles.printBtn} aria-label="Print Transactions">
            <Printer size={18} />
            <span>Print</span>
          </button>
        </div>


      <div className={styles.tabs}>
        {['This month', 'Last month', 'Last 3 months'].map(tab => (
          <button 
            key={tab} 
            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className={styles.summaryCard}>
        <div className={styles.summaryLabel}>
          <span>{total}</span> Total Transaction Count
        </div>
        
        <div className={styles.distBar}>
          <div 
            className={styles.barSegment} 
            style={{ width: `${topupPercent}%`, background: '#3b82f6' }} 
          />
          <div 
            className={styles.barSegment} 
            style={{ width: `${consumptionPercent}%`, background: '#f59e0b' }} 
          />
          <div 
            className={styles.barSegment} 
            style={{ width: `${adjustmentPercent}%`, background: '#10b981' }} 
          />
        </div>

        <div className={styles.distLegend}>
          <div className={styles.legendItem}>
            <div className={styles.legendLabel}>
              <div className={styles.dot} style={{ background: '#3b82f6' }} />
              Prepaid Top-Ups
            </div>
            <span>{topups}</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendLabel}>
              <div className={styles.dot} style={{ background: '#f59e0b' }} />
              Consumption Deductions
            </div>
            <span>{consumption}</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendLabel}>
              <div className={styles.dot} style={{ background: '#10b981' }} />
              Service Adjustments
            </div>
            <span>{adjustments}</span>
          </div>
        </div>
      </div>

      <div className={styles.txnList}>
        {txns.map(txn => (
          <div key={txn.id} className={styles.txnItem}>
            <div className={styles.txnIcon}>
              {txn.type === 'topup' ? <CreditCard size={20} /> : <Zap size={20} />}
            </div>
            <div className={styles.txnDetails}>
              <div className={styles.txnTitle}>{txn.description}</div>
              <div className={styles.txnType}>
                {txn.type === 'topup' ? 'Credit Addition' : txn.type === 'consumption' ? 'Usage Deduction' : 'System Adjustment'}
              </div>
              <div className={styles.txnDate}>
                {new Date(txn.createdAt).toLocaleDateString(undefined, { 
                  month: 'short', day: 'numeric', year: 'numeric' 
                })} • {new Date(txn.createdAt).toLocaleTimeString(undefined, {
                  hour: 'numeric', minute: '2-digit'
                })}
              </div>
            </div>
            <div className={`${styles.txnAmount} ${txn.amount > 0 ? styles.amountPositive : styles.amountNegative}`}>
              <span className={styles.amountText}>
                {txn.amount > 0 ? '+' : '-'} GHS {Math.abs(txn.amount).toFixed(2)}
              </span>
              {txn.amount > 0 && <CheckCircle2 size={18} className={styles.statusIcon} />}
            </div>
          </div>
        ))}
      </div>
      </div>
      </div>
    </>
  );
}
