'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/app/Dashboard.module.css';
import { Bell, CheckCircle2, AlertCircle, Calendar as CalIcon, FileText } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [vapidKey, setVapidKey] = useState<string>('');

  useEffect(() => {
    fetchVapidKey();
    fetchNotifications();
    checkPushStatus();
  }, []);

  const fetchVapidKey = async () => {
    try {
      const res = await fetch('http://10.252.32.1:5000/api/notifications/config/vapidPublicKey');
      const data = await res.json();
      setVapidKey(data.publicKey);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchNotifications = async () => {
    try {
      const userStr = localStorage.getItem('lexoraUser');
      if (!userStr) return;
      const user = JSON.parse(userStr);
      
      const res = await fetch(`http://10.252.32.1:5000/api/notifications/${user._id}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`http://10.252.32.1:5000/api/notifications/${id}/read`, { method: 'PUT' });
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (e) {
      console.error(e);
    }
  };

  const checkPushStatus = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setPushEnabled(!!subscription);
    }
  };

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const enablePush = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      alert("Push notifications are not supported in this browser.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        alert("You denied notification permissions.");
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();
      
      if (!subscription) {
        const convertedVapidKey = urlBase64ToUint8Array(vapidKey);
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey
        });
      }

      const userStr = localStorage.getItem('lexoraUser');
      if (userStr) {
        const user = JSON.parse(userStr);
        await fetch('http://10.252.32.1:5000/api/notifications/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user._id,
            subscription: subscription
          })
        });
      }
      
      setPushEnabled(true);
      alert("Push notifications successfully enabled!");
    } catch (e) {
      console.error(e);
      alert("Failed to enable push notifications.");
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Hearing': return <CalIcon size={20} color="var(--primary-color)" />;
      case 'Task': return <CheckCircle2 size={20} color="var(--status-success-text)" />;
      case 'Document': return <FileText size={20} color="var(--status-pending-text)" />;
      default: return <Bell size={20} color="var(--text-secondary)" />;
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className={styles.headerTextContent}>
          <h1 className={styles.title}>Notifications</h1>
          <p className={styles.subtitle}>View your recent alerts, reminders, and system messages.</p>
        </div>
        {!pushEnabled && (
          <button onClick={enablePush} style={{ padding: '8px 16px', backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '4px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={16} /> Enable Push Alerts
          </button>
        )}
      </div>

      <div className={styles.card}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: '64px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <CheckCircle2 size={48} color="var(--status-success-text)" style={{ opacity: 0.5, margin: '0 auto 16px auto', display: 'block' }} />
            <h3 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>You're all caught up!</h3>
            <p>You have no new notifications right now.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {notifications.map(notif => (
              <div 
                key={notif._id} 
                onClick={() => !notif.isRead && markAsRead(notif._id)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '16px', 
                  padding: '16px 24px', 
                  borderBottom: '1px solid var(--border-color)',
                  backgroundColor: notif.isRead ? 'transparent' : 'rgba(198, 161, 91, 0.05)',
                  cursor: notif.isRead ? 'default' : 'pointer'
                }}
              >
                <div style={{ marginTop: '2px' }}>
                  {getIcon(notif.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <h4 style={{ margin: 0, fontWeight: notif.isRead ? 500 : 600, color: 'var(--text-primary)' }}>
                      {notif.title}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{notif.message}</p>
                </div>
                {!notif.isRead && (
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', alignSelf: 'center' }} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
