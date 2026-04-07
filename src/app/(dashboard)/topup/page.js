'use client';

import { useState, useMemo } from 'react';
import { PlusCircle, CheckCircle, ArrowRight, Wallet, User, CreditCard } from 'lucide-react';
import Link from 'next/link';
import TopBar from '@/components/TopBar';
import { MOCK_METERS } from '@/lib/mockData';
import styles from './page.module.css';

export default function TopUpPage() {
  const [selectedMeterId, setSelectedMeterId] = useState('');
  const [amount, setAmount] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedMeter = useMemo(() => 
    MOCK_METERS.find(m => m.id === selectedMeterId),
    [selectedMeterId]
  );

  const handleQuickSelect = (val) => {
    setAmount(val.toString());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedMeterId || !amount || parseFloat(amount) <= 0) return;

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  const handleReset = () => {
    setSelectedMeterId('');
    setAmount('');
    setIsSuccess(false);
  };

  if (isSuccess) {
    return (
      <>
        <TopBar title="Top-Up Credits" subtitle="Load token credits onto tenant meters" />
        <div className={styles.container}>
          <div className={`card ${styles.successState}`}>
            <div className={styles.successIcon}>
              <CheckCircle size={32} />
            </div>
            <h2 className={styles.successTitle}>Top-Up Successful!</h2>
            <p className={styles.successDesc}>
              ₵{parseFloat(amount).toFixed(2)} has been loaded onto <strong>{selectedMeter.meterName}</strong> ({selectedMeter.tenantName}).
            </p>
            <div className={styles.actions}>
              <Link href="/billing" className="btn btn-primary">
                View Transaction History
                <ArrowRight size={16} />
              </Link>
              <button onClick={handleReset} className="btn btn-secondary">
                Load Another Meter
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar title="Top-Up Credits" subtitle="Load token credits onto tenant meters" />

      <div className={styles.container}>
        <div className={`card ${styles.topUpCard}`}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Select Tenant / Meter</label>
              <div style={{ position: 'relative' }}>
                <select 
                  className={styles.select}
                  value={selectedMeterId}
                  onChange={(e) => setSelectedMeterId(e.target.value)}
                  required
                  id="tenant-select"
                >
                  <option value="">Choose a meter...</option>
                  {MOCK_METERS.map(meter => (
                    <option key={meter.id} value={meter.id}>
                      {meter.unitNumber} — {meter.tenantName} ({meter.meterSerial})
                    </option>
                  ))}
                </select>
              </div>
              
              {selectedMeter && (
                <div className={styles.summary}>
                  <div className={styles.summaryRow}>
                    <span>Current Balance:</span>
                    <span className={styles.summaryValue}>₵{selectedMeter.creditBalance.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Top-Up Amount (₵)</label>
              <input 
                type="number" 
                className={styles.input}
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                step="0.01"
                required
                id="amount-input"
              />
              
              <div className={styles.quickSelectGrid}>
                {[20, 50, 100, 200].map(val => (
                  <button 
                    key={val}
                    type="button"
                    className={styles.quickBtn}
                    onClick={() => handleQuickSelect(val)}
                  >
                    ₵{val}
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              className={`btn btn-primary ${styles.submitBtn}`}
              disabled={isSubmitting || !selectedMeterId || !amount}
              id="submit-topup-btn"
            >
              <PlusCircle size={18} />
              {isSubmitting ? 'Processing...' : 'Load Credits Now'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
