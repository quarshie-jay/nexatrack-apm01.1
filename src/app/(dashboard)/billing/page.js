'use client';

import { useMemo } from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, Download } from 'lucide-react';
import TopBar from '@/components/TopBar';
import SummaryCard from '@/components/SummaryCard';
import { MOCK_METERS, generateTransactions, TARIFF_RATE } from '@/lib/mockData';
import { CreditCard as CreditCardIcon, Wallet, Receipt, TrendingUp } from 'lucide-react';
import styles from './page.module.css';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

export default function BillingPage() {
  const transactions = useMemo(() => generateTransactions(), []);

  const totalCredits = useMemo(() =>
    MOCK_METERS.reduce((s, m) => s + m.creditBalance, 0)
  , []);

  const totalTopups = transactions.filter(t => t.type === 'topup').reduce((s, t) => s + t.amount, 0);
  const totalDeductions = transactions.filter(t => t.type === 'consumption').reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <>
      <TopBar title="Credits & Billing" subtitle="Manage credits, top-ups, and transaction history" />

      <div className={styles.content}>
        <div className={styles.summaryGrid}>
          <SummaryCard
            icon={Wallet}
            label="Total Credit Balance"
            value={`₵${totalCredits.toFixed(2)}`}
            subtitle="Across all tenants"
          />
          <SummaryCard
            icon={ArrowUpRight}
            label="Total Top-Ups"
            value={`₵${totalTopups.toFixed(2)}`}
            subtitle="This period"
          />
          <SummaryCard
            icon={ArrowDownRight}
            label="Total Deductions"
            value={`₵${totalDeductions.toFixed(2)}`}
            subtitle="From consumption"
          />
          <SummaryCard
            icon={Receipt}
            label="Tariff Rate"
            value={`₵${TARIFF_RATE}`}
            unit="/kWh"
            subtitle="Current rate"
          />
        </div>

        {/* Transactions */}
        <div className={`card ${styles.tableSection}`}>
          <div className={styles.tableHeader}>
            <h2 className={styles.sectionTitle}>Recent Transactions</h2>
            <button className="btn btn-secondary btn-sm" id="export-transactions-btn">
              <Download size={14} />
              Export CSV
            </button>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Tenant</th>
                  <th>Meter</th>
                  <th>Description</th>
                  <th className="text-right">Amount (₵)</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(txn => (
                  <tr key={txn.id}>
                    <td>
                      <span className={`badge ${
                        txn.type === 'topup' ? 'badge-online'
                        : txn.type === 'consumption' ? 'badge-offline'
                        : 'badge-warning'
                      }`}>
                        {txn.type === 'topup' && <ArrowUpRight size={12} />}
                        {txn.type === 'consumption' && <ArrowDownRight size={12} />}
                        {txn.type === 'adjustment' && <Minus size={12} />}
                        {txn.type.charAt(0).toUpperCase() + txn.type.slice(1)}
                      </span>
                    </td>
                    <td>{txn.tenantName}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 11 }}>{txn.meterName}</td>
                    <td>{txn.description}</td>
                    <td className="text-right">
                      <span style={{
                        color: txn.amount > 0 ? 'var(--green-600)' : 'var(--red-600)',
                        fontWeight: 600
                      }}>
                        {txn.amount > 0 ? '+' : ''}{txn.amount.toFixed(2)}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatDate(txn.createdAt)}</td>
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
