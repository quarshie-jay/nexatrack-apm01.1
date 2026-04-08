'use client';

import { useState, useMemo } from 'react';
import { Search, Plus, MoreVertical, Mail, Phone } from 'lucide-react';
import TopBar from '@/components/TopBar';
import { MOCK_METERS } from '@/lib/mockData';
import { MOCK_USERS } from '@/lib/mockUsers';
import styles from './page.module.css';

export default function TenantsPage() {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);

  const tenants = useMemo(() => {
    // Start with strictly users with role 'tenant'
    const tenantUsers = MOCK_USERS.filter(u => u.role === 'tenant');
    return tenantUsers.map(user => {
      const assignedMeters = (user.meterIds || []).map(mid => MOCK_METERS.find(m => m.id === mid)).filter(Boolean);
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        unitNumber: assignedMeters.length > 0 ? assignedMeters[0].unitNumber : 'Unassigned',
        meters: assignedMeters,
        totalKwh: assignedMeters.reduce((sum, m) => sum + m.totalKwh, 0),
        totalCredit: assignedMeters.reduce((sum, m) => sum + m.creditBalance, 0),
      };
    });
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
          <button className="btn btn-primary" id="add-tenant-btn" onClick={() => { setEditingTenant(null); setIsModalOpen(true); }}>
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
                              {t.email}
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
                        <button className={styles.moreBtn} aria-label="Edit" onClick={() => { setEditingTenant(t); setIsModalOpen(true); }}>
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

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{editingTenant ? 'Edit Tenant' : 'Add New Tenant'}</h2>
              <button className={styles.closeModalBtn} onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <div className="formGroup">
                <label>Full Name</label>
                <input type="text" className="input" defaultValue={editingTenant?.name || ''} />
              </div>
              <div className="formGroup" style={{ marginTop: '16px' }}>
                <label>Email Address</label>
                <input type="email" className="input" defaultValue={editingTenant?.email || ''} />
              </div>
              <div className="formGroup" style={{ marginTop: '16px' }}>
                <label>Assign Meters (Hold Ctrl to select multiple)</label>
                <select multiple className="input" style={{ height: '100px' }} defaultValue={editingTenant?.meters.map(m => m.id) || []}>
                  {MOCK_METERS.map(m => (
                    <option key={m.id} value={m.id}>Unit {m.unitNumber} ({m.meterSerial})</option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className="btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => setIsModalOpen(false)}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
