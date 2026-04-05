'use client';

import { useState, useMemo } from 'react';
import { Search, Plus, MoreVertical, Mail, Phone } from 'lucide-react';
import TopBar from '@/components/TopBar';
import { MOCK_METERS } from '@/lib/mockData';
import styles from './page.module.css';

export default function TenantsPage() {
  const [search, setSearch] = useState('');

  const tenants = useMemo(() => {
    const map = new Map();
    MOCK_METERS.forEach(m => {
      if (!map.has(m.tenantName)) {
        map.set(m.tenantName, {
          name: m.tenantName,
          unitNumber: m.unitNumber,
          meters: [],
          totalKwh: 0,
          totalCredit: 0,
        });
      }
      const t = map.get(m.tenantName);
      t.meters.push(m);
      t.totalKwh += m.totalKwh;
      t.totalCredit += m.creditBalance;
    });
    return Array.from(map.values());
  }, []);

  const filtered = useMemo(() => {
    if (!search) return tenants;
    const q = search.toLowerCase();
    return tenants.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.unitNumber.toLowerCase().includes(q)
    );
  }, [tenants, search]);

  return (
    <>
      <TopBar title="Tenant Management" subtitle="Manage apartment tenants and meter assignments" />

      <div className={styles.content}>
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search tenants..."
              className={`input ${styles.searchInput}`}
              value={search}
              onChange={e => setSearch(e.target.value)}
              id="tenant-search"
            />
          </div>
          <button className="btn btn-primary" id="add-tenant-btn">
            <Plus size={16} />
            <span>Add Tenant</span>
          </button>
        </div>

        <div className={`card ${styles.tableCard}`}>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Tenant</th>
                  <th>Unit</th>
                  <th>Meters</th>
                  <th>Status</th>
                  <th className="text-right">Usage (kWh)</th>
                  <th className="text-right">Credit (₵)</th>
                  <th style={{ width: 40 }} />
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => {
                  const anyOnline = t.meters.some(m => m.status === 'online');
                  const lowCredit = t.totalCredit < 50;
                  return (
                    <tr key={i}>
                      <td>
                        <div className={styles.tenantCell}>
                          <div className={styles.tenantAvatar}>
                            {t.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{t.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                              {t.meters.map(m => m.meterSerial).join(', ')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{t.unitNumber}</td>
                      <td>{t.meters.length}</td>
                      <td>
                        <span className={`badge ${anyOnline ? 'badge-online' : 'badge-offline'}`}>
                          <span className={`badge-dot ${anyOnline ? 'badge-dot-online' : 'badge-dot-offline'}`} />
                          {anyOnline ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="text-right">{t.totalKwh.toFixed(1)}</td>
                      <td className="text-right">
                        <span style={{ color: lowCredit ? 'var(--red-600)' : 'inherit', fontWeight: lowCredit ? 600 : 400 }}>
                          ₵{t.totalCredit.toFixed(2)}
                        </span>
                      </td>
                      <td>
                        <button className={styles.moreBtn} aria-label="More options">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.footerInfo}>
          Showing {filtered.length} of {tenants.length} tenants
        </div>
      </div>
    </>
  );
}
