'use client';

import React from 'react';
import styles from '@/app/Dashboard.module.css';

export default function WorkspacePage() {
  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Workspace</h1>
          <p className={styles.subtitle}>Manage your workspace here.</p>
        </div>
      </div>
      <div className={styles.card} style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--primary-color)' }}>Coming Soon</h2>
          <p>The Workspace module is currently under development.</p>
        </div>
      </div>
    </div>
  );
}
