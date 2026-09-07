'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/app/Dashboard.module.css';
import { LogOut, Calendar, CheckSquare, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function JuniorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('lexoraUser');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    if (parsedUser.role !== 'Junior Advocate') {
      router.push('/');
      return;
    }

    // Fetch tasks assigned to this specific junior
    fetch(`http://10.252.32.1:5000/api/tasks?assignedTo=${parsedUser._id}`)
      .then((res) => res.json())
      .then((data) => {
        const userTasks = data.filter((t: any) => t.assignedTo?._id === parsedUser._id);
        setTasks(userTasks);
        setLoading(false);
      })
      .catch((err: any) => {
        setError('Failed to fetch tasks');
        setLoading(false);
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('lexoraUser');
    router.push('/login');
  };

  if (!user) return null;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      
      {/* Junior Header */}
      <header style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.2rem', margin: 0, fontFamily: 'var(--font-heading)' }}>LEXORA • JUNIOR ADVOCATE PORTAL</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <span style={{ fontSize: '0.9rem' }}>Welcome, {user.name}</span>
          <button onClick={handleLogout} style={{ color: 'var(--status-danger-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
             <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', color: 'var(--primary-color)', marginBottom: '8px' }}>My Assigned Tasks</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Review and complete the tasks assigned to you by the Senior Advocate.</p>

        {loading ? (
          <div>Loading your tasks...</div>
        ) : tasks.length === 0 ? (
          <div className={styles.card} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
             You have no assigned tasks at the moment.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {tasks.map((task) => (
              <div key={task._id} className={styles.card} style={{ borderTop: `4px solid ${task.priority === 'HIGH PRIORITY' ? 'var(--status-danger-text)' : 'var(--accent-color)'}` }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                   <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: task.priority === 'HIGH PRIORITY' ? 'var(--status-danger-text)' : 'var(--text-secondary)' }}>{task.priority}</span>
                   <span style={{ fontSize: '0.8rem', color: 'var(--status-info-text)', backgroundColor: 'var(--status-info-bg)', padding: '2px 8px', borderRadius: '4px' }}>{task.status}</span>
                 </div>
                 <h3 style={{ marginBottom: '8px' }}>{task.title}</h3>
                 <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>{task.description}</p>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
                    <Clock size={16} /> Due: {new Date(task.dueDate).toLocaleDateString()}
                 </div>
                 <button className={styles.btnSecondary} style={{ width: '100%', marginTop: '16px', justifyContent: 'center' }}>Mark as Done</button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
