import React from 'react';
import {
  LayoutDashboard,
  Layout,
  Users,
  Briefcase,
  Gavel,
  Scale,
  CalendarDays,
  FileText,
  CheckSquare,
  Clock,
  StickyNote,
  CreditCard,
  FileSpreadsheet,
  Receipt,
  Users2,
  PieChart,
  UserCircle,
  Bot,
  Bell,
  Settings,
  MoreHorizontal,
  X,
  Menu
} from 'lucide-react';
import styles from './Sidebar.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isMobileNavOpen?: boolean;
  closeMobileNav?: () => void;
  openMobileNav?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileNavOpen, closeMobileNav, openMobileNav }) => {
  const pathname = usePathname();
  
  React.useEffect(() => {
    if (isMobileNavOpen && closeMobileNav) {
      closeMobileNav();
    }
  }, [pathname]);

  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false;
    return pathname?.startsWith(path);
  };

  return (
    <>
      {/* Desktop Sidebar (or Mobile Drawer when open) */}
      <aside className={`${styles.sidebar} ${isMobileNavOpen ? styles.mobileDrawerOpen : ''}`}>
        <div className={styles.logoContainer}>
          <Scale className={styles.logoIcon} size={28} />
          <div style={{ flex: 1 }}>
            <h1 className={styles.logoTitle}>LEXORA</h1>
            <p className={styles.logoSubtitle}>LAW CHAMBERS</p>
          </div>
          {isMobileNavOpen && (
            <button className={styles.closeBtn} onClick={closeMobileNav}>
              <X size={24} />
            </button>
          )}
        </div>

        <nav className={styles.nav}>
          <div className={styles.sectionTitle}>MAIN</div>
          <Link href="/" className={`${styles.navItem} ${isActive('/') ? styles.active : ''}`}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>
          <Link href="/workspace" className={`${styles.navItem} ${isActive('/workspace') ? styles.active : ''}`}>
            <Layout size={18} />
            <span>My Workspace</span>
          </Link>

          <div className={styles.sectionTitle}>CASEWORK</div>
          <Link href="/clients" className={`${styles.navItem} ${isActive('/clients') ? styles.active : ''}`}>
            <Users size={18} />
            <span>Clients</span>
          </Link>
          <Link href="/cases" className={`${styles.navItem} ${isActive('/cases') ? styles.active : ''}`}>
            <Briefcase size={18} />
            <span>Cases</span>
          </Link>
          <Link href="/hearings" className={`${styles.navItem} ${isActive('/hearings') ? styles.active : ''}`}>
            <Gavel size={18} />
            <span>Hearings</span>
          </Link>
          <Link href="/courts" className={`${styles.navItem} ${isActive('/courts') ? styles.active : ''}`}>
            <Scale size={18} />
            <span>Courts</span>
          </Link>

          <div className={styles.sectionTitle}>WORKSPACE</div>
          <Link href="/calendar" className={`${styles.navItem} ${isActive('/calendar') ? styles.active : ''}`}>
            <CalendarDays size={18} />
            <span>Calendar</span>
          </Link>

          <Link href="/tasks" className={`${styles.navItem} ${isActive('/tasks') ? styles.active : ''}`}>
            <CheckSquare size={18} />
            <span>Assign</span>
          </Link>
          <Link href="/notes" className={`${styles.navItem} ${isActive('/notes') ? styles.active : ''}`}>
            <StickyNote size={18} />
            <span>Notes</span>
          </Link>


          <div className={styles.sectionTitle}>MANAGEMENT</div>
          <Link href="/staff" className={`${styles.navItem} ${isActive('/staff') ? styles.active : ''}`}>
            <Users2 size={18} />
            <span>Staff</span>
          </Link>
          <Link href="/reports" className={`${styles.navItem} ${isActive('/reports') ? styles.active : ''}`}>
            <PieChart size={18} />
            <span>Reports</span>
          </Link>

          <div className={styles.sectionTitle}>SYSTEM</div>
          <Link href="/notifications" className={`${styles.navItem} ${isActive('/notifications') ? styles.active : ''}`}>
            <Bell size={18} />
            <span>Notifications</span>
          </Link>
          <Link href="/settings" className={`${styles.navItem} ${isActive('/settings') ? styles.active : ''}`}>
            <Settings size={18} />
            <span>Settings</span>
          </Link>

        </nav>


      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className={styles.mobileNav}>
        <Link href="/" className={`${styles.mobileNavItem} ${isActive('/') ? styles.mobileActive : ''}`}>
          <LayoutDashboard size={24} />
          <span>Home</span>
        </Link>
        <Link href="/cases" className={`${styles.mobileNavItem} ${isActive('/cases') ? styles.mobileActive : ''}`}>
          <Briefcase size={24} />
          <span>Cases</span>
        </Link>
        <Link href="/calendar" className={`${styles.mobileNavItem} ${isActive('/calendar') ? styles.mobileActive : ''}`}>
          <CalendarDays size={24} />
          <span>Calendar</span>
        </Link>
        <Link href="/settings" className={`${styles.mobileNavItem} ${isActive('/settings') ? styles.mobileActive : ''}`}>
          <Settings size={24} />
          <span>Settings</span>
        </Link>
        <button className={styles.mobileNavItem} onClick={openMobileNav} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <Menu size={24} />
          <span>More</span>
        </button>
      </nav>


    </>
  );
};

export default Sidebar;
