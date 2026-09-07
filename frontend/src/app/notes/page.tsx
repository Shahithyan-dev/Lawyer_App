'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/app/Dashboard.module.css';
import { Plus, Loader2, FileText, MessageSquare, PhoneCall, Mail } from 'lucide-react';
import Link from 'next/link';

export default function NotesPage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://10.252.32.1:5000/api/notes')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch notes');
        return res.json();
      })
      .then((data) => {
        setNotes(data);
        setLoading(false);
      })
      .catch((err: any) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'Client Call':
        return <PhoneCall size={18} color="var(--primary-color)" />;
      case 'Email':
        return <Mail size={18} color="var(--primary-color)" />;
      case 'Meeting':
        return <Users size={18} color="var(--primary-color)" />;
      default:
        return <MessageSquare size={18} color="var(--primary-color)" />;
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div className={styles.headerTextContent}>
          <h1 className={styles.title}>Communications & Notes</h1>
          <p className={styles.subtitle}>Log case notes, client calls, and important updates.</p>
        </div>
        <div className={styles.headerActions}>
          <Link href="/notes/new" style={{ textDecoration: 'none' }}>
            <button className={styles.btnPrimary}>
              <Plus size={18} /> Add Note
            </button>
          </Link>
        </div>
      </div>

      <div className={styles.card}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Loader2 className={styles.spin} size={32} style={{ margin: '0 auto 16px auto', display: 'block' }} />
            Loading notes from MongoDB...
          </div>
        ) : error ? (
          <div style={{ padding: '24px', color: 'var(--status-danger-text)', backgroundColor: 'var(--status-danger-bg)', borderRadius: 'var(--radius-btn)' }}>
            Failed to load notes: {error}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {notes.map((note) => (
              <div key={note._id} style={{ 
                border: '1px solid var(--border-color)', 
                borderRadius: 'var(--radius-md)', 
                padding: '24px', 
                backgroundColor: 'var(--bg-color)',
                boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ padding: '8px', backgroundColor: 'var(--accent-light)', borderRadius: '8px' }}>
                       <FileText size={16} color="var(--accent-color)" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{note.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{new Date(note.date).toLocaleString()}</div>
                    </div>
                  </div>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    padding: '4px 8px', 
                    borderRadius: '12px',
                    fontWeight: 500,
                    backgroundColor: 'var(--surface-color)',
                    border: '1px solid var(--border-color)'
                  }}>
                    {note.type}
                  </span>
                </div>
                
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                  {note.content}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                  {note.relatedCase ? (
                    <div style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 500 }}>
                       Case: {note.relatedCase.caseId}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>General</div>
                  )}
                  {note.author && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      By: {note.author.name}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {notes.length === 0 && (
              <div style={{ gridColumn: '1 / -1', padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No notes or communications logged yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
