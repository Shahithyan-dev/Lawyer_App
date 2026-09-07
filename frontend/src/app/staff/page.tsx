'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/app/Dashboard.module.css';
import { Plus, Loader2, Users, Mail } from 'lucide-react';
import Link from 'next/link';

export default function StaffPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://10.252.32.1:5000/api/users')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch staff');
        return res.json();
      })
      .then((data) => {
        setStaff(data);
        setLoading(false);
      })
      .catch((err: any) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div className={styles.headerTextContent}>
          <h1 className={styles.title}>Staff Management</h1>
          <p className={styles.subtitle}>Manage your firm's employees and their access roles.</p>
        </div>
        <div className={styles.headerActions}>
          <Link href="/staff/new" style={{ textDecoration: 'none' }}>
            <button className={styles.btnPrimary}>
              <Plus size={18} /> Add Staff Member
            </button>
          </Link>
        </div>
      </div>

      <div className={styles.card}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Loader2 className={styles.spin} size={32} style={{ margin: '0 auto 16px auto', display: 'block' }} />
            Loading staff from MongoDB...
          </div>
        ) : error ? (
          <div style={{ padding: '24px', color: 'var(--status-danger-text)', backgroundColor: 'var(--status-danger-bg)', borderRadius: 'var(--radius-btn)' }}>
            Failed to load staff: {error}
          </div>
        ) : (
          <>
            <div className={styles.mobileCardList}>
              {staff.map((user) => (
                <div key={user._id} className={styles.mobileCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Users size={16} color="var(--primary-color)" />
                      <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>{user.name}</span>
                    </div>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      padding: '4px 8px', 
                      borderRadius: '12px',
                      fontWeight: 600,
                      backgroundColor: 'var(--accent-light)',
                      color: 'var(--accent-color)'
                    }}>
                      {user.role}
                    </span>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <Mail size={14} /> {user.email}
                    </div>
                  </div>
                </div>
              ))}
              {staff.length === 0 && (
                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No staff members found.
                </div>
              )}
            </div>

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((user) => (
                  <tr key={user._id}>
                    <td style={{ fontWeight: 600 }}>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        padding: '4px 8px', 
                        borderRadius: '12px',
                        fontWeight: 600,
                        backgroundColor: 'var(--accent-light)',
                        color: 'var(--accent-color)'
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: 'var(--status-success-text)', fontSize: '0.85rem', fontWeight: 500 }}>Active</span>
                    </td>
                  </tr>
                ))}
                {staff.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                      No staff members found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
