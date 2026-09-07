'use client';

import React from 'react';
import { Search, Bell, MessageSquare, ChevronDown, AlignLeft, Edit2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './Header.module.css';

interface HeaderProps {
  onOpenMobileNav?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenMobileNav }) => {
  const pathname = usePathname();
  
  const [profileImage, setProfileImage] = React.useState<string>("https://ui-avatars.com/api/?name=Advocate+Kumar&background=c49a45&color=fff");
  const [unreadCount, setUnreadCount] = React.useState(0);

  React.useEffect(() => {
    const loadAvatar = () => {
      const savedImage = localStorage.getItem('userAvatar');
      if (savedImage) setProfileImage(savedImage);
    };
    
    loadAvatar();
    window.addEventListener('avatarUpdated', loadAvatar);

    // Fetch unread notifications
    const fetchNotifications = async () => {
      try {
        const userStr = localStorage.getItem('lexoraUser');
        if (!userStr) return;
        const user = JSON.parse(userStr);
        const res = await fetch(`http://10.252.32.1:5000/api/notifications/${user._id}`);
        if (res.ok) {
          const data = await res.json();
          const unread = data.filter((n: any) => !n.isRead).length;
          setUnreadCount(unread);
        }
      } catch (err) {
        console.error("Failed to fetch notifications count", err);
      }
    };
    fetchNotifications();

    return () => window.removeEventListener('avatarUpdated', loadAvatar);
  }, []);

  // Basic logic to determine mobile title based on pathname
  let mobileTitle = 'Dashboard';
  if (pathname.includes('/clients')) mobileTitle = 'Clients';
  if (pathname.includes('/cases')) mobileTitle = 'My Cases';
  if (pathname.includes('/calendar')) mobileTitle = 'Calendar';
  if (pathname.includes('/documents')) mobileTitle = 'Documents';
  if (pathname.includes('/tasks')) mobileTitle = 'Tasks';
  if (pathname.includes('/payments')) mobileTitle = 'Payments';
  if (pathname.includes('/profile')) mobileTitle = 'Profile';

  return (
    <header className={styles.header}>
      {/* Desktop Header Content */}
      <div className={styles.desktopContent}>
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} size={18} />
          <input 
            type="text" 
            placeholder="Search clients, cases, documents..." 
            className={styles.searchInput}
          />
          <div className={styles.shortcut}>Ctrl + K</div>
        </div>

        <div className={styles.actions}>
          <Link href="/notifications">
            <button className={styles.iconButton}>
              <Bell size={20} />
              {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
            </button>
          </Link>
          <button className={styles.iconButton}>
            <MessageSquare size={20} />
          </button>
          
          <div className={styles.divider}></div>
          
          <div className={styles.profile}>
            <img 
              src={profileImage}
              alt="User avatar" 
              className={styles.avatar}
              style={{ objectFit: 'cover' }}
            />
            <div className={styles.userInfo}>
              <div className={styles.userName}>Advocate Kumar</div>
              <div className={styles.userRole}>Senior Advocate</div>
            </div>
            <ChevronDown size={16} className={styles.chevron} />
          </div>
        </div>
      </div>

      {/* Mobile Header Content */}
      <div className={styles.mobileContent}>
        <button className={styles.iconButton} onClick={onOpenMobileNav}>
          <AlignLeft size={24} strokeWidth={1.75} />
        </button>
        <h1 className={styles.mobileTitle}>{mobileTitle}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {pathname.includes('/profile') ? (
            <button className={styles.iconButton} onClick={() => window.dispatchEvent(new Event('openProfileModal'))}>
              <Edit2 size={20} strokeWidth={1.75} />
            </button>
          ) : (
            <>
              <Link href="/notifications">
                <button className={styles.iconButton}>
                  <Bell size={22} strokeWidth={1.75} />
                  {unreadCount > 0 && <span className={styles.badgeDot}></span>}
                </button>
              </Link>
              <Link href="/profile">
                <img 
                  src={profileImage}
                  alt="User avatar" 
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
