'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Receipt } from 'lucide-react';
import styles from '@/app/Dashboard.module.css';

export default function RecordExpensePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cases, setCases] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    category: 'Court Fee',
    amount: '',
    description: '',
    relatedCase: '',
    status: 'Pending',
    date: new Date().toISOString().split('T')[0] // today's date
  });

  useEffect(() => {
    // Fetch cases for the dropdown
    fetch('http://10.252.32.1:5000/api/cases')
      .then(res => res.json())
      .then(data => setCases(data))
      .catch(err => console.error('Failed to load cases', err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.description) {
      setError('Please enter amount and description');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const expenseId = `EXP-${Math.floor(10000 + Math.random() * 90000)}`;

      const payload = {
        ...formData,
        expenseId,
        amount: Number(formData.amount),
        relatedCase: formData.relatedCase || undefined
      };

      const res = await fetch('http://10.252.32.1:5000/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to record expense');
      }

      router.push('/expenses');
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <Link href="/expenses" style={{ color: 'var(--text-secondary)', marginRight: '12px' }}>
              <ArrowLeft size={24} style={{ verticalAlign: 'middle' }} />
            </Link>
            Record Expense
          </h1>
          <p className={styles.subtitle} style={{ marginLeft: '36px' }}>Log an internal firm cost or reimbursable expense.</p>
        </div>
      </div>

      <div className={styles.card} style={{ maxWidth: '800px' }}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            <Receipt size={18} />
            Expense Details
          </div>
        </div>

        {error && (
          <div style={{ padding: '16px', marginBottom: '24px', color: 'var(--status-danger-text)', backgroundColor: 'var(--status-danger-bg)', borderRadius: 'var(--radius-btn)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className={styles.formGrid}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>Category <span style={{color: 'red'}}>*</span></label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                style={{ padding: '10px 12px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}
              >
                <option value="Court Fee">Court Fee</option>
                <option value="Travel">Travel</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Legal Tools">Legal Tools</option>
                <option value="Miscellaneous">Miscellaneous</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>Amount ($) <span style={{color: 'red'}}>*</span></label>
              <input 
                type="number" 
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                style={{ padding: '10px 12px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>Description <span style={{color: 'red'}}>*</span></label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              required
              style={{ padding: '10px 12px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', resize: 'vertical' }}
              placeholder="What was this expense for?"
            />
          </div>

          <div className={styles.formGrid}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>Related Case (Optional)</label>
              <select 
                name="relatedCase"
                value={formData.relatedCase}
                onChange={handleChange}
                style={{ padding: '10px 12px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}
              >
                <option value="">No Case</option>
                {cases.map(c => (
                  <option key={c._id} value={c._id}>{c.caseId} - {c.title}</option>
                ))}
              </select>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>Date <span style={{color: 'red'}}>*</span></label>
              <input 
                type="date" 
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                style={{ padding: '10px 12px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <Link href="/expenses" style={{ textDecoration: 'none' }}>
              <button type="button" className={styles.btnSecondary}>
                Cancel
              </button>
            </Link>
            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? (
                <span>Recording...</span>
              ) : (
                <>
                  <Save size={18} />
                  Record Expense
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
