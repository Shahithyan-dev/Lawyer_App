'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/app/Dashboard.module.css';
import { Plus, Loader2, FileSpreadsheet, Download } from 'lucide-react';
import Link from 'next/link';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://10.252.32.1:5000/api/invoices')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch invoices');
        return res.json();
      })
      .then((data) => {
        setInvoices(data);
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
          <h1 className={styles.title}>Invoices</h1>
          <p className={styles.subtitle}>Manage billing, track payments, and generate invoices.</p>
        </div>
        <div className={styles.headerActions}>
          <Link href="/invoices/new" style={{ textDecoration: 'none' }}>
            <button className={styles.btnPrimary}>
              <Plus size={18} /> Create Invoice
            </button>
          </Link>
        </div>
      </div>

      <div className={styles.card}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Loader2 className={styles.spin} size={32} style={{ margin: '0 auto 16px auto', display: 'block' }} />
            Loading invoices from MongoDB...
          </div>
        ) : error ? (
          <div style={{ padding: '24px', color: 'var(--status-danger-text)', backgroundColor: 'var(--status-danger-bg)', borderRadius: 'var(--radius-btn)' }}>
            Failed to load invoices: {error}
          </div>
        ) : (
          <>
            <div className={styles.mobileCardList}>
              {invoices.map((inv) => (
                <div key={inv._id} className={styles.mobileCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileSpreadsheet size={16} color="var(--primary-color)" />
                      <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>{inv.invoiceId}</span>
                    </div>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      padding: '4px 8px', 
                      borderRadius: '12px',
                      fontWeight: 600,
                      backgroundColor: inv.status === 'Paid' ? 'var(--status-success-bg)' : (inv.status === 'Partial' ? 'var(--status-warning-bg)' : 'var(--status-danger-bg)'),
                      color: inv.status === 'Paid' ? 'var(--status-success-text)' : (inv.status === 'Partial' ? 'var(--status-warning-text)' : 'var(--status-danger-text)')
                    }}>
                      {inv.status}
                    </span>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>${inv.amount.toLocaleString()}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Client: {inv.client?.name || 'Unknown'}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Due: {new Date(inv.dueDate).toLocaleDateString()}</div>
                  </div>
                  <button className={styles.btnSecondary} style={{ width: '100%', justifyContent: 'center' }}>
                    <Download size={16} /> Download PDF
                  </button>
                </div>
              ))}
              {invoices.length === 0 && (
                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No invoices found.
                </div>
              )}
            </div>

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Client</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv._id}>
                    <td style={{ fontWeight: 500, color: 'var(--primary-color)' }}>{inv.invoiceId}</td>
                    <td>{inv.client?.name || 'Unknown'}</td>
                    <td style={{ fontWeight: 600 }}>${inv.amount.toLocaleString()}</td>
                    <td>{new Date(inv.dueDate).toLocaleDateString()}</td>
                    <td>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        padding: '4px 8px', 
                        borderRadius: '12px',
                        fontWeight: 600,
                        backgroundColor: inv.status === 'Paid' ? 'var(--status-success-bg)' : (inv.status === 'Partial' ? 'var(--status-warning-bg)' : 'var(--status-danger-bg)'),
                        color: inv.status === 'Paid' ? 'var(--status-success-text)' : (inv.status === 'Partial' ? 'var(--status-warning-text)' : 'var(--status-danger-text)')
                      }}>
                        {inv.status}
                      </span>
                    </td>
                    <td>
                      <button className={styles.btnSecondary} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                {invoices.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                      No invoices found. Create your first invoice!
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
