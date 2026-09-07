'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import FloatingActionButton from "@/components/FloatingActionButton";
import layoutStyles from "@/components/MainLayout.module.css";

export default function LayoutClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Simple Auth Guard
    const user = localStorage.getItem('lexoraUser');
    if (!user && pathname !== '/login') {
      router.push('/login');
    }
    // Suppress harmless 'releasePointerCapture' error on touch devices
    const errorHandler = (e: ErrorEvent) => {
      if (e.message.includes('releasePointerCapture')) {
        e.preventDefault();
      }
    };
    window.addEventListener('error', errorHandler);

    // Register Service Worker for Push Notifications
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(
        function(registration) {
          console.log('ServiceWorker registration successful');
        },
        function(err) {
          console.log('ServiceWorker registration failed: ', err);
        }
      );
    }

    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, [pathname, router]);

  if (!mounted) return <div style={{ height: '100vh', backgroundColor: 'var(--bg-color)' }}></div>;

  const isLoginPage = pathname === '/login';
  const isJuniorDashboard = pathname === '/junior-dashboard';

  if (isLoginPage || isJuniorDashboard) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
        {children}
      </div>
    );
  }

  return (
    <div className={layoutStyles.layoutWrapper}>
      {isMobileNavOpen && (
        <div 
          className={layoutStyles.mobileBackdrop} 
          onClick={() => setIsMobileNavOpen(false)}
        ></div>
      )}
      <Sidebar 
        isMobileNavOpen={isMobileNavOpen} 
        closeMobileNav={() => setIsMobileNavOpen(false)} 
        openMobileNav={() => setIsMobileNavOpen(true)}
      />
      <div className={layoutStyles.mainContent}>
        <Header onOpenMobileNav={() => setIsMobileNavOpen(true)} />
        <main className={layoutStyles.pageContent}>
          {children}
        </main>
      </div>
      <FloatingActionButton />
    </div>
  );
}
