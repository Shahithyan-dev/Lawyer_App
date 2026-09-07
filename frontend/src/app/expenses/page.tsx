'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/app/Dashboard.module.css';
import { Plus, Loader2, Receipt } from 'lucide-react';
import Link from 'next/link';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://10.252.32.1:5000/api/expenses')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch expenses');
        return res.json();
      })
      .then((data) => {
        setExpenses(data);
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
          <h1 className={styles.title}>Expenses</h1>
          <p className={styles.subtitle}>Track internal firm costs and reimbursable expenses.</p>
        </div>
        <div className={styles.headerActions}>
          <Link href="/expenses/new" style={{ textDecoration: 'none' }}>
            <button className={styles.btnPrimary}>
              <Plus size={18} /> Record Expense
            </button>
          </Link>
        </div>
      </div>

      <div className={styles.card}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Loader2 className={styles.spin} size={32} style={{ margin: '0 auto 16px auto', display: 'block' }} />
            Loading expenses from MongoDB...
          </div>
        ) : error ? (
          <div style={{ padding: '24px', color: 'var(--status-danger-text)', backgroundColor: 'var(--status-danger-bg)', borderRadius: 'var(--radius-btn)' }}>
            Failed to load expenses: {error}
          </div>
        ) : (
          <>
            <div className={styles.mobileCardList}>
              {expenses.map((exp) => (
                <div key={exp._id} className={styles.mobileCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Receipt size={16} color="var(--primary-color)" />
                      <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>{exp.category}</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {new Date(exp.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--status-danger-text)' }}>
                      - ${exp.amount.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {exp.description}
                    </div>
                    {exp.relatedCase && (
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                        Case: {exp.relatedCase.caseId}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <span style={{ 
                        fontSize: '0.75rem', 
                        padding: '4px 8px', 
                        borderRadius: '12px',
                        fontWeight: 600,
                        backgroundColor: exp.status === 'Approved' ? 'var(--status-success-bg)' : (exp.status === 'Reimbursed' ? 'var(--status-info-bg)' : 'var(--status-warning-bg)'),
                        color: exp.status === 'Approved' ? 'var(--status-success-text)' : (exp.status === 'Reimbursed' ? 'var(--status-info-text)' : 'var(--status-warning-text)')
                      }}>
                        {exp.status}
                      </span>
                  </div>
                </div>
              ))}
              {expenses.length === 0 && (
                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No expenses recorded yet.
                </div>
              )}
            </div>

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Expense ID</th>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp._id}>
                    <td style={{ fontWeight: 500, color: 'var(--primary-color)' }}>{exp.expenseId}</td>
                    <td>{new Date(exp.date).toLocaleDateString()}</td>
                    <td>{exp.category}</td>
                    <td>{exp.description}</td>
                    <td style={{ fontWeight: 600, color: 'var(--status-danger-text)' }}>
                      ${exp.amount.toLocaleString()}
                    </td>
                    <td>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        padding: '4px 8px', 
                        borderRadius: '12px',
                        fontWeight: 600,
                        backgroundColor: exp.status === 'Approved' ? 'var(--status-success-bg)' : (exp.status === 'Reimbursed' ? 'var(--status-info-bg)' : 'var(--status-warning-bg)'),
                        color: exp.status === 'Approved' ? 'var(--status-success-text)' : (exp.status === 'Reimbursed' ? 'var(--status-info-text)' : 'var(--status-warning-text)')
                      }}>
                        {exp.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {expenses.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                      No expenses recorded yet.
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
