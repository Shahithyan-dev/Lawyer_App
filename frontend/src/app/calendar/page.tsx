'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/app/Dashboard.module.css';
import { ChevronLeft, ChevronRight, Plus, Loader2 } from 'lucide-react';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const [casesRes, tasksRes] = await Promise.all([
          fetch('http://10.252.32.1:5000/api/cases'),
          fetch('http://10.252.32.1:5000/api/tasks')
        ]);
        const cases = await casesRes.json();
        const tasks = await tasksRes.json();

        const formattedEvents: any[] = [];
        
        cases.forEach((c: any) => {
          if (c.nextHearing) {
            formattedEvents.push({
              id: `case-${c._id}`,
              title: c.caseId,
              subTitle: c.title,
              date: new Date(c.nextHearing),
              type: 'hearing',
              color: 'var(--status-info-text)',
              bg: 'var(--status-info-bg)'
            });
          }
        });

        tasks.forEach((t: any) => {
          if (t.dueDate) {
            formattedEvents.push({
              id: `task-${t._id}`,
              title: t.title,
              subTitle: t.status,
              date: new Date(t.dueDate),
              type: 'task',
              color: 'var(--status-warning-text)',
              bg: 'var(--status-warning-bg)'
            });
          }
        });

        setEvents(formattedEvents);
      } catch (err) {
        console.error("Failed to fetch events", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Calendar math
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' }).toUpperCase();

  const renderCells = () => {
    const cells = [];
    
    // Empty cells before start of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push(<div key={`empty-${i}`} style={{ minHeight: '120px', borderRight: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', backgroundColor: '#fafafa' }}></div>);
    }
    
    // Days of the month
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();
      const dayEvents = events.filter(e => e.date.toDateString() === new Date(year, month, d).toDateString());
      
      cells.push(
        <div key={d} style={{ minHeight: '120px', borderRight: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '8px' }}>
          <div style={{ 
            width: '28px', height: '28px', 
            borderRadius: '50%', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: isToday ? 'var(--primary-color)' : 'transparent',
            color: isToday ? '#fff' : 'inherit',
            fontWeight: isToday ? 'bold' : 'normal',
            fontSize: '0.9rem',
            marginBottom: '8px'
          }}>
            {d}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {dayEvents.map(evt => (
              <div key={evt.id} style={{ 
                backgroundColor: evt.bg, 
                borderLeft: `3px solid ${evt.color}`,
                padding: '4px 6px',
                borderRadius: '4px',
                fontSize: '0.75rem'
              }}>
                <div style={{ fontWeight: 600, color: evt.color, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{evt.title}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{evt.subTitle}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    // Empty cells at the end to complete the grid
    const totalCells = firstDayOfMonth + daysInMonth;
    const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let i = 0; i < remainingCells; i++) {
      cells.push(<div key={`empty-end-${i}`} style={{ minHeight: '120px', borderRight: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', backgroundColor: '#fafafa' }}></div>);
    }

    return cells;
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Calendar</h1>
          <p className={styles.subtitle}>Manage your hearings, meetings, and appointments.</p>
        </div>
        <div>
          <button className={styles.btnPrimary}>
            <Plus size={18} /> Add Event
          </button>
        </div>
      </div>

      <div className={styles.card} style={{ padding: '0' }}>
        
        {/* Calendar Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{monthName}</div>
          <div className={styles.calendarNav} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => setCurrentDate(new Date())} style={{ background: 'none', border: '1px solid var(--border-color)', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>
              Today
            </button>
            <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
             <Loader2 className={styles.spin} size={32} style={{ margin: '0 auto 16px auto', display: 'block' }} />
             Loading calendar data...
          </div>
        ) : (
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <div style={{ minWidth: '800px', display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
              {daysOfWeek.map(day => (
                <div key={day} style={{ padding: '12px', textAlign: 'center', fontWeight: '600', fontSize: '0.85rem', color: 'var(--text-tertiary)', borderRight: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)' }}>
                  {day}
                </div>
              ))}
              {renderCells()}
            </div>
            
            {/* Legend */}
            <div style={{ padding: '16px 24px', display: 'flex', gap: '24px', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                    <div style={{ width: '12px', height: '12px', backgroundColor: 'var(--status-info-text)', borderRadius: '2px' }}></div>
                    <span>Case Hearing</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                    <div style={{ width: '12px', height: '12px', backgroundColor: 'var(--status-warning-text)', borderRadius: '2px' }}></div>
                    <span>Task Deadline</span>
                </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
