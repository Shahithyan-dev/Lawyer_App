'use client';

import React, { useState } from 'react';
import styles from '@/app/Dashboard.module.css';
import { Save, Settings, Shield, User, MapPin, Mail, Phone, Globe } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firmName: 'Media Wave Legal',
    email: 'contact@mediawavelegal.com',
    phone: '+91 98765 43210',
    address: '123 Legal Avenue, High Court Road, Mumbai',
    website: 'www.mediawavelegal.com',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate save
    setTimeout(() => {
      setLoading(false);
      alert('Settings saved successfully!');
    }, 800);
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div className={styles.headerTextContent}>
          <h1 className={styles.title}>System Settings</h1>
          <p className={styles.subtitle}>Configure firm profile, preferences, and security.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        
        {/* Settings Navigation */}
        <div style={{ flex: '0 0 250px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            onClick={() => setActiveTab('profile')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', 
              backgroundColor: activeTab === 'profile' ? 'var(--accent-light)' : 'transparent',
              color: activeTab === 'profile' ? 'var(--accent-color)' : 'var(--text-secondary)',
              border: 'none', fontWeight: 600, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
            }}
          >
            <User size={18} /> Firm Profile
          </button>
          
          <button 
            onClick={() => setActiveTab('preferences')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', 
              backgroundColor: activeTab === 'preferences' ? 'var(--accent-light)' : 'transparent',
              color: activeTab === 'preferences' ? 'var(--accent-color)' : 'var(--text-secondary)',
              border: 'none', fontWeight: 600, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
            }}
          >
            <Settings size={18} /> System Preferences
          </button>

          <button 
            onClick={() => setActiveTab('security')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', 
              backgroundColor: activeTab === 'security' ? 'var(--accent-light)' : 'transparent',
              color: activeTab === 'security' ? 'var(--accent-color)' : 'var(--text-secondary)',
              border: 'none', fontWeight: 600, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
            }}
          >
            <Shield size={18} /> Security
          </button>
        </div>

        {/* Settings Content Area */}
        <div className={styles.card} style={{ flex: '1', minWidth: '300px' }}>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {activeTab === 'profile' && (
              <>
                <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>Firm Profile</h2>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Update your legal firm's details which may appear on invoices.</p>
                </div>

                <div className={styles.formGrid}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>Firm Name</label>
                    <div style={{ position: 'relative' }}>
                       <span style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-tertiary)' }}><User size={16} /></span>
                       <input type="text" name="firmName" value={formData.firmName} onChange={handleChange} required style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>Email Address</label>
                    <div style={{ position: 'relative' }}>
                       <span style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-tertiary)' }}><Mail size={16} /></span>
                       <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
                    </div>
                  </div>
                </div>

                <div className={styles.formGrid}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>Phone Number</label>
                    <div style={{ position: 'relative' }}>
                       <span style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-tertiary)' }}><Phone size={16} /></span>
                       <input type="text" name="phone" value={formData.phone} onChange={handleChange} required style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>Website</label>
                    <div style={{ position: 'relative' }}>
                       <span style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-tertiary)' }}><Globe size={16} /></span>
                       <input type="text" name="website" value={formData.website} onChange={handleChange} required style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
                    </div>
                  </div>
                </div>

                 <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>Office Address</label>
                    <div style={{ position: 'relative' }}>
                       <span style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-tertiary)' }}><MapPin size={16} /></span>
                       <input type="text" name="address" value={formData.address} onChange={handleChange} required style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
                    </div>
                  </div>
              </>
            )}

            {activeTab === 'preferences' && (
              <>
                <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>System Preferences</h2>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Configure global settings for the CRM application.</p>
                </div>

                <div className={styles.formGrid}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>Timezone</label>
                    <select name="timezone" value={formData.timezone} onChange={handleChange} style={{ padding: '10px 12px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}>
                      <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                      <option value="Europe/London">Europe/London (GMT)</option>
                      <option value="America/New_York">America/New_York (EST)</option>
                    </select>
                  </div>

                   <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>Date Format</label>
                    <select name="dateFormat" value={formData.dateFormat} onChange={handleChange} style={{ padding: '10px 12px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'security' && (
              <>
                <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>Security</h2>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Manage your password and authentication settings.</p>
                </div>

                <div className={styles.formGrid}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>Current Password</label>
                    <input type="password" placeholder="••••••••" style={{ padding: '10px 12px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
                  </div>
                </div>
                <div className={styles.formGrid}>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>New Password</label>
                    <input type="password" placeholder="••••••••" style={{ padding: '10px 12px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>Confirm New Password</label>
                    <input type="password" placeholder="••••••••" style={{ padding: '10px 12px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
                  </div>
                </div>
              </>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
              <button type="submit" className={styles.btnPrimary} disabled={loading}>
                {loading ? 'Saving...' : <><Save size={18} /> Save Settings</>}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
