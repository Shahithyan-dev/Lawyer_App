'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Receipt } from 'lucide-react';
import styles from '@/app/Dashboard.module.css';

export default function CreateInvoicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    client: '',
    caseReference: '',
    amount: '',
    dueDate: '',
    notes: '',
    status: 'Unpaid'
  });

  useEffect(() => {
    // Fetch clients
    fetch('http://10.252.32.1:5000/api/clients')
      .then(res => res.json())
      .then(data => setClients(data))
      .catch(err => console.error('Failed to load clients', err));

    // Fetch cases
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
    if (!formData.client || !formData.amount || !formData.dueDate) {
      setError('Please fill all required fields');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const invoiceId = `INV-${Math.floor(10000 + Math.random() * 90000)}`;

      const payload = {
        ...formData,
        invoiceId,
        amount: Number(formData.amount),
        caseReference: formData.caseReference || undefined
      };

      const res = await fetch('http://10.252.32.1:5000/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create invoice');
      }

      router.push('/invoices');
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
            <Link href="/invoices" style={{ color: 'var(--text-secondary)', marginRight: '12px' }}>
              <ArrowLeft size={24} style={{ verticalAlign: 'middle' }} />
            </Link>
            Create Invoice
          </h1>
          <p className={styles.subtitle} style={{ marginLeft: '36px' }}>Generate a new bill for a client.</p>
        </div>
      </div>

      <div className={styles.card} style={{ maxWidth: '800px' }}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            <Receipt size={18} />
            Invoice Details
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
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>Client <span style={{color: 'red'}}>*</span></label>
              <select 
                name="client"
                value={formData.client}
                onChange={handleChange}
                required
                style={{ padding: '10px 12px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}
              >
                <option value="" disabled>Select Client</option>
                {clients.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>Related Case</label>
              <select 
                name="caseReference"
                value={formData.caseReference}
                onChange={handleChange}
                style={{ padding: '10px 12px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}
              >
                <option value="">General Consultation (No Case)</option>
                {cases.filter(c => c.client?._id === formData.client || c.client === formData.client).map(c => (
                  <option key={c._id} value={c._id}>{c.caseId} - {c.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGrid}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>Total Amount ($) <span style={{color: 'red'}}>*</span></label>
              <input 
                type="number" 
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                style={{ padding: '10px 12px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}
                placeholder="e.g. 500.00"
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>Due Date <span style={{color: 'red'}}>*</span></label>
              <input 
                type="date" 
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
                style={{ padding: '10px 12px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>Notes</label>
            <textarea 
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              style={{ padding: '10px 12px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', resize: 'vertical' }}
              placeholder="e.g. Consultation fee for 1st August"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <Link href="/invoices" style={{ textDecoration: 'none' }}>
              <button type="button" className={styles.btnSecondary}>
                Cancel
              </button>
            </Link>
            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? (
                <span>Generating...</span>
              ) : (
                <>
                  <Save size={18} />
                  Generate Invoice
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
