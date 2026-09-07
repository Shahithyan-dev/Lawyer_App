'use client';

import React, { useState } from 'react';
import styles from '@/app/Dashboard.module.css';
import { Search, Plus, FileText, Download, MoreVertical, Filter } from 'lucide-react';
import Link from 'next/link';

export default function DocumentsPage() {
  const [documents] = useState([
    { id: 1, title: 'Bail Petition - Raj Kumar.pdf', caseId: 'CR-1023', type: 'Petition', date: '2026-08-20', size: '2.4 MB' },
    { id: 2, title: 'Evidence Annexure A.jpg', caseId: 'CR-1023', type: 'Evidence', date: '2026-08-21', size: '4.1 MB' },
    { id: 3, title: 'Contract Agreement v2.docx', caseId: 'CIV-2041', type: 'Agreement', date: '2026-08-22', size: '1.2 MB' },
    { id: 4, title: 'Court Order - Stay.pdf', caseId: 'CIV-2041', type: 'Court Order', date: '2026-08-24', size: '840 KB' },
  ]);

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div className={styles.headerTextContent}>
          <h1 className={styles.title}>Documents</h1>
          <p className={styles.subtitle}>Manage files, evidence, and court orders.</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} size={18} />
            <input 
              type="text" 
              placeholder="Search files..." 
              className={styles.searchInput}
            />
          </div>
          <button className={styles.btnSecondary} style={{ padding: '8px 12px' }}>
            <Filter size={18} /> Filter
          </button>
          <button className={styles.btnPrimary}>
            <Plus size={18} /> Upload Document
          </button>
        </div>
      </div>

      <div className={styles.card}>
         <table className={styles.table}>
            <thead>
              <tr>
                <th>File Name</th>
                <th>Case Reference</th>
                <th>Category</th>
                <th>Size</th>
                <th>Date Uploaded</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <FileText size={18} style={{ color: 'var(--text-secondary)' }} />
                      <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{doc.title}</span>
                    </div>
                  </td>
                  <td>
                    <Link href={`/cases/temp`} className={styles.primaryLink}>{doc.caseId}</Link>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', padding: '2px 8px', backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-secondary)' }}>
                      {doc.type}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>{doc.size}</td>
                  <td style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>{new Date(doc.date).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)' }}>
                      <Download size={16} style={{ cursor: 'pointer' }} />
                      <MoreVertical size={16} style={{ cursor: 'pointer' }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    </div>
  );
}
