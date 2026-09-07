'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, UserPlus } from 'lucide-react';
import styles from '@/app/Dashboard.module.css';

export default function AddStaffPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    role: 'Junior Advocate',
    supervisor: ''
  });

  const [seniorAdvocates, setSeniorAdvocates] = useState<any[]>([]);

  React.useEffect(() => {
    fetch('http://10.252.32.1:5000/api/users')
      .then(res => res.json())
      .then(data => {
        const seniors = data.filter((u: any) => u.role === 'Senior Advocate');
        setSeniorAdvocates(seniors);
      })
      .catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.username || !formData.password) {
      setError('Please fill all required fields');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://10.252.32.1:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add staff member');
      }

      router.push('/staff');
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
            <Link href="/staff" style={{ color: 'var(--text-secondary)', marginRight: '12px' }}>
              <ArrowLeft size={24} style={{ verticalAlign: 'middle' }} />
            </Link>
            Add Staff Member
          </h1>
          <p className={styles.subtitle} style={{ marginLeft: '36px' }}>Create a new user account for an employee.</p>
        </div>
      </div>

      <div className={styles.card} style={{ maxWidth: '800px' }}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            <UserPlus size={18} />
            Employee Details
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
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>Full Name <span style={{color: 'red'}}>*</span></label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ padding: '10px 12px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}
                placeholder="e.g. Jane Doe"
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>Lawyer ID / Username <span style={{color: 'red'}}>*</span></label>
              <input 
                type="text" 
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                style={{ padding: '10px 12px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}
                placeholder="e.g. LEX-1001"
              />
            </div>
          </div>

          <div className={styles.formGrid}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>Temporary Password <span style={{color: 'red'}}>*</span></label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{ padding: '10px 12px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>Access Role <span style={{color: 'red'}}>*</span></label>
              <select 
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                style={{ padding: '10px 12px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}
              >
                <option value="Senior Advocate">Senior Advocate</option>
                <option value="Junior Advocate">Junior Advocate</option>
                <option value="Paralegal">Paralegal</option>
                <option value="Clerk">Clerk</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>

          {formData.role === 'Junior Advocate' && (
            <div className={styles.formGrid}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>Assign Supervisor (Senior Advocate)</label>
                <select 
                  name="supervisor"
                  value={formData.supervisor}
                  onChange={handleChange}
                  style={{ padding: '10px 12px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}
                >
                  <option value="">-- None --</option>
                  {seniorAdvocates.map(senior => (
                    <option key={senior._id} value={senior._id}>{senior.name} ({senior.email})</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <Link href="/staff" style={{ textDecoration: 'none' }}>
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
                  Add Staff
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
