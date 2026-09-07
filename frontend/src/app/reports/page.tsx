'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/app/Dashboard.module.css';
import { Loader2, TrendingUp, Briefcase, CheckCircle, Clock } from 'lucide-react';

export default function ReportsPage() {
  const [metrics, setMetrics] = useState({
    activeCases: 0,
    totalCases: 0,
    completedTasks: 0,
    totalTasks: 0,
    totalRevenue: 0,
    pendingInvoices: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [casesRes, tasksRes, invoicesRes] = await Promise.all([
          fetch('http://10.252.32.1:5000/api/cases'),
          fetch('http://10.252.32.1:5000/api/tasks'),
          fetch('http://10.252.32.1:5000/api/invoices')
        ]);

        if (!casesRes.ok || !tasksRes.ok || !invoicesRes.ok) {
          throw new Error('Failed to fetch data for reports');
        }

        const casesData = await casesRes.json();
        const tasksData = await tasksRes.json();
        const invoicesData = await invoicesRes.json();

        const activeCases = casesData.filter((c: any) => c.status === 'Open' || c.status === 'Pending').length;
        
        const completedTasks = tasksData.filter((t: any) => t.status === 'Completed').length;
        
        const totalRevenue = invoicesData
          .filter((i: any) => i.status === 'Paid')
          .reduce((sum: number, i: any) => sum + i.amount, 0);

        const pendingInvoices = invoicesData
          .filter((i: any) => i.status === 'Unpaid' || i.status === 'Partial')
          .reduce((sum: number, i: any) => sum + i.amount, 0);

        setMetrics({
          activeCases,
          totalCases: casesData.length,
          completedTasks,
          totalTasks: tasksData.length,
          totalRevenue,
          pendingInvoices
        });
        
        setLoading(false);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div className={styles.headerTextContent}>
          <h1 className={styles.title}>Reports & Analytics</h1>
          <p className={styles.subtitle}>Overview of firm performance, revenue, and case progress.</p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <Loader2 className={styles.spin} size={32} style={{ margin: '0 auto 16px auto', display: 'block' }} />
          Calculating metrics from MongoDB...
        </div>
      ) : error ? (
        <div style={{ padding: '24px', color: 'var(--status-danger-text)', backgroundColor: 'var(--status-danger-bg)', borderRadius: 'var(--radius-btn)' }}>
          Failed to load reports: {error}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Top KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            
            <div className={styles.card} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '24px' }}>
              <div style={{ padding: '16px', backgroundColor: 'var(--accent-light)', borderRadius: '12px' }}>
                <TrendingUp size={24} color="var(--accent-color)" />
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '4px' }}>Total Revenue (Paid)</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  ${metrics.totalRevenue.toLocaleString()}
                </div>
              </div>
            </div>

            <div className={styles.card} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '24px' }}>
              <div style={{ padding: '16px', backgroundColor: '#fff3cd', borderRadius: '12px' }}>
                <Clock size={24} color="#856404" />
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '4px' }}>Pending Invoices</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  ${metrics.pendingInvoices.toLocaleString()}
                </div>
              </div>
            </div>

            <div className={styles.card} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '24px' }}>
              <div style={{ padding: '16px', backgroundColor: '#e2e3e5', borderRadius: '12px' }}>
                <Briefcase size={24} color="#383d41" />
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '4px' }}>Active Cases</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {metrics.activeCases} <span style={{ fontSize: '1rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>/ {metrics.totalCases}</span>
                </div>
              </div>
            </div>

            <div className={styles.card} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '24px' }}>
              <div style={{ padding: '16px', backgroundColor: '#d4edda', borderRadius: '12px' }}>
                <CheckCircle size={24} color="#155724" />
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '4px' }}>Tasks Completed</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {metrics.completedTasks} <span style={{ fontSize: '1rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>/ {metrics.totalTasks}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Progress / Detail Section */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
            
            <div className={styles.card} style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '24px' }}>Case Resolution Rate</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ flex: 1, backgroundColor: 'var(--border-color)', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${metrics.totalCases > 0 ? ((metrics.totalCases - metrics.activeCases) / metrics.totalCases) * 100 : 0}%`, 
                    backgroundColor: 'var(--primary-color)', 
                    height: '100%' 
                  }} />
                </div>
                <div style={{ fontWeight: 600 }}>
                  {metrics.totalCases > 0 ? Math.round(((metrics.totalCases - metrics.activeCases) / metrics.totalCases) * 100) : 0}%
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '16px' }}>
                Percentage of total cases that are closed or resolved.
              </p>
            </div>

            <div className={styles.card} style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '24px' }}>Task Completion Rate</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ flex: 1, backgroundColor: 'var(--border-color)', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${metrics.totalTasks > 0 ? (metrics.completedTasks / metrics.totalTasks) * 100 : 0}%`, 
                    backgroundColor: 'var(--status-success-text)', 
                    height: '100%' 
                  }} />
                </div>
                <div style={{ fontWeight: 600 }}>
                  {metrics.totalTasks > 0 ? Math.round((metrics.completedTasks / metrics.totalTasks) * 100) : 0}%
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '16px' }}>
                Percentage of created tasks marked as completed.
              </p>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
