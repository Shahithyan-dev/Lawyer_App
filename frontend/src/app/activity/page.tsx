'use client';

import React from 'react';
import styles from '@/app/Dashboard.module.css';
import { Activity, Clock } from 'lucide-react';

export default function ActivityLogPage() {
  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div className={styles.headerTextContent}>
          <h1 className={styles.title}>Activity Log</h1>
          <p className={styles.subtitle}>Track all actions and events across the system.</p>
        </div>
      </div>

      <div className={styles.card}>
        <div style={{ padding: '64px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <Activity size={48} style={{ opacity: 0.2, margin: '0 auto 16px auto', display: 'block' }} />
          <h3 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>No Recent Activity</h3>
          <p>System events, logins, and data modifications will appear here.</p>
        </div>
      </div>
    </div>
  );
}
