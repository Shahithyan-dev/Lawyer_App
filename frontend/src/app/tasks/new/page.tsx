'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, CheckSquare } from 'lucide-react';
import styles from '@/app/Dashboard.module.css';

export default function AddTaskPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cases, setCases] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    caseReference: '',
    priority: 'NORMAL',
    status: 'To Do',
    assignedTo: '',
    dueDate: ''
  });

  useEffect(() => {
    // Fetch cases
    fetch('http://10.252.32.1:5000/api/cases')
      .then(res => res.json())
      .then(data => setCases(data))
      .catch(err => console.error('Failed to load cases', err));

    // Fetch users for assignment
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
    if (!formData.assignedTo) {
      setError('Please assign this task to a staff member');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        caseReference: formData.caseReference || undefined // optional
      };

      const res = await fetch('http://10.252.32.1:5000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create task');
      }

      router.push('/tasks');
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
            <Link href="/tasks" style={{ color: 'var(--text-secondary)', marginRight: '12px' }}>
              <ArrowLeft size={24} style={{ verticalAlign: 'middle' }} />
            </Link>
            Add New Task
          </h1>
          <p className={styles.subtitle} style={{ marginLeft: '36px' }}>Assign tasks and track deadlines.</p>
        </div>
      </div>

      <div className={styles.card} style={{ maxWidth: '800px' }}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            <CheckSquare size={18} />
            Task Details
          </div>
        </div>

        {error && (
          <div style={{ padding: '16px', marginBottom: '24px', color: 'var(--status-danger-text)', backgroundColor: 'var(--status-danger-bg)', borderRadius: 'var(--radius-btn)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>Task Title <span style={{color: 'red'}}>*</span></label>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={{ padding: '10px 12px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}
              placeholder="e.g. Draft Bail Petition"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>Description</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              style={{ padding: '10px 12px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', resize: 'vertical' }}
              placeholder="Add details about the task..."
            />
          </div>

          <div className={styles.formGrid}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>Assign To <span style={{color: 'red'}}>*</span></label>
              <select 
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                required
                style={{ padding: '10px 12px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}
              >
                <option value="" disabled>Select Staff Member</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
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
                <option value="">No Case</option>
                {cases.map(c => (
                  <option key={c._id} value={c._id}>{c.caseId} - {c.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>Priority</label>
              <select 
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                style={{ padding: '10px 12px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}
              >
                <option value="LOW">LOW</option>
                <option value="NORMAL">NORMAL</option>
                <option value="HIGH PRIORITY">HIGH PRIORITY</option>
              </select>
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <Link href="/tasks" style={{ textDecoration: 'none' }}>
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
                  Save Task
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
