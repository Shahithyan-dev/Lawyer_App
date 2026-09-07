'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, CreditCard } from 'lucide-react';
import styles from '@/app/Dashboard.module.css';

export default function RecordPaymentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    invoice: '',
    amountPaid: '',
    method: 'Bank Transfer',
    referenceNumber: '',
    date: new Date().toISOString().split('T')[0] // today's date
  });

  useEffect(() => {
    // Fetch unpaid or partial invoices
    fetch('http://10.252.32.1:5000/api/invoices')
      .then(res => res.json())
      .then(data => {
        const pending = data.filter((inv: any) => inv.status !== 'Paid');
        setInvoices(pending);
      })
      .catch(err => console.error('Failed to load invoices', err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInvoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedInvoiceId = e.target.value;
    const selectedInvoice = invoices.find(inv => inv._id === selectedInvoiceId);
    
    setFormData({ 
      ...formData, 
      invoice: selectedInvoiceId,
      amountPaid: selectedInvoice ? selectedInvoice.amount.toString() : '' // pre-fill amount
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.invoice || !formData.amountPaid) {
      setError('Please select an invoice and enter the amount');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const paymentId = `PAY-${Math.floor(10000 + Math.random() * 90000)}`;

      const payload = {
        ...formData,
        paymentId,
        amountPaid: Number(formData.amountPaid)
      };

      const res = await fetch('http://10.252.32.1:5000/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to record payment');
      }

      router.push('/payments');
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
            <Link href="/payments" style={{ color: 'var(--text-secondary)', marginRight: '12px' }}>
              <ArrowLeft size={24} style={{ verticalAlign: 'middle' }} />
            </Link>
            Record Payment
          </h1>
          <p className={styles.subtitle} style={{ marginLeft: '36px' }}>Log a client payment against an invoice.</p>
        </div>
      </div>

      <div className={styles.card} style={{ maxWidth: '800px' }}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            <CreditCard size={18} />
            Payment Details
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
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>Select Invoice <span style={{color: 'red'}}>*</span></label>
              <select 
                name="invoice"
                value={formData.invoice}
                onChange={handleInvoiceChange}
                required
                style={{ padding: '10px 12px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}
              >
                <option value="" disabled>Select an unpaid invoice</option>
                {invoices.map(inv => (
                  <option key={inv._id} value={inv._id}>
                    {inv.invoiceId} - {inv.client?.name} (${inv.amount})
                  </option>
                ))}
              </select>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>Amount Paid ($) <span style={{color: 'red'}}>*</span></label>
              <input 
                type="number" 
                name="amountPaid"
                value={formData.amountPaid}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                style={{ padding: '10px 12px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          <div className={styles.formGrid}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>Payment Method <span style={{color: 'red'}}>*</span></label>
              <select 
                name="method"
                value={formData.method}
                onChange={handleChange}
                required
                style={{ padding: '10px 12px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}
              >
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Credit Card">Credit Card</option>
                <option value="UPI">UPI</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>Reference Number (Txn ID/Cheque No)</label>
              <input 
                type="text" 
                name="referenceNumber"
                value={formData.referenceNumber}
                onChange={handleChange}
                style={{ padding: '10px 12px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}
                placeholder="Optional"
              />
            </div>
          </div>

          <div className={styles.formGrid}>
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
            <Link href="/payments" style={{ textDecoration: 'none' }}>
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
                  Record Payment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
