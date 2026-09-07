'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Phone, Mail, MapPin, Briefcase, FileText, Activity } from 'lucide-react';
import styles from '@/app/Dashboard.module.css';

export default function ClientProfilePage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`http://10.252.32.1:5000/api/clients/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Client not found');
        return res.json();
      })
      .then(data => {
        setClient(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div style={{ padding: '48px', textAlign: 'center' }}>Loading client details...</div>;
  if (error) return <div style={{ padding: '48px', textAlign: 'center', color: 'red' }}>{error}</div>;
  if (!client) return null;

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <Link href="/clients" style={{ color: 'var(--text-secondary)', marginRight: '12px' }}>
              <ArrowLeft size={24} style={{ verticalAlign: 'middle' }} />
            </Link>
            Client Profile
          </h1>
          <p className={styles.subtitle} style={{ marginLeft: '36px' }}>{client.clientId} • {client.status}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className={styles.btnSecondary}>Edit Profile</button>
          <button className={styles.btnPrimary}>+ New Case</button>
        </div>
      </div>

      <div className={styles.mainGrid}>
        {/* Left Column - Personal Info */}
        <div className={styles.card} style={{ gridColumn: 'span 1' }}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <User size={18} />
              Personal Details
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--accent-light)', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                {client.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>{client.name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Added {new Date(client.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
            
            <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '8px 0' }}></div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Phone size={16} style={{ color: 'var(--text-tertiary)' }} />
                <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>{client.mobile}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Mail size={16} style={{ color: 'var(--text-tertiary)' }} />
                <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>{client.email || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <MapPin size={16} style={{ color: 'var(--text-tertiary)', marginTop: '2px' }} />
                <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: 1.4 }}>{client.address || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Linked Cases & Activity */}
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Linked Cases */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>
                <Briefcase size={18} />
                Linked Cases
              </div>
            </div>
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
              No cases linked to this client yet. <br/>
              <Link href="/cases/new" style={{ color: 'var(--primary-color)', fontWeight: 500, textDecoration: 'none' }}>Create their first case</Link>
            </div>
          </div>

          {/* Client Documents */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>
                <FileText size={18} />
                Client Documents
              </div>
              <button className={styles.btnSecondary} style={{ padding: '4px 8px', fontSize: '0.75rem' }}>Upload</button>
            </div>
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
              No documents uploaded.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
