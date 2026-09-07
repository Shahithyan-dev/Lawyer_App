'use client';

import React, { useState } from 'react';
import { Plus, User, Briefcase, Calendar, CheckSquare, FileText, IndianRupee, X } from 'lucide-react';
import Link from 'next/link';
import styles from './FloatingActionButton.module.css';
import { usePathname } from 'next/navigation';

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Don't show FAB on login or junior dashboard
  if (pathname === '/login' || pathname === '/junior-dashboard') {
    return null;
  }

  const toggleMenu = () => setIsOpen(!isOpen);

  const actions = [
    { icon: <User size={18} />, label: 'Add Client', href: '/clients/new' },
    { icon: <Briefcase size={18} />, label: 'Add Case', href: '/cases/new' },
    { icon: <Calendar size={18} />, label: 'Add Hearing', href: '/hearings/new' },
    { icon: <CheckSquare size={18} />, label: 'Add Task', href: '/tasks/new' },
    { icon: <FileText size={18} />, label: 'Upload Document', href: '/documents/new' },
    { icon: <IndianRupee size={18} />, label: 'Add Payment', href: '/finance/new' },
  ];

  return (
    <div className={styles.fabContainer}>
      {/* Backdrop overlay when open */}
      {isOpen && <div className={styles.backdrop} onClick={() => setIsOpen(false)} />}
      
      {/* Action Menu */}
      <div className={`${styles.actionMenu} ${isOpen ? styles.open : ''}`}>
        {actions.map((action, index) => (
          <Link key={index} href={action.href} onClick={() => setIsOpen(false)} className={styles.actionItem}>
            <span className={styles.actionLabel}>{action.label}</span>
            <div className={styles.actionIcon}>
              {action.icon}
            </div>
          </Link>
        ))}
      </div>

      {/* Main FAB Button */}
      <button 
        className={`${styles.fab} ${isOpen ? styles.fabOpen : ''}`} 
        onClick={toggleMenu}
        aria-label="Quick Actions"
      >
        {isOpen ? <X size={24} /> : <Plus size={24} />}
      </button>
    </div>
  );
};

export default FloatingActionButton;
