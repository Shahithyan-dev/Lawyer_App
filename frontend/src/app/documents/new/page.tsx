'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/app/Dashboard.module.css';
import { ArrowLeft, Upload, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function UploadDocumentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [cases, setCases] = useState<any[]>([]);
  
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('lexoraUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push('/login');
    }

    fetch('http://10.252.32.1:5000/api/cases')
      .then(res => res.json())
      .then(data => setCases(data))
      .catch(console.error);
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !user) return;
    
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('documentFile', file);
    formData.append('uploadedBy', user._id);

    try {
      const res = await fetch('http://10.252.32.1:5000/api/documents', {
        method: 'POST',
        // Note: When using FormData with fetch, DO NOT set Content-Type header. 
        // The browser will automatically set it to multipart/form-data with the correct boundary.
        body: formData
      });

      if (!res.ok) throw new Error('Failed to upload document');
      
      router.push('/documents');
    } catch (err) {
      console.error(err);
      alert('Error uploading document.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div>
          <Link href="/documents" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '8px' }}>
             <ArrowLeft size={16} /> Back to Documents
          </Link>
          <h1 className={styles.title}>Upload Document</h1>
          <p className={styles.subtitle}>Securely upload legal documents to the centralized repository.</p>
        </div>
      </div>

      <div className={styles.card} style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Document Title *</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)' }}
              placeholder="e.g. Draft Bail Petition - Raj Kumar"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Select File *</label>
            <div style={{ border: '2px dashed var(--border-color)', padding: '40px', textAlign: 'center', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-color)', cursor: 'pointer' }}>
              <input 
                type="file" 
                onChange={handleFileChange}
                required
                style={{ display: 'none' }}
                id="file-upload"
              />
              <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <Upload size={28} />
                </div>
                <span style={{ fontWeight: '500' }}>Click to browse or drag and drop</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>PDF, DOCX, JPG up to 10MB</span>
              </label>
            </div>
            
            {file && (
              <div style={{ marginTop: '16px', padding: '16px', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FileText style={{ color: 'var(--accent-color)' }} />
                <span style={{ fontWeight: '500' }}>{file.name}</span>
                <span style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <Link href="/documents" style={{ textDecoration: 'none' }}>
              <button type="button" className={styles.btnSecondary} style={{ padding: '10px 20px' }}>Cancel</button>
            </Link>
            <button type="submit" className={styles.btnPrimary} style={{ padding: '10px 20px' }} disabled={loading}>
              <Upload size={18} /> {loading ? 'Uploading...' : 'Upload Document'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
