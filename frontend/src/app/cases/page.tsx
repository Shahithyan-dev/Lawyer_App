'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/app/Dashboard.module.css';
import { Search, Plus, Filter, Loader2, Calendar } from 'lucide-react';
import Link from 'next/link';

interface Case {
  _id: string;
  caseId: string;
  title: string;
  type: string;
  status: string;
  client?: { name: string };
  nextHearing?: string;
}

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://10.252.32.1:5000/api/cases')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch cases');
        return res.json();
      })
      .then((data) => {
        setCases(data);
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
          <h1 className={styles.title}>Cases</h1>
          <p className={styles.subtitle}>Manage active litigations, disputes, and consulting matters.</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} size={18} />
            <input 
              type="text" 
              placeholder="Search cases by ID or Client..." 
              className={styles.searchInput}
            />
          </div>
          <button className={styles.btnSecondary} style={{ padding: '8px 12px' }}>
            <Filter size={18} /> Filter
          </button>
          <Link href="/cases/new" style={{ textDecoration: 'none' }}>
            <button className={styles.btnPrimary}>
              <Plus size={18} /> Add Case
            </button>
          </Link>
        </div>
      </div>

      <div className={styles.card}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Loader2 className={styles.spin} size={32} style={{ margin: '0 auto 16px auto', display: 'block' }} />
            Loading cases from MongoDB...
          </div>
        ) : error ? (
          <div style={{ padding: '24px', color: 'var(--status-danger-text)', backgroundColor: 'var(--status-danger-bg)', borderRadius: 'var(--radius-btn)' }}>
            Failed to load cases: {error}
          </div>
        ) : (
          <>
          {/* Mobile Tabs */}
          <div className={`${styles.mobileOnly}`} style={{ borderBottom: '1px solid var(--border-color)', marginBottom: '16px', gap: '24px', paddingBottom: '8px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
            <div style={{ color: 'var(--accent-color)', fontWeight: '600', borderBottom: '2px solid var(--accent-color)', paddingBottom: '6px' }}>Active ({cases.filter(c => c.status === 'Active').length})</div>
            <div style={{ color: 'var(--text-secondary)' }}>Pending</div>
            <div style={{ color: 'var(--text-secondary)' }}>Closed</div>
          </div>

          <table className={`${styles.table} ${styles.desktopOnly}`}>
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Title / Description</th>
                <th>Client</th>
                <th>Next Hearing</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((c) => (
                <tr key={c._id}>
                  <td>
                    <Link href={`/cases/${c._id}`} className={styles.primaryLink}>{c.caseId}</Link>
                  </td>
                  <td style={{ fontWeight: '500' }}>{c.title} ({c.type})</td>
                  <td>{c.client ? c.client.name : 'Unknown'}</td>
                  <td style={{ color: c.nextHearing ? 'inherit' : 'var(--text-tertiary)' }}>
                    {c.nextHearing ? new Date(c.nextHearing).toLocaleDateString() : 'No hearings'}
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${
                      c.status === 'Active' ? styles.active : 
                      c.status === 'Pending Docs' ? styles.pending : styles.inactive
                    }`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
              {cases.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                    No cases found. Click "Add Case" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Mobile Cards */}
          <div className={`${styles.mobileCardList} ${styles.mobileOnly}`}>
            {cases.map((c) => (
              <Link href={`/cases/${c._id}`} key={c._id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className={styles.mobileCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{c.caseId}</div>
                      <div style={{ fontSize: '0.9rem', marginTop: '2px', color: 'var(--text-primary)' }}>{c.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>{c.type}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--status-success-text)', marginTop: '8px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--status-success-text)' }}></div>
                        {c.status}
                      </div>
                    </div>
                    {c.nextHearing && (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'var(--bg-color)', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', minWidth: '70px' }}>
                        <Calendar size={14} style={{ color: 'var(--text-secondary)', marginBottom: '4px' }} />
                        <div style={{ fontSize: '0.75rem', fontWeight: '600' }}>{new Date(c.nextHearing).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>Next Hearing</div>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          </>
        )}
      </div>
    </div>
  );
}
