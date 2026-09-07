'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Briefcase } from 'lucide-react';
import styles from '@/app/Dashboard.module.css'; 

export default function AddCasePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    type: 'Civil',
    court: '',
    client: '',
    status: 'Active',
    nextHearing: ''
  });

  useEffect(() => {
    // Fetch clients to populate the dropdown
    fetch('http://10.252.32.1:5000/api/clients')
      .then(res => res.json())
      .then(data => setClients(data))
      .catch(err => console.error('Failed to load clients', err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client) {
      setError('Please select a client');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const caseId = `CR-${Math.floor(1000 + Math.random() * 9000)}`;
      
      const payload = {
        ...formData,
        caseId,
        nextHearing: formData.nextHearing || undefined // Send undefined if empty
      };

      const res = await fetch('http://10.252.32.1:5000/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create case');
      }

      router.push('/cases');
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
            <Link href="/cases" style={{ color: 'var(--text-secondary)', marginRight: '12px' }}>
              <ArrowLeft size={24} style={{ verticalAlign: 'middle' }} />
            </Link>
            Add New Case
          </h1>
          <p className={styles.subtitle} style={{ marginLeft: '36px' }}>Register a new litigation or consulting matter.</p>
        </div>
      </div>

      <div className={styles.card} style={{ maxWidth: '800px' }}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            <Briefcase size={18} />
            Case Details
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
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>Case Title / Opposite Party <span style={{color: 'red'}}>*</span></label>
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                style={{ padding: '10px 12px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}
                placeholder="e.g. State vs Mohan Das"
              />
            </div>
            
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
                  <option key={c._id} value={c._id}>{c.name} ({c.clientId})</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGrid}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>Case Type</label>
              <select 
                name="type"
                value={formData.type}
                onChange={handleChange}
                style={{ padding: '10px 12px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}
              >
                <option value="Civil">Civil</option>
                <option value="Criminal">Criminal</option>
                <option value="Family">Family</option>
                <option value="Corporate">Corporate</option>
                <option value="Tax">Tax</option>
                <option value="Consultation">Consultation</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>Court Name <span style={{color: 'red'}}>*</span></label>
              <input 
                type="text" 
                name="court"
                value={formData.court}
                onChange={handleChange}
                required
                style={{ padding: '10px 12px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}
                placeholder="e.g. District Court, Court No. 7"
              />
            </div>
          </div>

          <div className={styles.formGrid}>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>Status</label>
              <select 
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={{ padding: '10px 12px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}
              >
                <option value="Active">Active</option>
                <option value="Pending Docs">Pending Docs</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>Next Hearing Date</label>
              <input 
                type="date" 
                name="nextHearing"
                value={formData.nextHearing}
                onChange={handleChange}
                style={{ padding: '10px 12px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <Link href="/cases" style={{ textDecoration: 'none' }}>
              <button type="button" className={styles.btnSecondary}>
                Cancel
              </button>
            </Link>
            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Save size={18} />
                  Save Case
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
