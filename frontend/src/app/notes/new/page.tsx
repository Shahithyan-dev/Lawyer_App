'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, MessageSquare } from 'lucide-react';
import styles from '@/app/Dashboard.module.css';

export default function AddNotePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cases, setCases] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'Internal Note',
    relatedCase: '',
    author: ''
  });

  useEffect(() => {
    // Fetch cases
    fetch('http://10.252.32.1:5000/api/cases')
      .then(res => res.json())
      .then(data => setCases(data))
      .catch(err => console.error('Failed to load cases', err));
      
    // Fetch users (staff)
    fetch('http://10.252.32.1:5000/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error('Failed to load users', err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      setError('Please provide a title and content for the note.');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        relatedCase: formData.relatedCase || undefined,
        author: formData.author || undefined
      };

      const res = await fetch('http://10.252.32.1:5000/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to save note');
      }

      router.push('/notes');
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
            <Link href="/notes" style={{ color: 'var(--text-secondary)', marginRight: '12px' }}>
              <ArrowLeft size={24} style={{ verticalAlign: 'middle' }} />
            </Link>
            Add Note / Communication
          </h1>
          <p className={styles.subtitle} style={{ marginLeft: '36px' }}>Log a new interaction or case note.</p>
        </div>
      </div>

      <div className={styles.card} style={{ maxWidth: '800px' }}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            <MessageSquare size={18} />
            Note Details
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
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>Subject / Title <span style={{color: 'red'}}>*</span></label>
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                style={{ padding: '10px 12px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}
                placeholder="e.g. Call with Client regarding evidence"
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>Type</label>
              <select 
                name="type"
                value={formData.type}
                onChange={handleChange}
                style={{ padding: '10px 12px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}
              >
                <option value="Internal Note">Internal Note</option>
                <option value="Client Call">Client Call</option>
                <option value="Email">Email</option>
                <option value="Meeting">Meeting</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>Content <span style={{color: 'red'}}>*</span></label>
            <textarea 
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={6}
              required
              style={{ padding: '10px 12px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', resize: 'vertical' }}
              placeholder="Write the details here..."
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
                <option value="">General (No Case)</option>
                {cases.map(c => (
                  <option key={c._id} value={c._id}>{c.caseId} - {c.title}</option>
                ))}
              </select>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>Author (Staff)</label>
              <select 
                name="author"
                value={formData.author}
                onChange={handleChange}
                style={{ padding: '10px 12px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}
              >
                <option value="">Select Staff Member</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <Link href="/notes" style={{ textDecoration: 'none' }}>
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
                  Save Note
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
