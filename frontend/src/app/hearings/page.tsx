'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/app/Dashboard.module.css';
import { Calendar as CalendarIcon, MapPin, Clock, Search, Filter, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Case {
  _id: string;
  caseId: string;
  title: string;
  type: string;
  court: string;
  nextHearing: string;
  client?: { name: string };
}

export default function HearingsPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://10.252.32.1:5000/api/cases')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch cases');
        return res.json();
      })
      .then((data) => {
        // Filter cases that have a nextHearing date and sort by nearest date
        const upcomingHearings = data
          .filter((c: Case) => c.nextHearing)
          .sort((a: Case, b: Case) => new Date(a.nextHearing).getTime() - new Date(b.nextHearing).getTime());
        setCases(upcomingHearings);
        setLoading(false);
      })
      .catch((err: any) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Hearings</h1>
          <p className={styles.subtitle}>Track your upcoming court dates and schedules.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link href="/calendar" style={{ textDecoration: 'none' }}>
            <button className={styles.btnSecondary} style={{ padding: '8px 12px' }}>
              <CalendarIcon size={18} /> View Calendar
            </button>
          </Link>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            Upcoming Hearings
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Loader2 className={styles.spin} size={32} style={{ margin: '0 auto 16px auto', display: 'block' }} />
            Loading hearings...
          </div>
        ) : error ? (
           <div style={{ padding: '24px', color: 'var(--status-danger-text)', backgroundColor: 'var(--status-danger-bg)', borderRadius: 'var(--radius-btn)' }}>
            {error}
          </div>
        ) : cases.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
            No upcoming hearings scheduled.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cases.map((c) => (
              <div key={c._id} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-color)', gap: '16px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '24px' }}>
                  
                  {/* Date Block */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'var(--accent-light)', color: 'var(--accent-color)', padding: '12px 16px', borderRadius: 'var(--radius-md)', minWidth: '80px' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', lineHeight: 1 }}>
                      {new Date(c.nextHearing).getDate()}
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
                      {new Date(c.nextHearing).toLocaleString('default', { month: 'short' })}
                    </div>
                  </div>

                  {/* Details Block */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <Link href={`/cases/${c._id}`} className={styles.primaryLink} style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                        {c.caseId} - {c.title}
                      </Link>
                      <span style={{ fontSize: '0.75rem', padding: '2px 8px', backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-secondary)' }}>
                        {c.type}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '16px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={14} /> {c.court}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CalendarIcon size={14} /> {new Date(c.nextHearing).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                </div>

                <div style={{ textAlign: 'right' }}>
                   <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Client</div>
                   <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{c.client?.name || 'Unknown'}</div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
