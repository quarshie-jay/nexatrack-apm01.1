'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthContext';
import TopBar from '@/components/TopBar';
import { Save, User, Mail, Shield } from 'lucide-react';
import { MOCK_METERS } from '@/lib/mockData';
import styles from './page.module.css';

export default function ProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  if (!user) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API delay
    setTimeout(() => {
      setIsSaving(false);
      setMessage('Profile updated successfully.');
      setTimeout(() => setMessage(''), 3000);
    }, 1000);
  };

  const assignedMeters = user.meterIds 
    ? user.meterIds.map(id => MOCK_METERS.find(m => m.id === id)).filter(Boolean)
    : [];

  return (
    <>
      <TopBar title="My Profile" subtitle="Manage your personal information" />
      <div className={styles.container}>
        <div className={styles.sidebar}>
           <div className={styles.card}>
              <div className={styles.avatarSection}>
                 <div className={styles.avatarLarge}>{user.name.charAt(0)}</div>
                 <h2 className={styles.userName}>{user.name}</h2>
                 <p className={styles.userRole}>{user.role === 'tenant' ? 'Tenant Account' : 'Admin Account'}</p>
              </div>
           </div>
           
           <div className={styles.card}>
              <h3 className={styles.cardTitle}>Assigned Meters</h3>
              {assignedMeters.length > 0 ? (
                <ul className={styles.meterList}>
                  {assignedMeters.map(meter => (
                    <li key={meter.id} className={styles.meterItem}>
                      <span className={styles.meterName}>{meter.meterName}</span>
                      <span className={styles.meterSerial}>{meter.meterSerial}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.noMeters}>No assigned meters.</p>
              )}
           </div>
        </div>
        
        <div className={styles.mainContent}>
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Personal Information</h2>
            <form onSubmit={handleSave} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <User size={16} /> Full Name
                </label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  className={styles.input}
                  required 
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <Mail size={16} /> Email Address
                </label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  className={styles.input}
                  required 
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <Shield size={16} /> Password
                </label>
                <input 
                  type="password" 
                  placeholder="Leave blank to keep current password"
                  className={styles.input}
                />
              </div>

              {message && <div className={styles.successMessage}>{message}</div>}

              <div className={styles.formActions}>
                <button type="submit" className={styles.submitBtn} disabled={isSaving}>
                  <Save size={18} />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
