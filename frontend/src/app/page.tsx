'use client';

import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  CheckSquare, 
  IndianRupee,
  MapPin,
  ChevronRight,
  ChevronLeft,
  CalendarDays,
  FileText,
  Clock,
  Plus
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Wait for component to mount to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const blankDays = Array.from({length: firstDayOfMonth}, (_, i) => i);
  const currentDays = Array.from({length: daysInMonth}, (_, i) => i + 1);
  
  const totalCells = firstDayOfMonth + daysInMonth;
  const nextDaysCount = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  const nextDays = Array.from({length: nextDaysCount}, (_, i) => i + 1);

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const todayDateString = currentDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const todayDayNumber = new Date().getDate();
  const isCurrentMonth = new Date().getMonth() === month && new Date().getFullYear() === year;

  if (!mounted) return null;

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <span className={styles.greetingText}>Good Morning, </span>
            <br className={styles.mobileBreak} />
            Advocate Kumar <span className={styles.sun}>☀️</span>
          </h1>
        </div>
        <div className={styles.date}>{todayDateString}</div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIconWrapper} style={{ color: '#c49a45', backgroundColor: '#fef8f0' }}>
            <Users size={20} />
          </div>
          <div>
            <div className={styles.statValue}>128</div>
            <div className={styles.statLabel}>Clients</div>
            <div className={styles.statTrendUp}>↑ 12% from last month</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIconWrapper} style={{ color: '#c49a45', backgroundColor: '#fef8f0' }}>
            <Briefcase size={20} />
          </div>
          <div>
            <div className={styles.statValue}>46</div>
            <div className={styles.statLabel}>Active Cases</div>
            <div className={styles.statTrendUp}>↑ 8% from last month</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIconWrapper} style={{ color: '#8b5cf6', backgroundColor: '#f3e8ff' }}>
            <Calendar size={20} />
          </div>
          <div>
            <div className={styles.statValue}>12</div>
            <div className={styles.statLabel}>Today's Hearings</div>
            <div className={styles.statTrendDown}>↓ 2% from yesterday</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIconWrapper} style={{ color: '#c49a45', backgroundColor: '#fef8f0' }}>
            <CheckSquare size={20} />
          </div>
          <div>
            <div className={styles.statValue}>28</div>
            <div className={styles.statLabel}>Pending Tasks</div>
            <div className={styles.statTrendUp}>↑ 5% from yesterday</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIconWrapper} style={{ color: '#c49a45', backgroundColor: '#fef8f0' }}>
            <IndianRupee size={20} />
          </div>
          <div>
            <div className={styles.statValue}>₹2,40,000</div>
            <div className={styles.statLabel}>Pending Payments</div>
            <div className={styles.statTrendUp}>↑ 15% from last month</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIconWrapper} style={{ color: '#3b82f6', backgroundColor: '#eff6ff' }}>
            <Users size={20} />
          </div>
          <div>
            <div className={styles.statValue}>05</div>
            <div className={styles.statLabel}>Appointments Today</div>
            <div className={styles.statTrendUp}>↑ 15% from last month</div>
          </div>
        </div>
      </div>

      <div className={styles.mainGrid}>
        {/* Left Column - Upcoming Hearings */}
        <div className={styles.card}>
          <div className={styles.cardHeaderMobile}>
            <div className={styles.cardTitleMobile}>
              Today's Hearings
            </div>
            <button className={styles.btnViewAllMobile}>View All</button>
          </div>
          
          <div className={styles.hearingListMobile}>
            <div className={styles.hearingItemMobile}>
              <div className={styles.hearingTimeBox}>
                <div className={styles.timeValueBox}>10:30</div>
                <div className={styles.timeAmPmBox}>AM</div>
              </div>
              <div className={styles.hearingDetailsMobile}>
                <div className={styles.caseIdMobile}>CR-1023</div>
                <div className={styles.caseNameMobile}>Raj Kumar vs State</div>
                <div className={styles.courtNameMobile}>District Court, Court No. 4</div>
              </div>
              <div className={styles.hearingStatusDotGreen}></div>
            </div>

            <div className={styles.hearingItemMobile}>
              <div className={styles.hearingTimeBox}>
                <div className={styles.timeValueBox}>12:00</div>
                <div className={styles.timeAmPmBox}>PM</div>
              </div>
              <div className={styles.hearingDetailsMobile}>
                <div className={styles.caseIdMobile}>CIV-2041</div>
                <div className={styles.caseNameMobile}>Arun Enterprises vs Suresh & Co.</div>
                <div className={styles.courtNameMobile}>High Court, Court No. 2</div>
              </div>
              <div className={styles.hearingStatusDotOrange}></div>
            </div>

            <div className={styles.hearingItem}>
              <div className={styles.hearingTime}>
                <div className={styles.timeValue}>02:30</div>
                <div className={styles.timeAmPm}>PM</div>
              </div>
              <div className={styles.hearingDetails}>
                <div className={styles.caseId}>FM-1022</div>
                <div className={styles.caseName}>Priya Sharma vs Rohit Sharma</div>
                <div className={styles.courtName}>Family Court, Court No. 1</div>
              </div>
              <div className={styles.hearingStatus}>
                <span className={`${styles.badge} ${styles.badgeSuccess}`}>Mediation</span>
                <MapPin size={16} className={styles.pinIcon} />
              </div>
            </div>

            <div className={styles.hearingItem}>
              <div className={styles.hearingTime}>
                <div className={styles.timeValue}>04:00</div>
                <div className={styles.timeAmPm}>PM</div>
              </div>
              <div className={styles.hearingDetails}>
                <div className={styles.caseId}>CR-2055</div>
                <div className={styles.caseName}>State vs Mohan Das</div>
                <div className={styles.courtName}>District Court, Court No. 7</div>
              </div>
              <div className={styles.hearingStatus}>
                <span className={`${styles.badge} ${styles.badgeWarning}`}>Hearing</span>
                <MapPin size={16} className={styles.pinIcon} />
              </div>
            </div>

            <div className={styles.viewAll}>
              View all hearings <ChevronRight size={16} />
            </div>
          </div>
        </div>

        {/* Middle Column - Calendar */}
        <div className={styles.card}>
           <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <Calendar size={18} />
              Calendar
            </div>
            <div className={styles.calendarNav}>
              <span className={styles.calendarMonth}>{monthName}</span>
              <div className={styles.calendarNavButtons}>
                <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                  <ChevronLeft size={16} />
                </button>
                <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
          
          <div className={styles.calendarGrid}>
            {daysOfWeek.map(day => (
              <div key={day} className={styles.calendarDayName}>{day}</div>
            ))}
            {blankDays.map((_, idx) => (
              <div key={`blank-${idx}`} className={`${styles.calendarDay} ${styles.inactive}`}></div>
            ))}
            {currentDays.map(day => (
              <div key={`current-${day}`} className={`${styles.calendarDay} ${isCurrentMonth && day === todayDayNumber ? styles.active : ''}`}>{day}</div>
            ))}
            {nextDays.map(day => (
              <div key={`next-${day}`} className={`${styles.calendarDay} ${styles.inactive}`}>{day}</div>
            ))}
          </div>

          <div className={styles.todaySummary}>
            <div className={styles.summaryTitle}>Today's Summary</div>
            <div className={styles.summaryItems}>
              <div className={styles.summaryItem}>
                <Calendar size={14} /> 12 Hearings
              </div>
              <div className={styles.summaryItem}>
                <Users size={14} /> 3 Appointments
              </div>
              <div className={styles.summaryItem}>
                <CheckSquare size={14} /> 5 Tasks
              </div>
            </div>
            <div className={styles.viewAll} style={{marginTop: '24px'}}>
              Go to Calendar <ChevronRight size={16} />
            </div>
          </div>
        </div>

        {/* Right Column - Case Activity */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>Case Activity</div>
            <button className={styles.btnSecondary}>View All</button>
          </div>
          <div className={styles.activityList}>
             <div className={styles.activityItem}>
                <div className={styles.activityIcon} style={{color: '#f59e0b', backgroundColor: '#fffbeb'}}><FileText size={16}/></div>
                <div className={styles.activityContent}>
                  <div className={styles.activityTitle}>Case CR-1023 updated</div>
                  <div className={styles.activityDesc}>Status changed to Hearing</div>
                </div>
                <div className={styles.activityTime}>10:15 AM</div>
             </div>

             <div className={styles.activityItem}>
                <div className={styles.activityIcon} style={{color: '#3b82f6', backgroundColor: '#eff6ff'}}><FileText size={16}/></div>
                <div className={styles.activityContent}>
                  <div className={styles.activityTitle}>Document uploaded</div>
                  <div className={styles.activityDesc}>Court_Order_15May.pdf</div>
                </div>
                <div className={styles.activityTime}>09:45 AM</div>
             </div>

             <div className={styles.activityItem}>
                <div className={styles.activityIcon} style={{color: '#10b981', backgroundColor: '#ecfdf5'}}><IndianRupee size={16}/></div>
                <div className={styles.activityContent}>
                  <div className={styles.activityTitle}>Payment received</div>
                  <div className={styles.activityDesc}>₹25,000 from Raj Kumar</div>
                </div>
                <div className={styles.activityTime}>09:30 AM</div>
             </div>

             <div className={styles.activityItem}>
                <div className={styles.activityIcon} style={{color: '#64748b', backgroundColor: '#f1f5f9'}}><CheckSquare size={16}/></div>
                <div className={styles.activityContent}>
                  <div className={styles.activityTitle}>New task created</div>
                  <div className={styles.activityDesc}>Draft reply for CIV-2041</div>
                </div>
                <div className={styles.activityTime}>Yesterday</div>
             </div>

             <div className={styles.activityItem}>
                <div className={styles.activityIcon} style={{color: '#8b5cf6', backgroundColor: '#f3e8ff'}}><Calendar size={16}/></div>
                <div className={styles.activityContent}>
                  <div className={styles.activityTitle}>Hearing scheduled</div>
                  <div className={styles.activityDesc}>CR-2055 on 28 May 2026</div>
                </div>
                <div className={styles.activityTime}>Yesterday</div>
             </div>

             <div className={styles.viewAll}>
                View all activity <ChevronRight size={16} />
             </div>
          </div>
        </div>
      </div>
      
      {/* Tables section */}
      <div className={styles.tablesSection}>
        {/* Recent Cases */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>Recent Cases</div>
            <button className={styles.btnSecondary}>View All Cases</button>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Case No.</th>
                <th>Client</th>
                <th>Case Type</th>
                <th>Court</th>
                <th>Status</th>
                <th>Next Hearing</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles.primaryText}>CR-1023</td>
                <td>Raj Kumar</td>
                <td>Criminal</td>
                <td>District Court</td>
                <td><span className={`${styles.statusBadge} ${styles.active}`}>Active</span></td>
                <td>28 May 2026</td>
              </tr>
              <tr>
                <td className={styles.primaryText}>CIV-2041</td>
                <td>Arun Enterprises</td>
                <td>Civil</td>
                <td>High Court</td>
                <td><span className={`${styles.statusBadge} ${styles.hearing}`}>Hearing</span></td>
                <td>30 May 2026</td>
              </tr>
              <tr>
                <td className={styles.primaryText}>FM-1022</td>
                <td>Priya Sharma</td>
                <td>Family</td>
                <td>Family Court</td>
                <td><span className={`${styles.statusBadge} ${styles.pending}`}>Pending</span></td>
                <td>05 Jun 2026</td>
              </tr>
              <tr>
                <td className={styles.primaryText}>CR-2055</td>
                <td>Mohan Das</td>
                <td>Criminal</td>
                <td>District Court</td>
                <td><span className={`${styles.statusBadge} ${styles.active}`}>Active</span></td>
                <td>28 May 2026</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pending Payments */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>Pending Payments</div>
            <button className={styles.btnSecondary}>View All</button>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Client</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles.primaryText}>Raj Kumar</td>
                <td>₹25,000</td>
                <td>25 May 2026</td>
                <td><span className={`${styles.statusBadge} ${styles.hearing}`}>Pending</span></td>
              </tr>
              <tr>
                <td className={styles.primaryText}>Arun Enterprises</td>
                <td>₹50,000</td>
                <td>28 May 2026</td>
                <td><span className={`${styles.statusBadge} ${styles.hearing}`}>Pending</span></td>
              </tr>
              <tr>
                <td className={styles.primaryText}>Priya Sharma</td>
                <td>₹20,000</td>
                <td>02 Jun 2026</td>
                <td><span className={`${styles.statusBadge} ${styles.hearing}`}>Pending</span></td>
              </tr>
              <tr>
                <td className={styles.primaryText}>Suresh & Co.</td>
                <td>₹15,000</td>
                <td>05 Jun 2026</td>
                <td><span className={`${styles.statusBadge} ${styles.overdue}`}>Overdue</span></td>
              </tr>
            </tbody>
          </table>
          <div className={styles.viewAll} style={{marginTop: '16px'}}>
            View all payments <ChevronRight size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}
