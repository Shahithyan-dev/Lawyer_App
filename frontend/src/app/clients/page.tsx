'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/app/Dashboard.module.css';
import { Search, Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://10.252.32.1:5000/api/clients')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => {
        setClients(data);
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
          <h1 className={styles.title}>Clients</h1>
          <p className={styles.subtitle}>Manage your client database and dossiers.</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} size={18} />
            <input 
              type="text" 
              placeholder="Search clients..." 
              className={styles.searchInput}
            />
          </div>
          <Link href="/clients/new" style={{ textDecoration: 'none' }}>
            <button className={styles.btnPrimary}>
              <Plus size={18} /> Add Client
            </button>
          </Link>
        </div>
      </div>

      <div className={styles.card}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Loader2 className={styles.spin} size={32} style={{ margin: '0 auto 16px auto', display: 'block' }} />
            Loading clients from MongoDB...
          </div>
        ) : error ? (
          <div style={{ padding: '24px', color: 'var(--status-danger-text)', backgroundColor: 'var(--status-danger-bg)', borderRadius: 'var(--radius-btn)' }}>
            Failed to load clients: {error}
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Client ID</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client._id}>
                  <td style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>{client.clientId}</td>
                  <td>
                    <Link href={`/clients/${client._id}`} className={styles.primaryLink}>{client.name}</Link>
                  </td>
                  <td>{client.mobile}</td>
                  <td>{client.email}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${client.status === 'Active' ? styles.active : styles.inactive}`}>
                      {client.status}
                    </span>
                  </td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                    No clients found. Click "Add Client" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
