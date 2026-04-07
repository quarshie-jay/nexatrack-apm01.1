'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle2, CreditCard } from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import TopBar from '@/components/TopBar';
import { MOCK_METERS, TARIFF_RATE } from '@/lib/mockData';
import styles from './page.module.css';

export default function MyTopUp() {
  const { user } = useAuth();
  const router = useRouter();
  const [meter, setMeter] = useState(null);
  
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (user?.meterId) {
      const found = MOCK_METERS.find(m => m.id === user.meterId);
      if (found) setMeter(found);
    }
  }, [user]);

  const quickAmounts = [20, 50, 100, 200];
  const equivalentKwh = amount ? (Number(amount) / TARIFF_RATE).toFixed(1) : '0.0';

  const handleTopUp = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) < 5) return;
    
    setIsProcessing(true);
    
    // Simulate Paystack processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (!user || (!meter && user)) {
    return null;
  }

  if (isSuccess) {
    return (
      <>
        <TopBar title="Top-Up Successful" subtitle="Credits Added" />
        <div className={styles.container}>
          <div className={styles.topUpCard}>
            <div className={styles.successState}>
              <div className={styles.successIcon}>
                <CheckCircle2 size={32} />
              </div>
              <h2 className={styles.successTitle}>Top-Up Successful</h2>
              <p className={styles.successDesc}>
                ₵{parseFloat(amount).toFixed(2)} ({equivalentKwh} kWh) has been added to Unit {meter.unitNumber}.
              </p>
              <div className={styles.actions}>
                <button 
                  className={styles.submitBtn}
                  onClick={() => {
                    setIsSuccess(false);
                    setAmount('');
                  }}
                >
                  Make Another Payment
                </button>
                <Link href="/my-meter" className={styles.backBtn}>
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar title="Top-Up Credits" subtitle="Add Energy Credits to your Meter" />
      <div className={styles.container}>

      <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px' }}>Top-Up Credits</h1>
      
      <div className={styles.topUpCard}>
        <form onSubmit={handleTopUp}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Select Meter</label>
            <input 
              type="text" 
              className={`${styles.input} ${styles.readonlyInput}`} 
              value={`${meter.meterName} - ${meter.meterSerial}`} 
              readOnly 
              disabled 
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Amount (GHS)</label>
            <input
              type="number"
              className={styles.input}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount (min ₵5.00)"
              min="5"
              step="0.01"
              required
            />
            
            <div className={styles.quickSelectGrid}>
              {quickAmounts.map(val => (
                <button
                  key={val}
                  type="button"
                  className={styles.quickBtn}
                  onClick={() => setAmount(val.toString())}
                >
                  ₵{val}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Summary</label>
            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span>Current Rate</span>
                <span>₵{TARIFF_RATE.toFixed(2)} / kWh</span>
              </div>
              <div className={styles.summaryRow} style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
                <span>Estimated Energy</span>
                <span className={styles.summaryValue}>{equivalentKwh} kWh</span>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={isProcessing || !amount || Number(amount) < 5}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
          >
            {isProcessing ? 'Processing Transaction...' : (
              <>
                <CreditCard size={18} />
                Pay ₵{amount ? parseFloat(amount).toFixed(2) : '0.00'}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
    </>
  );
}
