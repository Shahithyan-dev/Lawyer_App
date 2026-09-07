'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/app/Dashboard.module.css';
import { Plus, Loader2, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://10.252.32.1:5000/api/payments')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch payments');
        return res.json();
      })
      .then((data) => {
        setPayments(data);
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
          <h1 className={styles.title}>Payments</h1>
          <p className={styles.subtitle}>Track incoming payments from clients.</p>
        </div>
        <div className={styles.headerActions}>
          <Link href="/payments/new" style={{ textDecoration: 'none' }}>
            <button className={styles.btnPrimary}>
              <Plus size={18} /> Record Payment
            </button>
          </Link>
        </div>
      </div>

      <div className={styles.card}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Loader2 className={styles.spin} size={32} style={{ margin: '0 auto 16px auto', display: 'block' }} />
            Loading payments from MongoDB...
          </div>
        ) : error ? (
          <div style={{ padding: '24px', color: 'var(--status-danger-text)', backgroundColor: 'var(--status-danger-bg)', borderRadius: 'var(--radius-btn)' }}>
            Failed to load payments: {error}
          </div>
        ) : (
          <>
            <div className={styles.mobileCardList}>
              {payments.map((pay) => (
                <div key={pay._id} className={styles.mobileCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CreditCard size={16} color="var(--primary-color)" />
                      <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>{pay.paymentId}</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {new Date(pay.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--status-success-text)' }}>
                      + ${pay.amountPaid.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Invoice: {pay.invoice?.invoiceId || 'Unknown'}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Method: {pay.method} {pay.referenceNumber ? `(${pay.referenceNumber})` : ''}
                    </div>
                  </div>
                </div>
              ))}
              {payments.length === 0 && (
                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No payments recorded yet.
                </div>
              )}
            </div>

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Date</th>
                  <th>Invoice Ref</th>
                  <th>Client</th>
                  <th>Amount</th>
                  <th>Method</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((pay) => (
                  <tr key={pay._id}>
                    <td style={{ fontWeight: 500, color: 'var(--primary-color)' }}>{pay.paymentId}</td>
                    <td>{new Date(pay.date).toLocaleDateString()}</td>
                    <td>{pay.invoice?.invoiceId || 'Unknown'}</td>
                    <td>{pay.invoice?.client?.name || 'Unknown'}</td>
                    <td style={{ fontWeight: 600, color: 'var(--status-success-text)' }}>
                      ${pay.amountPaid.toLocaleString()}
                    </td>
                    <td>{pay.method} {pay.referenceNumber ? `(${pay.referenceNumber})` : ''}</td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                      No payments recorded yet. Record a payment against an invoice!
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
