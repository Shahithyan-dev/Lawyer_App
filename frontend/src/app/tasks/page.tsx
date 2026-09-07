'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/app/Dashboard.module.css';
import { Plus, CheckCircle, Clock, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function TasksPage() {
  const tabs = ['My Tasks', 'Team Tasks', 'Completed Tasks'];
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://10.252.32.1:5000/api/tasks')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch tasks');
        return res.json();
      })
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch((err: any) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div className={styles.headerTextContent}>
          <h1 className={styles.title}>Task Management</h1>
          <p className={styles.subtitle}>Track priorities, deadlines, and casework assignments.</p>
        </div>
        <div className={styles.headerActions}>
          <Link href="/tasks/new" style={{ textDecoration: 'none' }}>
            <button className={styles.btnPrimary}>
              <Plus size={18} /> Add Task
            </button>
          </Link>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        {tabs.map((tab, idx) => (
          <button 
            key={tab}
            style={{ 
              padding: '8px 20px', 
              borderRadius: 'var(--radius-full)', 
              backgroundColor: idx === 0 ? 'var(--primary-color)' : 'var(--surface-color)',
              color: idx === 0 ? 'white' : 'var(--text-secondary)',
              border: idx === 0 ? 'none' : '1px solid var(--border-color)',
              fontWeight: '500',
              fontSize: '0.9rem'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <Loader2 className={styles.spin} size={32} style={{ margin: '0 auto 16px auto', display: 'block' }} />
          Loading tasks from MongoDB...
        </div>
      ) : error ? (
        <div style={{ padding: '24px', color: 'var(--status-danger-text)', backgroundColor: 'var(--status-danger-bg)', borderRadius: 'var(--radius-btn)' }}>
          Failed to load tasks: {error}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          
          {tasks.map((task) => (
            <div key={task._id} className={styles.card} style={{ 
              padding: '24px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '16px', 
              borderTop: `4px solid ${task.priority === 'HIGH PRIORITY' ? 'var(--status-danger-text)' : 'var(--border-color)'}` 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 'bold', 
                  color: task.priority === 'HIGH PRIORITY' ? 'var(--status-danger-text)' : 'var(--text-secondary)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px' 
                }}>
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    backgroundColor: task.priority === 'HIGH PRIORITY' ? 'var(--status-danger-text)' : 'var(--text-secondary)' 
                  }}></div> 
                  {task.priority}
                </span>
                <span style={{ 
                  fontSize: '0.8rem', 
                  color: task.status === 'In Progress' ? 'var(--status-info-text)' : 'var(--text-secondary)', 
                  backgroundColor: task.status === 'In Progress' ? 'var(--status-info-bg)' : 'var(--bg-color)', 
                  padding: '4px 8px', 
                  borderRadius: '4px', 
                  fontWeight: '600', 
                  border: task.status === 'In Progress' ? 'none' : '1px solid var(--border-color)' 
                }}>
                  {task.status}
                </span>
              </div>
              
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{task.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {task.description}
                </p>
              </div>

              <div style={{ backgroundColor: 'var(--bg-color)', padding: '12px', borderRadius: 'var(--radius-btn)', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Case:</span>
                  <span style={{ fontWeight: '600', color: 'var(--primary-color)' }}>
                    {task.caseReference ? task.caseReference.caseId : 'N/A'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Assigned:</span>
                  <span style={{ fontWeight: '600', color: 'var(--primary-color)' }}>{task.assignedTo ? task.assignedTo.name : 'Unassigned'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Due:</span>
                  <span style={{ 
                    fontWeight: '600', 
                    color: new Date(task.dueDate) < new Date() ? 'var(--status-danger-text)' : 'var(--text-primary)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px' 
                  }}>
                    <Clock size={14} /> {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <button className={styles.btnSecondary} style={{ width: '100%', justifyContent: 'center' }}>
                {task.status === 'Completed' ? 'View Details' : 'Update Status'}
              </button>
            </div>
          ))}

          {tasks.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
               No tasks found. Create one to get started.
            </div>
          )}

        </div>
      )}
    </div>
  );
}
